import type { ReactNode } from "react";
import { DocHero } from "./DocHero";
import { Toc } from "./Toc";

export interface DocSection {
  id: string;
  title: string;
  body: ReactNode;
}

/**
 * A reading page: hero, then sections down the left with a sticky contents
 * list on the right (desktop) or a collapsible one at the top (phones).
 */
export function DocLayout({ eyebrow, title, lede, heroExtra, sections, aside, children }: { eyebrow: ReactNode; title: string; lede?: ReactNode; heroExtra?: ReactNode; sections: DocSection[]; aside?: ReactNode; children?: ReactNode }) {
  const toc = sections.map((s) => ({ id: s.id, text: s.title }));
  return (
    <>
      <DocHero eyebrow={eyebrow} title={title} lede={lede} wide>
        {heroExtra}
      </DocHero>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-14">
        <div className="min-w-0">
          {sections.length > 2 && (
            <details className="ccs-card mb-8 p-4 lg:hidden">
              <summary className="cursor-pointer font-semibold text-text-primary">On this page</summary>
              <ol className="mt-3 grid gap-2 text-sm">
                {toc.map((t) => (
                  <li key={t.id}><a href={`#${t.id}`} className="text-text-secondary hover:text-accent">{t.text}</a></li>
                ))}
              </ol>
            </details>
          )}
          <div className="grid grid-cols-1 gap-12">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="min-w-0 scroll-mt-24">
                <h2 className="ccs-display text-2xl sm:text-3xl">{s.title}</h2>
                <div className="ccs-prose mt-4 max-w-none">{s.body}</div>
              </section>
            ))}
          </div>
          {children}
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-24 grid gap-6">
            {sections.length > 1 && <Toc items={toc} />}
            {aside}
          </div>
        </aside>
      </div>
    </>
  );
}
