import type { ReactNode } from "react";

/** Hero for reading pages: smaller than the data heroes, same grid and glow. */
export function DocHero({ eyebrow, title, lede, children, wide = false }: { eyebrow: ReactNode; title: ReactNode; lede?: ReactNode; children?: ReactNode; wide?: boolean }) {
  return (
    <section className="ccs-hero relative overflow-hidden border-b border-border">
      <div aria-hidden className="ccs-grid absolute inset-0" />
      <div aria-hidden className="ccs-glow absolute left-[35%] top-[70%] h-[380px] w-[720px] -translate-x-1/2 -translate-y-1/2" />
      <div className={`relative mx-auto px-4 pb-10 pt-10 sm:pb-14 sm:pt-14 ${wide ? "max-w-6xl" : "max-w-4xl"}`}>
        <div className="ccs-eyebrow flex flex-wrap items-center gap-x-2 gap-y-1">{eyebrow}</div>
        <h1 className="ccs-display mt-4 text-[2.25rem] leading-[1.05] sm:text-5xl lg:text-[3.4rem]">{title}</h1>
        {lede && <p className="mt-5 max-w-2xl text-lg text-text-secondary">{lede}</p>}
        {children}
      </div>
    </section>
  );
}
