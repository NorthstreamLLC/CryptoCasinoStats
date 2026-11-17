"use client";

import Link from "next/link";
import { useState } from "react";
import type { BoardRow } from "@/lib/home-data";

const fmtDate = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

/**
 * Ranked bars, plain HTML so they render without JS and read as a list.
 * The toggle swaps the metric; each row links to the casino's stats page and
 * carries its own source and date.
 */
export function Leaderboard({ deposits, wallet }: { deposits: BoardRow[]; wallet: BoardRow[] }) {
  const [metric, setMetric] = useState<"deposits" | "wallet">("deposits");
  const rows = metric === "deposits" ? deposits : wallet;
  const max = rows[0]?.num ?? 1;
  return (
    <div className="ccs-card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div role="group" aria-label="Metric" className="inline-flex w-full rounded-full border border-border bg-page p-1 sm:w-auto">
          {(
            [
              ["deposits", "30-day deposits"],
              ["wallet", "Hot-wallet balance"],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              aria-pressed={metric === k}
              onClick={() => setMetric(k)}
              className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition sm:flex-none ${metric === k ? "bg-accent text-page" : "text-text-secondary hover:text-text-primary"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="text-xs text-text-dim">Top 10 · FairGambling on-chain attribution · dated per row</p>
      </div>
      <ol key={metric} className="divide-y divide-row-divider">
        {rows.map((r, i) => (
          <li key={r.slug} className="group relative">
            <Link href={r.path} className="grid grid-cols-[2rem_2.5rem_1fr_auto] items-center gap-x-3 gap-y-2 px-4 py-3.5 transition hover:bg-row-hover focus-visible:bg-row-hover sm:grid-cols-[2.5rem_2.75rem_10rem_1fr_7rem] sm:px-6">
              <span className="ccs-num text-sm text-text-dim">{String(i + 1).padStart(2, "0")}</span>
              <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-strong bg-surface-raised text-xs font-bold text-accent">{r.mono}</span>
              <span className="min-w-0 truncate font-semibold text-text-primary">{r.name}</span>
              <span className="ccs-num text-right font-semibold text-text-primary sm:order-last">{r.value}</span>
              <span className="col-span-4 h-2.5 overflow-hidden rounded-full bg-page sm:col-span-1">
                <span className="ccs-bar block h-full rounded-full" style={{ width: `${Math.max(2, (r.num / max) * 100)}%`, animationDelay: `${i * 40}ms` }} />
              </span>
            </Link>
            <a
              href={r.sourceUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="absolute right-4 top-0.5 rounded-full border border-border bg-surface px-2 py-0.5 text-[11px] text-text-dim opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100 sm:right-6"
            >
              {r.source} ↗ · {fmtDate(r.asOf)}
            </a>
          </li>
        ))}
      </ol>
      <div className="border-t border-border px-4 py-4 text-xs text-text-dim sm:px-6">
        Third-party wallet attribution, not our measurement; deposits are money in, not profit or amount wagered.{" "}
        <Link href="/methodology/" className="font-semibold text-accent hover:underline">What this can&apos;t tell you →</Link>
      </div>
    </div>
  );
}
