import Image from "next/image";
import Link from "next/link";
import { CountUp } from "@/components/home/CountUp";
import { rtpStatus } from "@/lib/slots";
import { fmtDate } from "@/lib/site";
import type { CasinoProfileData } from "@/lib/casino-profile";

export function ProfileHero({ p, logo, tagline }: { p: CasinoProfileData; logo?: string; tagline?: string }) {
  const { o } = p;
  const dep = p.deposits.find((d) => d.source === "FairGambling") ?? p.deposits[0];
  const wal = p.wallet[0];
  const lastRead = p.readings.map((r) => r.checkedAt).sort().at(-1);
  const stats = [
    dep && { value: dep.value, label: "30-day on-chain deposits", foot: p.rank ? `#${p.rank.pos} of ${p.rank.of} tracked · ${dep.source}, ${fmtDate(dep.asOf)}` : `${dep.source}, ${fmtDate(dep.asOf)}`, href: "#on-chain" },
    wal && { value: wal.value, label: "Hot-wallet balance", foot: `${p.walletRank ? `#${p.walletRank.pos} of ${p.walletRank.of} · ` : ""}${wal.source}, ${fmtDate(wal.asOf)}`, href: "#on-chain" },
    p.readings.length > 0 && { value: String(p.readings.length), label: rtpStatus().overdue ? "Slot RTPs read (historical)" : "Slot RTPs read here", foot: `On ${o.name}'s own pages, ${fmtDate(lastRead!)}${rtpStatus().overdue ? "; re-check overdue" : ""}`, href: "#slots" },
    { value: p.glance.withdrawal.label, label: "Stated withdrawal time", foot: p.glance.withdrawal.caption === "stated" ? `${o.name}'s own claim, not timed by us` : p.glance.withdrawal.caption, href: "#terms" },
  ].filter(Boolean).slice(0, 3) as { value: string; label: string; foot: string; href: string }[];
  const updated = [dep?.asOf, wal?.asOf, lastRead].filter(Boolean).sort().at(-1);

  return (
    <section className="ccs-hero relative overflow-hidden border-b border-border">
      <div aria-hidden className="ccs-grid absolute inset-0" />
      <div aria-hidden className="ccs-glow absolute left-[30%] top-[40%] h-[420px] w-[760px] -translate-x-1/2 -translate-y-1/2" />
      <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-8 sm:pb-14 sm:pt-12">
        <nav aria-label="Breadcrumb" className="ccs-eyebrow">
          <Link href="/" className="hover:text-text-primary">Home</Link> <span aria-hidden>/</span> <Link href="/casinos/" className="hover:text-text-primary">Casinos</Link> <span aria-hidden>/</span> <span className="text-text-secondary">{o.name}</span>
        </nav>
        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-5">
            {logo ? (
              <Image src={logo} alt={`${o.name} logo`} width={88} height={88} priority className="h-16 w-16 shrink-0 rounded-2xl border border-border-strong object-cover sm:h-[88px] sm:w-[88px]" />
            ) : (
              <span aria-hidden className="ccs-num flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-border-strong bg-surface-raised text-xl font-semibold text-accent sm:h-[88px] sm:w-[88px] sm:text-2xl">{o.mono}</span>
            )}
            <div className="min-w-0">
              {updated && (
                <p className="ccs-eyebrow inline-flex items-center gap-2">
                  <span className="ccs-pulse" aria-hidden /> Data as of {fmtDate(updated)}
                </p>
              )}
              <h1 className="ccs-display mt-2 text-4xl leading-none sm:text-6xl">{o.name}</h1>
              <p className="mt-3 max-w-xl text-text-secondary sm:text-lg">{tagline ?? `On-chain activity, verification policy, withdrawals and terms for ${o.name}, every figure sourced.`}</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            {p.link && (
              <a href={`/go/${o.slug}/?p=profile-hero`} rel="nofollow sponsored" className="ccs-btn-primary">
                Visit {o.name} →
              </a>
            )}
            <Link href="#compare" className="ccs-btn-ghost">Compare</Link>
          </div>
        </div>

        <div className="-mx-4 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
          {stats.map((s) => (
            <a key={s.label} href={s.href} className="ccs-card ccs-lift w-[78%] shrink-0 snap-start p-5 sm:w-auto">
              <div className="ccs-num truncate text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
                <CountUp value={s.value} />
              </div>
              <div className="mt-1.5 font-medium text-text-primary">{s.label}</div>
              <div className="mt-2 text-xs text-text-dim">{s.foot}</div>
            </a>
          ))}
        </div>
        {p.link && <p className="mt-4 text-xs text-text-dim">We may earn a commission if you sign up through our links. It never changes a figure. <Link href="/affiliate-disclosure/" className="underline">Disclosure</Link></p>}
      </div>
    </section>
  );
}
