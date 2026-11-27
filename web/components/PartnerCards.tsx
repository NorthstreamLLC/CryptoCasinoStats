import Link from "next/link";
import { GeoRanked } from "@/components/geo/GeoRanked";
import type { PartnerCard } from "@/lib/partners";

/**
 * Partner casinos as cards with their numbers. Advertising, labelled as such;
 * casinos that turn the visitor's country away are swapped out in the browser.
 */
export function PartnerCards({ cards, placement, count = 3 }: { cards: PartnerCard[]; placement: string; count?: number }) {
  const items = cards.map((a) => ({
    slug: a.slug,
    node: (
      <article className="ccs-card ccs-lift flex min-w-0 flex-col p-5">
        <div className="flex items-center gap-3">
          <span aria-hidden className="ccs-num flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border-strong bg-surface-raised text-xs font-semibold text-accent">{a.mono}</span>
          <h3 className="truncate font-semibold text-text-primary">{a.name}</h3>
        </div>
        <p className="mt-3 text-sm text-text-secondary">{a.pitch}</p>
        <dl className="mt-4 grid grid-cols-3 gap-2 text-xs">
          {[
            ["Deposits", a.deposits ?? "—"],
            ["KYC", a.kyc],
            ["Stated payout", a.withdrawal],
          ].map(([k, v]) => (
            <div key={k} className="min-w-0 rounded-lg bg-page px-2.5 py-2">
              <dt className="text-text-dim">{k}</dt>
              <dd className="mt-0.5 font-semibold text-text-primary">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-auto flex gap-2 pt-4">
          <a href={`/go/${a.slug}/?p=${placement}`} rel="nofollow sponsored" className="ccs-btn-primary flex-1 !py-2 text-sm">Visit</a>
          <Link href={a.path} className="ccs-btn-ghost flex-1 !py-2 text-sm">Stats</Link>
        </div>
      </article>
    ),
  }));
  return (
    <>
      <div className={`grid grid-cols-1 gap-3 ${count >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
        <GeoRanked items={items} count={count} note={<p className="text-xs text-text-dim md:col-span-3">These casinos may not accept players from your country. Check before you sign up.</p>} />
      </div>
      <p className="mt-3 text-xs text-text-dim">Ad · partner casinos, ordered by fit for this page. <Link href="/affiliate-disclosure/" className="underline">How we make money</Link></p>
    </>
  );
}
