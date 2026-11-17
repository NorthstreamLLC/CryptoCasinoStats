import type { ReactNode } from "react";

/** A home-page section: eyebrow, display heading, optional lede and action, then content. */
export function Section({ id, eyebrow, title, lede, action, children, className = "" }: { id?: string; eyebrow: string; title: ReactNode; lede?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`scroll-mt-20 py-16 sm:py-24 ${className}`}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="ccs-eyebrow">{eyebrow}</p>
            <h2 className="ccs-display mt-3 text-3xl sm:text-[2.6rem] sm:leading-[1.08]">{title}</h2>
            {lede && <p className="mt-3 text-text-secondary">{lede}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
        {children}
      </div>
    </section>
  );
}
