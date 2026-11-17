import { fmtDate } from "@/lib/site";
import type { CasinoProfileData } from "@/lib/casino-profile";

/** The casino's published facts by group, as accordions; first two open. Every fact links its source. */
export function Terms({ p }: { p: CasinoProfileData }) {
  if (!p.groups.length) return <p className="text-text-secondary">No published facts on file yet.</p>;
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      {p.groups.map((g, i) => (
        <details key={g.title} open={i < 2} className="ccs-card group min-w-0 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
            <span className="font-semibold text-text-primary">{g.title}</span>
            <span className="flex items-center gap-3">
              <span className="ccs-num text-xs text-text-dim">{g.facts.length} facts</span>
              <span aria-hidden className="text-lg text-accent transition group-open:rotate-45">+</span>
            </span>
          </summary>
          <dl className="border-t border-border">
            {g.facts.map((f) => (
              <div key={f.label} className="border-t border-row-divider px-5 py-3.5 first:border-t-0">
                <dt className="text-xs font-semibold text-text-dim-2">{f.label}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-text-secondary">{f.value}</dd>
                {f.sourceUrl && (
                  <a href={f.sourceUrl} target="_blank" rel="noopener noreferrer nofollow" className="mt-1.5 inline-block text-xs text-text-dim hover:text-accent">
                    Source ↗{f.asOf ? ` · ${fmtDate(f.asOf)}` : ""}
                  </a>
                )}
              </div>
            ))}
          </dl>
        </details>
      ))}
    </div>
  );
}
