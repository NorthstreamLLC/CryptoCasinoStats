import ops from "@/data/ops.json";
import coinsBy from "@/data/coinsBy.json";
import { inHouseOrder } from "./house-order";
import { payoutView } from "./payout";
import { wagerView } from "./wager";
import { kycTierOf, kycWhy, KYC_TIER_LABEL, kycTierDescription } from "./kyc";
import { getCasinoSpecSheet } from "./spec-sheet";
import type { Operator, SpecFact } from "./types";

/**
 * Every casino the network tracks (data/ops.json, shared with CryptoSlotGuide),
 * as this site shows them. Stake, Roobet and Razed keep the root paths the old
 * WordPress site gave them; every other casino lives at /casinos/<slug>/.
 */
export const OPS = ops as Operator[];
const ROOT_PAGES = new Set(["stake", "roobet", "razed"]);

export const casinoPath = (slug: string) => (ROOT_PAGES.has(slug) ? `/${slug}/` : `/casinos/${slug}/`);
export const isRootCasino = (slug: string) => ROOT_PAGES.has(slug);
export const getCasino = (slug: string) => OPS.find((o) => o.slug === slug) ?? null;
export const allCasinos = () => inHouseOrder(OPS);

export interface AtAGlance {
  kyc: { label: string; why?: string; description: string } | null;
  withdrawal: { label: string; caption: string };
  wagering: string;
  bonus: string | null;
  coins: string[];
  licence: string;
}

export function atAGlance(o: Operator): AtAGlance {
  const tier = kycTierOf(o.slug);
  const pv = payoutView(o);
  const wv = wagerView(o);
  return {
    kyc: tier ? { label: KYC_TIER_LABEL[tier], why: kycWhy(o.slug), description: kycTierDescription(tier) } : null,
    withdrawal: { label: pv.label, caption: pv.caption },
    wagering: wv.label,
    bonus: o.bonusShort ?? null,
    coins: (coinsBy as Record<string, string[]>)[o.slug] ?? [],
    licence: o.licence,
  };
}

/** A fact's first sentence, so a stats page states the fact and links the casino's own page for the detail. */
export function shortFact(f: SpecFact, max = 200): string {
  if (f.chips) return f.chips.join(", ");
  const v = f.value ?? "";
  const first = v.split(/(?<=[.;])\s+(?=[A-Z])/)[0] ?? v;
  return first.length > max ? `${first.slice(0, max - 1).replace(/[\s,;-]+$/, "")}…` : first;
}

/** Spec-sheet groups in display order, casino facts only. */
const GROUP_ORDER = ["Compliance", "Payouts & fees", "Coins & deposit limits", "Bonus terms", "Sportsbook", "Sports bonus terms"];
export function specGroups(slug: string) {
  const s = getCasinoSpecSheet(slug);
  if (!s) return [];
  return s.groups.filter((g) => GROUP_ORDER.includes(g.title)).sort((a, b) => GROUP_ORDER.indexOf(a.title) - GROUP_ORDER.indexOf(b.title));
}
