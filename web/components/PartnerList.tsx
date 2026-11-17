import Link from "next/link";
import { pickPartners, type PartnerContext } from "@/lib/partner-fit";
import { GeoRanked } from "@/components/geo/GeoRanked";
import { goPath } from "@/lib/outbound";
import { casinoPath } from "@/lib/casinos";

/**
 * Where to play: partner casinos for this page, Roobet first, the rest in the
 * order lib/partner-fit.ts scores them for the page. GeoRanked drops any the
 * visitor's country is turned away by, so a few spares are sent.
 *
 * Kept visually apart from the data: placement here is commercial, and
 * nothing in a stats table is sorted or filtered by it.
 */
export function PartnerList({ title = "Where to play", context, seed, exclude = [], count = 3 }: { title?: string; context?: PartnerContext; seed: string; exclude?: string[]; count?: number }) {
  const picks = pickPartners({ context, seed, exclude, limit: count + 4 });
  picks.sort((a, b) => Number(b.o.slug === "roobet") - Number(a.o.slug === "roobet"));
  const items = picks.map((p) => ({
    slug: p.o.slug,
    node: (
      <div className="flex flex-col gap-3 rounded-[14px] border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-text-primary">{p.o.name}</span>
            <Link href={casinoPath(p.o.slug)} className="text-xs text-accent hover:underline">
              stats
            </Link>
          </div>
          <p className="mt-1 text-sm text-text-muted">{p.pitch}</p>
        </div>
        <a href={`${goPath(p.o.slug)}?p=partner-list`} rel="nofollow sponsored" className="inline-flex shrink-0 items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-page hover:bg-accent-bright">
          Visit {p.o.name}
        </a>
      </div>
    ),
  }));
  return (
    <aside aria-label={title} className="mt-12">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-bold text-text-primary">{title}</h2>
        <Link href="/affiliate-disclosure/" className="text-xs text-text-dim hover:text-text-primary">
          Ad · we may earn a commission
        </Link>
      </div>
      <div className="grid gap-3">
        <GeoRanked items={items} count={count} note={<p className="mt-2 text-xs text-text-dim">These casinos may not accept players from your country. Check before you sign up.</p>} />
      </div>
    </aside>
  );
}
