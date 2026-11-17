import { volumeTable, latestAsOf, earliestAsOf, parseMoney } from "./volume";
import { allCasinos, casinoPath, atAGlance, OPS } from "./casinos";
import { allReadings, getGame } from "./slots";
import { hasLink } from "./outbound";
import { kycTierOf } from "./kyc";
import { payoutView } from "./payout";
import { wagerView } from "./wager";
import { getCasinoSpecSheet } from "./spec-sheet";
import coinsBy from "@/data/coinsBy.json";
import onChain from "@/data/onChainVolume.json";
import type { OnChainVolumeEntry } from "./types";

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

function board(metric: "deposits" | "wallet"): BoardRow[] {
  return volumeTable()
    .map((r) => {
      const list = metric === "deposits" ? r.deposits : r.wallet;
      const f = list.find((x) => x.source === "FairGambling") ?? list[0];
      if (!f || !Number.isFinite(f.num)) return null;
      const o = OPS.find((x) => x.slug === r.slug);
      return { slug: r.slug, name: r.name, mono: o?.mono ?? r.name.slice(0, 2).toUpperCase(), path: casinoPath(r.slug), value: f.value, num: f.num, source: f.source, sourceUrl: f.sourceUrl, asOf: f.asOf };
    })
    .filter((x): x is BoardRow => !!x)
    .sort((a, b) => b.num - a.num);
}

const fmtBig = (n: number) => (n >= 1e9 ? `$${(n / 1e9).toFixed(2)}B` : `$${Math.round(n / 1e6)}M`);

export function heroStats() {
  const entries = onChain as OnChainVolumeEntry[];
  const pickFG = (metric: string) =>
    entries.flatMap((e) => e.sources.filter((s) => s.source === "FairGambling" && s.metric === metric).slice(0, 1)).map((s) => ({ n: parseMoney(s.value), d: s.asOf }));
  const dep = pickFG("30-day deposit volume");
  const wal = pickFG("Hot wallet balance (all chains)");
  const readings = allReadings();
  const range = (xs: { d: string }[]) => {
    const ds = xs.map((x) => x.d).sort();
    return { from: ds[0], to: ds.at(-1)! };
  };
  return {
    deposits: { value: fmtBig(dep.reduce((a, b) => a + b.n, 0)), casinos: dep.length, ...range(dep) },
    wallets: { value: fmtBig(wal.reduce((a, b) => a + b.n, 0)), casinos: wal.length, ...range(wal) },
    readings: { value: String(readings.length), casinos: new Set(readings.map((r) => r.operatorSlug)).size, to: readings.map((r) => r.checkedAt).sort().at(-1)! },
    casinosTracked: OPS.length,
    updated: [latestAsOf(), ...readings.map((r) => r.checkedAt)].sort().at(-1)!,
    dataFrom: earliestAsOf(),
  };
}

export const leaderboards = (limit = 10) => ({ deposits: board("deposits").slice(0, limit), wallet: board("wallet").slice(0, limit) });

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
      withdrawal: pv.label,
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
  const dep = board("deposits");
  return ["roobet", "stake", "razed"].map((slug) => {
    const o = OPS.find((x) => x.slug === slug)!;
    const g = atAGlance(o);
    const d = dep.find((r) => r.slug === slug);
    return { slug, name: o.name, logo: logos[slug], line: lines[slug], path: casinoPath(slug), link: hasLink(slug), deposits: d ?? null, kyc: g.kyc?.label ?? "—", withdrawal: g.withdrawal.label, wagering: g.wagering.charAt(0).toUpperCase() + g.wagering.slice(1) };
  });
}
