import Link from "next/link";
import { CountUp } from "./CountUp";
import { fmtDate } from "@/lib/site";
import type { heroStats } from "@/lib/home-data";

type Stats = ReturnType<typeof heroStats>;

const span = (from: string, to: string) => (from === to ? fmtDate(to) : `${fmtDate(from)} to ${fmtDate(to)}`);

export function StatHero({ s }: { s: Stats }) {
  const cards = [
    { value: s.deposits.value, label: "30-day on-chain deposits", foot: `Sum of FairGambling's figures for ${s.deposits.casinos} casinos, ${span(s.deposits.from, s.deposits.to)}`, href: "/casinos/#volume" },
    { value: s.wallets.value, label: "Held in casino hot wallets", foot: `Sum across ${s.wallets.casinos} casinos, FairGambling, ${span(s.wallets.from, s.wallets.to)}`, href: "/casinos/#volume" },
    { value: s.readings.value, label: "Casino RTP readings", foot: `${s.readings.casinos} casinos, read on their own game pages, ${fmtDate(s.readings.to)}`, href: "/top-slots/#rtp-by-casino" },
  ];
  return (
    <section className="ccs-hero relative overflow-hidden border-b border-border">
      <div aria-hidden className="ccs-grid absolute inset-0" />
      <div aria-hidden className="ccs-glow absolute left-1/2 top-[55%] h-[520px] w-[900px] -translate-x-1/2 -translate-y-1/2" />
      <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-14 sm:pb-20 sm:pt-20">
        <p className="ccs-eyebrow inline-flex items-center gap-2">
          <span className="ccs-pulse" aria-hidden />
          Data updated {fmtDate(s.updated)} · {s.casinosTracked} casinos tracked
        </p>
        <h1 className="ccs-display mt-5 max-w-4xl text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-7xl">
          Where crypto casino money <span className="text-accent">actually</span> goes.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-text-secondary sm:text-xl">
          On-chain deposits, wallet balances and the RTP each casino really runs. Every number links to its source.
        </p>

        <div className="-mx-4 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
          {cards.map((c) => (
            <Link key={c.label} href={c.href} className="ccs-card ccs-lift group w-[78%] shrink-0 snap-start p-5 sm:w-auto sm:p-6">
              <div className="ccs-num text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
                <CountUp value={c.value} />
              </div>
              <div className="mt-2 font-medium text-text-primary">{c.label}</div>
              <div className="mt-3 text-xs leading-relaxed text-text-dim">{c.foot}</div>
              <div className="mt-4 text-xs font-semibold text-accent opacity-80 transition group-hover:opacity-100">View data →</div>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href="#leaderboard" className="ccs-btn-primary">Explore the leaderboard →</Link>
          <Link href="#finder" className="text-sm font-semibold text-text-secondary underline-offset-4 hover:text-text-primary hover:underline">
            Find a casino that fits
          </Link>
        </div>
      </div>
    </section>
  );
}
