import ops from "@/data/ops.json";

/**
 * Affiliate links leave the site through /go/<slug> (app/go/[slug]/route.ts),
 * never straight from a button: one place to count a click, one place to change
 * a link, and no tracking URL in the HTML. Links are the network's own
 * (data/ops.json, shared with CryptoSlotGuide), e.g. Razed ?raf=SLOTGUIDE.
 */
type Linkable = { slug: string; affiliate?: boolean; signupUrl?: string };

export const goPath = (slug: string) => `/go/${encodeURIComponent(slug)}/`;

const RAW = ops as Linkable[];

/** Casinos with their own page on this site, at the paths the old site used. */
export const CASINO_PAGES: Record<string, string> = { stake: "/stake/", roobet: "/roobet/", razed: "/razed/" };

/** Our own page for a slug: where /go/ sends a click that has no live link. */
export function reviewPath(slug: string): string {
  return CASINO_PAGES[slug] ?? "/casinos/";
}

export const hasLink = (slug: string) => !!RAW.find((r) => r.slug === slug && r.affiliate && r.signupUrl);

/** The operator's real tracking URL for a slug, or null when it has none. Server only. */
export function affiliateTarget(slug: string): string | null {
  const x = RAW.find((r) => r.slug === slug && r.affiliate && r.signupUrl);
  if (!x?.signupUrl) return null;
  try {
    const u = new URL(x.signupUrl);
    return u.protocol === "https:" ? u.href : null;
  } catch {
    return null;
  }
}

/** A copy of the record whose signupUrl is /go/<slug>, so pages never hold a tracking URL (used by lib/site-data.ts). */
export function viaGo<T extends Linkable>(x: T): T {
  return x.affiliate && x.signupUrl ? { ...x, signupUrl: goPath(x.slug) } : x;
}
