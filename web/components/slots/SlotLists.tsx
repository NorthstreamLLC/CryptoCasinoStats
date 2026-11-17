"use client";

import { useState } from "react";
import { SlotArt } from "./SlotArt";
import type { SlotCard } from "@/lib/slot-page";

/** Tabbed slot lists. Every list is in the HTML (inactive ones hidden), so all rows stay crawlable. */
export function SlotLists({ lists }: { lists: { title: string; note: string; rows: (SlotCard & { tag?: string })[] }[] }) {
  const [i, setI] = useState(0);
  return (
    <div className="ccs-card overflow-hidden">
      <div role="tablist" aria-label="Slot lists" className="flex gap-1 overflow-x-auto border-b border-border px-3 py-3 sm:px-5">
        {lists.map((l, k) => (
          <button key={l.title} role="tab" id={`sl-tab-${k}`} aria-selected={i === k} aria-controls={`sl-panel-${k}`} onClick={() => setI(k)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${i === k ? "bg-accent text-page" : "text-text-secondary hover:text-text-primary"}`}>
            {l.title}
          </button>
        ))}
      </div>
      {lists.map((l, k) => (
        <div key={l.title} role="tabpanel" id={`sl-panel-${k}`} aria-labelledby={`sl-tab-${k}`} hidden={i !== k}>
          <p className="px-5 pt-4 text-sm text-text-muted">{l.note}</p>
          <ol className="mt-2">
            {l.rows.map((r, n) => (
              <li key={r.slug} className="grid grid-cols-[1.5rem_3.5rem_1fr] items-center gap-x-3 gap-y-1 border-t border-row-divider px-5 py-3 first:border-t-0 sm:grid-cols-[2rem_4rem_1.6fr_1fr_1fr_1fr]">
                <span className="ccs-num text-sm text-text-dim">{String(n + 1).padStart(2, "0")}</span>
                <SlotArt src={r.art} name={r.name} width={128} className="h-12 w-14 rounded-lg sm:w-16" />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-text-primary">{r.name}</p>
                  <p className="truncate text-xs text-text-dim">{r.provider}</p>
                </div>
                <div className="col-span-3 flex flex-wrap gap-x-5 gap-y-1 pl-[5.25rem] text-sm sm:col-span-3 sm:grid sm:grid-cols-3 sm:pl-0">
                  <span><span className="text-xs text-text-dim">RTP </span><span className="ccs-num font-semibold text-text-primary">{r.rtp}</span></span>
                  <span><span className="text-xs text-text-dim">Max </span><span className="ccs-num font-semibold text-text-primary">{r.maxWin}</span></span>
                  <span className="capitalize text-text-secondary">{r.tag ?? r.volatility}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}
