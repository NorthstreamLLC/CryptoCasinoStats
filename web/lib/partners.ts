import { pickPartners, type PartnerContext } from "./partner-fit";
import { atAGlance, casinoPath } from "./casinos";
import { volumeTable } from "./volume";

export interface PartnerCard {
  slug: string;
  name: string;
  mono: string;
  path: string;
  pitch: string;
  kyc: string;
  withdrawal: string;
  deposits: string | null;
}

/** Partner casinos for a page, Roobet first, the rest as lib/partner-fit.ts scores them, each with its key numbers. */
export function partnerCards({ context, seed, exclude = [], limit = 7 }: { context?: PartnerContext; seed: string; exclude?: string[]; limit?: number }): PartnerCard[] {
  const vt = volumeTable();
  const cards = pickPartners({ context, seed, exclude, limit }).map((p) => {
    const g = atAGlance(p.o);
    const v = vt.find((r) => r.slug === p.o.slug);
    const d = v?.deposits.find((x) => x.source === "FairGambling") ?? v?.deposits[0];
    return { slug: p.o.slug, name: p.o.name, mono: p.o.mono, path: casinoPath(p.o.slug), pitch: p.pitch, kyc: g.kyc?.label ?? "—", withdrawal: g.withdrawal.label, deposits: d?.value ?? null };
  });
  return cards.sort((a, b) => Number(b.slug === "roobet") - Number(a.slug === "roobet"));
}
