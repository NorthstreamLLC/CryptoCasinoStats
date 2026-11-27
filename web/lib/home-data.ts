import { volumeTable, latestRun, isCurrent } from "./volume";
import { ageDays } from "./site";
import { RTP_REVIEW_DAYS } from "./slots";
import { allCasinos, casinoPath, atAGlance, OPS } from "./casinos";
import { allReadings, getGame } from "./slots";
import { hasLink } from "./outbound";
import { kycTierOf } from "./kyc";
import { payoutView, payoutText } from "./payout";
import { wagerView } from "./wager";
import { getCasinoSpecSheet } from "./spec-sheet";
import coinsBy from "@/data/coinsBy.json";

/**
 * Everything the home page shows, computed from the shared data files. Every
 * figure keeps its source and date; totals say what they sum and over which
 * dates, because the figures on file were read on different days.
 */

export interface BoardRow {
  slug: string;
  name: string;
  mono: string;
  path: string;
  value: string;
  num: number;
  source: string;
  sourceUrl: string;
  asOf: string;
}

export interface OtherRow extends BoardRow {
  reason: string;
}

/**
 * The ranking for one metric: FairGambling figures read in the current window
 * (comparable, ranked), and everything else (older FairGambling figures, or a
 * casino only another tracker covers), listed apart with the reason.
 */
function board(metric: "deposits" | "wallet"): { rows: BoardRow[]; other: OtherRow[] } {
  const ref = latestRun();
  const rows: BoardRow[] = [];
  const other: OtherRow[] = [];
  for (const r of volumeTable()) {
    const list = metric === "deposits" ? r.deposits : r.wallet;
    const fg = list.find((x) => x.source === "FairGambling");
    const f = fg ?? list[0];
    if (!f || !Number.isFinite(f.num)) continue;
    const o = OPS.find((x) => x.slug === r.slug);
    const row = { slug: r.slug, name: r.name, mono: o?.mono ?? r.name.slice(0, 2).toUpperCase(), path: casinoPath(r.slug), value: f.value, num: f.num, source: f.source, sourceUrl: f.sourceUrl, asOf: f.asOf };
    if (fg && isCurrent(fg.asOf, ref)) rows.push(row);
    else other.push({ ...row, reason: fg ? "Not re-read this week" : `${f.source} only` });
  }
  rows.sort((a, b) => b.num - a.num);
  other.sort((a, b) => b.asOf.localeCompare(a.asOf) || b.num - a.num);
  return { rows, other };
}

const fmtBig = (n: number) => (n >= 1e9 ? `$${(n / 1e9).toFixed(2)}B` : `$${Math.round(n / 1e6)}M`);

/**
 * Headline figures. Totals add up only FairGambling figures read in the current
 * window (the latest weekly run), so every number in a total covers nearly the
 * same 30 days; older figures are counted apart and named as excluded.
 */
export function heroStats() {
  const ref = latestRun();
  const dep = board("deposits");
  const wal = board("wallet");
  const readings = allReadings();
  const lastRead = readings.map((r) => r.checkedAt).sort().at(-1)!;
  return {
    run: ref,
    deposits: { value: fmtBig(dep.rows.reduce((a, b) => a + b.num, 0)), casinos: dep.rows.length, stale: dep.other.filter((r) => r.source === "FairGambling").length },
    wallets: { value: fmtBig(wal.rows.reduce((a, b) => a + b.num, 0)), casinos: wal.rows.length, stale: wal.other.filter((r) => r.source === "FairGambling").length },
    fgCovered: dep.rows.length + dep.other.filter((r) => r.source === "FairGambling").length,
    readings: { value: String(readings.length), casinos: new Set(readings.map((r) => r.operatorSlug)).size, to: lastRead, ageDays: ageDays(lastRead), overdue: ageDays(lastRead) > RTP_REVIEW_DAYS },
    casinosTracked: OPS.length,
    updated: [ref, lastRead].sort().at(-1)!,
  };
}

export function leaderboards(limit = 10) {
  const d = board("deposits");
  const w = board("wallet");
  return { asOf: latestRun(), deposits: d.rows.slice(0, limit), wallet: w.rows.slice(0, limit), depositsOther: d.other, walletOther: w.other };
}

export interface FinderCasino {
  slug: string;
  name: string;
  mono: string;
  path: string;
  link: boolean;
  kyc: string;
  noKyc: boolean;
  withdrawal: string;
  instant: boolean;
  wagering: string;
  noWagering: boolean;
  sol: boolean;
  sports: boolean;
}

export function finderCasinos(): FinderCasino[] {
  return allCasinos().map((o) => {
    const g = atAGlance(o);
    const tier = kycTierOf(o.slug);
    const pv = payoutView(o);
    const wv = wagerView(o);
    const coins = ((coinsBy as Record<string, string[]>)[o.slug] ?? []).map((c) => c.toUpperCase());
    return {
      slug: o.slug,
      name: o.name,
      mono: o.mono,
      path: casinoPath(o.slug),
      link: hasLink(o.slug),
      kyc: g.kyc?.label ?? "Not classified",
      noKyc: tier === "never" || tier === "discretionary",
      withdrawal: payoutText(o),
      instant: pv.mins === 0,
      wagering: wv.label.charAt(0).toUpperCase() + wv.label.slice(1),
      noWagering: wv.kind === "none" || (wv.kind === "cited" && wv.mult === 0),
      sol: coins.includes("SOL"),
      sports: !!o.sports,
    };
  });
}

export interface RtpSlot {
  slug: string;
  name: string;
  provider: number | null;
  readings: { casino: string; slug: string; rtp: number; date: string }[];
}

export function rtpSlots(): RtpSlot[] {
  const rs = allReadings();
  const names = Object.fromEntries(OPS.map((o) => [o.slug, o.name]));
  const slugs = [...new Set(rs.map((r) => r.slotSlug))];
  return slugs
    .map((s) => ({
      slug: s,
      name: getGame(s)?.name ?? s,
      provider: getGame(s)?.rtp ?? null,
      readings: rs.filter((r) => r.slotSlug === s).map((r) => ({ casino: names[r.operatorSlug] ?? r.operatorSlug, slug: r.operatorSlug, rtp: r.rtp, date: r.checkedAt })),
    }))
    .sort((a, b) => b.readings.length - a.readings.length);
}

export function sourcedFactCount(): number {
  return OPS.reduce((n, o) => n + (getCasinoSpecSheet(o.slug)?.groups.flatMap((g) => g.facts).filter((f) => f.sourceUrl).length ?? 0), 0);
}

export function featured() {
  const logos: Record<string, string> = {
    roobet: "/wp-content/uploads/2025/07/roobet-logo.png",
    stake: "/wp-content/uploads/2025/07/Untitled-design-79.png",
    razed: "/wp-content/uploads/2025/07/images.jpeg",
  };
  const lines: Record<string, string> = {
    roobet: "Fast, fun, and user-friendly, with unique in-house games.",
    stake: "Leading crypto casino with a massive community and fast payouts.",
    razed: "Next-gen crypto casino known for exclusive high-reward slots.",
  };
  const dep = board("deposits").rows;
  return ["roobet", "stake", "razed"].map((slug) => {
    const o = OPS.find((x) => x.slug === slug)!;
    const g = atAGlance(o);
    const d = dep.find((r) => r.slug === slug);
    return { slug, name: o.name, logo: logos[slug], line: lines[slug], path: casinoPath(slug), link: hasLink(slug), deposits: d ?? null, kyc: g.kyc?.label ?? "—", withdrawal: g.withdrawal.label, wagering: g.wagering.charAt(0).toUpperCase() + g.wagering.slice(1) };
  });
}
