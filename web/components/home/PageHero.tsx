import Link from "next/link";
import type { ReactNode } from "react";
import { CountUp } from "./CountUp";

export interface HeroStat {
  value: string;
  label: string;
  foot: string;
  href: string;
}

/** Hero for the section pages: eyebrow, display title, lede, three linked figures, two actions. Same look as the home hero. */
export function PageHero({ eyebrow, title, lede, stats, primary, secondary }: { eyebrow: ReactNode; title: ReactNode; lede: ReactNode; stats: HeroStat[]; primary: { href: string; label: string }; secondary?: { href: string; label: string } }) {
  return (
    <section className="ccs-hero relative overflow-hidden border-b border-border">
      <div aria-hidden className="ccs-grid absolute inset-0" />
      <div aria-hidden className="ccs-glow absolute left-1/2 top-[60%] h-[480px] w-[860px] -translate-x-1/2 -translate-y-1/2" />
      <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-12 sm:pb-16 sm:pt-16">
        <p className="ccs-eyebrow inline-flex items-center gap-2">
          <span className="ccs-pulse" aria-hidden />
          {eyebrow}
        </p>
        <h1 className="ccs-display mt-5 max-w-4xl text-[2.5rem] leading-[1.03] sm:text-6xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg text-text-secondary">{lede}</p>
        <div className="-mx-4 mt-9 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
          {stats.map((s) => (
            <Link key={s.label} href={s.href} className="ccs-card ccs-lift group w-[78%] shrink-0 snap-start p-5 sm:w-auto">
              <div className="ccs-num text-4xl font-semibold tracking-tight text-text-primary">
                <CountUp value={s.value} />
              </div>
              <div className="mt-2 font-medium text-text-primary">{s.label}</div>
              <div className="mt-2 text-xs leading-relaxed text-text-dim">{s.foot}</div>
            </Link>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href={primary.href} className="ccs-btn-primary">{primary.label}</Link>
          {secondary && (
            <Link href={secondary.href} className="text-sm font-semibold text-text-secondary underline-offset-4 hover:text-text-primary hover:underline">
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
