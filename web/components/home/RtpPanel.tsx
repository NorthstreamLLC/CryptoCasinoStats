"use client";

import Link from "next/link";
import { useState } from "react";
import type { RtpSlot } from "@/lib/home-data";

const fmt = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/**
 * One slot, every casino we have read it at, plotted against the studio's
 * published RTP. The scale is fixed (94–97%) so a lower-RTP version would
 * visibly drop away from the line; a table repeats it for screen readers.
 */
export function RtpPanel({ slots, overdue = false }: { slots: RtpSlot[]; overdue?: boolean }) {
  const [i, setI] = useState(0);
  const s = slots[i];
  const lo = 94;
  const hi = 97;
  const pos = (v: number) => `${Math.min(100, Math.max(0, ((v - lo) / (hi - lo)) * 100))}%`;
  const allMatch = s.provider != null && s.readings.every((r) => Math.abs(r.rtp - s.provider!) < 0.05);
  const date = s.readings.map((r) => r.date).sort().at(-1)!;

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.25fr] lg:gap-14">
      <div>
        <p className="ccs-eyebrow">RTP by casino</p>
        <h2 className="ccs-display mt-3 text-3xl sm:text-[2.6rem] sm:leading-[1.08]">The same slot can pay back less somewhere else.</h2>
        <p className="mt-4 text-text-secondary">
          Studios release games in several RTP versions and each casino picks one. We read the RTP each casino shows for its own copy, so you can see
          which version you are actually playing.
        </p>
        <Link href="/top-slots/#rtp-by-casino" className="ccs-btn-primary mt-6 inline-flex">See RTP by casino →</Link>
      </div>

      <div className="ccs-card p-5 sm:p-7">
        <label className="block text-xs font-semibold text-text-dim-2" htmlFor="rtp-slot">Slot</label>
        <select id="rtp-slot" value={i} onChange={(e) => setI(Number(e.target.value))} className="mt-1.5 w-full rounded-lg border border-border-strong bg-page px-3 py-2.5 font-semibold text-text-primary">
          {slots.map((x, k) => (
            <option key={x.slug} value={k}>
              {x.name} ({x.readings.length} casinos)
            </option>
          ))}
        </select>

        <div className="relative mt-8 h-[19rem] sm:h-64" aria-hidden>
          <div className="absolute inset-x-0 top-0 flex justify-between text-[11px] text-text-dim">
            {[94, 95, 96, 97].map((t) => (
              <span key={t} className="ccs-num">{t}%</span>
            ))}
          </div>
          {s.provider != null && (
            <div className="absolute bottom-0 top-5 w-px bg-accent/70" style={{ left: pos(s.provider) }}>
              <span className="absolute -top-0.5 right-2 whitespace-nowrap rounded bg-accent-wash-strong px-1.5 py-0.5 text-[11px] font-semibold text-accent-bright">Studio {s.provider.toFixed(2)}%</span>
            </div>
          )}
          <ul className="absolute inset-x-0 bottom-0 top-12 flex flex-col justify-around">
            {s.readings.map((r) => (
              <li key={r.slug} className="relative h-6">
                <span className="absolute inset-y-1/2 left-0 right-0 h-px bg-border" />
                <span className="ccs-dot absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ left: pos(r.rtp) }} />
                <span className="absolute left-0 top-1/2 -translate-y-1/2 bg-surface pr-2 text-xs font-medium text-text-secondary">{r.casino}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="sr-only">
        <table>
          <caption>RTP of {s.name} by casino, read {fmt(date)}</caption>
          <thead>
            <tr><th>Casino</th><th>RTP</th></tr>
          </thead>
          <tbody>
            {s.readings.map((r) => (
              <tr key={r.slug}><td>{r.casino}</td><td>{r.rtp.toFixed(2)}%</td></tr>
            ))}
          </tbody>
        </table>
        </div>

        <p className="mt-6 rounded-lg bg-page px-4 py-3 text-sm text-text-secondary">
          {allMatch
            ? `All ${s.readings.length} casinos showed the studio's ${s.provider!.toFixed(2)}% version when we read them on ${fmt(date)}.`
            : `Readings differ from the studio's figure at some casinos (read ${fmt(date)}).`}
          {overdue && <span className="mt-1 block text-xs font-semibold text-warning">Historical: these readings are past their monthly re-check, and a casino may have changed version since.</span>}
        </p>
      </div>
    </div>
  );
}
