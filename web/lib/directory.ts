import { allCasinos, atAGlance, casinoPath } from "./casinos";
import { volumeTable } from "./volume";
import { hasLink } from "./outbound";
import { kycTierOf, type KycTier } from "./kyc";
import { payoutView, payoutText } from "./payout";
import { wagerView } from "./wager";
import { readingsFor, rtpStatus } from "./slots";
import coinsBy from "@/data/coinsBy.json";
import type { DirRow } from "@/components/casinos/Directory";

const KYC_RANK: Record<KycTier, number> = { never: 0, discretionary: 1, threshold: 2, conflicting: 3, required: 4 };

/** One row per tracked casino, in house order, with every value the directory sorts or filters on. */
export function directoryRows(): DirRow[] {
  const vt = volumeTable();
  return allCasinos().map((o) => {
    const g = atAGlance(o);
    const v = vt.find((r) => r.slug === o.slug);
    const d = v?.deposits.find((x) => x.source === "FairGambling") ?? v?.deposits[0];
    const w = v?.wallet[0];
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
      deposits: d?.value ?? null,
      depNum: d?.num ?? -1,
      wallet: w?.value ?? null,
      walNum: w?.num ?? -1,
      kyc: g.kyc?.label ?? "Not classified",
      kycRank: tier ? KYC_RANK[tier] : 9,
      withdrawal: payoutText(o),
      withdrawalMins: pv.mins ?? 1e9,
      wagering: wv.label.charAt(0).toUpperCase() + wv.label.slice(1),
      licence: o.licence,
      noKyc: tier === "never" || tier === "discretionary",
      instant: pv.mins === 0,
      noWagering: wv.kind === "none" || (wv.kind === "cited" && wv.mult === 0),
      sol: coins.includes("SOL"),
      sports: !!o.sports,
    };
  });
}

/** Head-to-head rows for a few casinos, every value from the shared data. */
export function headToHead(slugs: string[]) {
  const rows = directoryRows();
  return slugs.map((s) => {
    const r = rows.find((x) => x.slug === s)!;
    const rd = readingsFor(s);
    const lo = rd.length ? Math.min(...rd.map((x) => x.rtp)) : null;
    const hi = rd.length ? Math.max(...rd.map((x) => x.rtp)) : null;
    return {
      ...r,
      coins: ((coinsBy as Record<string, string[]>)[s] ?? []).slice(0, 6).join(" · "),
      rtp: rd.length ? `${rd.length} slots, ${lo!.toFixed(2)}–${hi!.toFixed(2)}% (read ${new Date(`${rd.map((x) => x.checkedAt).sort().at(-1)}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" })}${rtpStatus().overdue ? ", historical" : ""})` : "—",
      rtpDate: rd.map((x) => x.checkedAt).sort().at(-1) ?? null,
    };
  });
}
