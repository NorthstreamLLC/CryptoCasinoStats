"use client";

import { useState } from "react";

export interface SlotRow {
  slug: string;
  name: string;
  maxWin: string;
  volatility: string;
  provider: string;
  reading: { rtp: string; where: string; date: string } | null;
}

/**
 * The casino's slots by studio. Provider RTP is the studio's published default;
 * "At <casino>" is what the casino showed for its own copy on the date given.
 * All tabs are in the HTML (hidden, not removed) so every row stays crawlable.
 */
export function SlotTabs({ groups, casino }: { groups: { provider: string; rows: SlotRow[] }[]; casino: string }) {
  const [i, setI] = useState(0);
  return (
    <div className="ccs-card overflow-hidden">
      <div role="tablist" aria-label="Studio" className="flex gap-1 overflow-x-auto border-b border-border px-3 py-3 sm:px-5">
        {groups.map((g, k) => (
          <button
            key={g.provider}
            role="tab"
            id={`tab-${k}`}
            aria-selected={i === k}
            aria-controls={`panel-${k}`}
            onClick={() => setI(k)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${i === k ? "bg-accent text-page" : "text-text-secondary hover:text-text-primary"}`}
          >
            {g.provider}
          </button>
        ))}
      </div>
      {groups.map((g, k) => (
        <div key={g.provider} role="tabpanel" id={`panel-${k}`} aria-labelledby={`tab-${k}`} hidden={i !== k}>
          <div className="hidden grid-cols-[1.6fr_.8fr_.8fr_.8fr_1.2fr] gap-3 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-text-dim sm:grid">
            <span>Slot</span><span>Max win</span><span>Volatility</span><span>Studio RTP</span><span>At {casino}</span>
          </div>
          <ul>
            {g.rows.map((r) => (
              <li key={r.slug} className="grid grid-cols-2 gap-x-3 gap-y-1 border-t border-row-divider px-5 py-3.5 sm:grid-cols-[1.6fr_.8fr_.8fr_.8fr_1.2fr] sm:items-center">
                <span className="col-span-2 font-semibold text-text-primary sm:col-span-1">{r.name}</span>
                <span className="ccs-num text-sm text-text-secondary"><span className="text-text-dim sm:hidden">Max </span>{r.maxWin}</span>
                <span className="text-sm capitalize text-text-secondary">{r.volatility}</span>
                <span className="ccs-num text-sm text-text-secondary"><span className="text-text-dim sm:hidden">Studio </span>{r.provider}</span>
                <span className="text-sm">
                  {r.reading ? (
                    <>
                      <span className="ccs-num font-semibold text-accent-bright">{r.reading.rtp}</span>
                      <span className="block text-xs text-text-dim">{r.reading.where}, {r.reading.date}</span>
                    </>
                  ) : (
                    <span className="text-text-dim">Not read yet</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
