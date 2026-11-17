import type { ReactNode } from "react";

/** A profile section: eyebrow, heading, optional lede, content. Anchored for the section nav. */
export function Block({ id, eyebrow, title, lede, children, tint = false }: { id: string; eyebrow: string; title: ReactNode; lede?: ReactNode; children: ReactNode; tint?: boolean }) {
  return (
    <section id={id} className={`scroll-mt-32 py-14 sm:py-20 ${tint ? "bg-section" : ""}`}>
      <div className="mx-auto max-w-6xl px-4">
        <p className="ccs-eyebrow">{eyebrow}</p>
        <h2 className="ccs-display mt-3 max-w-3xl text-3xl sm:text-[2.4rem] sm:leading-[1.08]">{title}</h2>
        {lede && <p className="mt-3 max-w-2xl text-text-secondary">{lede}</p>}
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
