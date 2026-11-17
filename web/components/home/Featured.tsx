import Image from "next/image";
import Link from "next/link";
import type { featured } from "@/lib/home-data";

/** The three casinos the site has always profiled, with their numbers next to the button. Labelled as partners. */
export function Featured({ items }: { items: ReturnType<typeof featured> }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {items.map((c, i) => (
        <article key={c.slug} className={`ccs-card ccs-lift relative flex min-w-0 flex-col overflow-hidden p-6 ${i === 0 ? "ccs-card-glow" : ""}`}>
          <span className="absolute right-4 top-4 rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-text-dim">Partner</span>
          <Image src={c.logo} alt={`${c.name} logo`} width={64} height={64} className="h-14 w-14 rounded-2xl object-cover" />
          <h3 className="ccs-display mt-4 text-2xl">{c.name}</h3>
          <p className="mt-1 text-sm text-text-muted">{c.line}</p>
          <dl className="mt-5 grid grid-cols-2 gap-2 text-sm">
            <div className="col-span-2 rounded-xl bg-page px-3 py-2.5">
              <dt className="text-xs text-text-dim">30-day on-chain deposits</dt>
              <dd className="ccs-num mt-0.5 text-xl font-semibold text-text-primary">{c.deposits?.value ?? "—"}</dd>
            </div>
            <div className="rounded-xl bg-page px-3 py-2.5">
              <dt className="text-xs text-text-dim">KYC</dt>
              <dd className="mt-0.5 font-semibold text-text-primary">{c.kyc}</dd>
            </div>
            <div className="rounded-xl bg-page px-3 py-2.5">
              <dt className="text-xs text-text-dim">Withdrawal</dt>
              <dd className="mt-0.5 font-semibold text-text-primary">{c.withdrawal}</dd>
            </div>
          </dl>
          <div className="mt-auto flex gap-2 pt-6">
            {c.link && (
              <a href={`/go/${c.slug}/?p=home-featured`} rel="nofollow sponsored" className="ccs-btn-primary flex-1 text-center">
                Visit {c.name}
              </a>
            )}
            <Link href={c.path} className="ccs-btn-ghost flex-1 text-center">Full stats</Link>
          </div>
        </article>
      ))}
    </div>
  );
}
