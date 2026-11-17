import Image from "next/image";
import Link from "next/link";
import type { headToHead } from "@/lib/directory";

type Col = ReturnType<typeof headToHead>[number] & { logo: string; line: string };

/** Side-by-side for the casinos the site profiles in depth. Columns on desktop, swipeable cards on phones. */
export function HeadToHead({ cols }: { cols: Col[] }) {
  const rows: [string, (c: Col) => string][] = [
    ["30-day deposits", (c) => c.deposits ?? "—"],
    ["Hot-wallet balance", (c) => c.wallet ?? "—"],
    ["KYC", (c) => c.kyc],
    ["Withdrawal time", (c) => c.withdrawal],
    ["Bonus wagering", (c) => c.wagering],
    ["Slot RTPs read", (c) => c.rtp],
    ["Licence", (c) => c.licence],
    ["Leading coins", (c) => c.coins || "—"],
  ];
  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
      {cols.map((c, i) => (
        <article key={c.slug} className={`ccs-card relative flex w-[85%] shrink-0 snap-start flex-col overflow-hidden md:w-auto ${i === 0 ? "ccs-card-glow" : ""}`}>
          <div className="flex items-center gap-4 border-b border-border p-5">
            <Image src={c.logo} alt={`${c.name} logo`} width={56} height={56} className="h-14 w-14 rounded-2xl object-cover" />
            <div className="min-w-0">
              <h3 className="ccs-display text-2xl">{c.name}</h3>
              <p className="text-sm text-text-muted">{c.line}</p>
            </div>
          </div>
          <dl className="flex-1">
            {rows.map(([k, f]) => (
              <div key={k} className="flex items-baseline justify-between gap-4 border-t border-row-divider px-5 py-3 first:border-t-0">
                <dt className="shrink-0 text-xs text-text-dim">{k}</dt>
                <dd className="min-w-0 text-right text-sm font-semibold text-text-primary">{f(c)}</dd>
              </div>
            ))}
          </dl>
          <div className="flex gap-2 border-t border-border p-4">
            {c.link && (
              <a href={`/go/${c.slug}/?p=head-to-head`} rel="nofollow sponsored" className="ccs-btn-primary flex-1 !py-2 text-sm">Play {c.name}</a>
            )}
            <Link href={c.path} className="ccs-btn-ghost flex-1 !py-2 text-sm">Full stats</Link>
          </div>
        </article>
      ))}
    </div>
  );
}
