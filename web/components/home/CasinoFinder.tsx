"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getGeo } from "@/lib/geo-client";
import type { FinderCasino } from "@/lib/home-data";

const FILTERS = [
  { key: "noKyc", label: "No routine KYC" },
  { key: "instant", label: "Instant withdrawals (stated)" },
  { key: "noWagering", label: "No bonus wagering" },
  { key: "sol", label: "Takes SOL" },
  { key: "sports", label: "Has a sportsbook" },
] as const;
type Key = (typeof FILTERS)[number]["key"];

/**
 * Filter chips over every tracked casino, partners first (house order is the
 * tie-break, never a filter). Casinos that turn the visitor's country away are
 * marked, not hidden, so the list never changes under a crawler.
 */
export function CasinoFinder({ casinos }: { casinos: FinderCasino[] }) {
  const [on, setOn] = useState<Key[]>([]);
  const [blocked, setBlocked] = useState<Set<string>>(new Set());
  useEffect(() => {
    getGeo().then((g) => {
      if (g?.detected && g.casinos) setBlocked(new Set([...g.casinos.restrictedSlugs, ...(g.regionBlocked ?? []).map((r) => r.slug)]));
    });
  }, []);
  const results = useMemo(() => casinos.filter((c) => on.every((k) => c[k])), [casinos, on]);
  const shown = results.slice(0, 6);
  const toggle = (k: Key) => setOn((xs) => (xs.includes(k) ? xs.filter((x) => x !== k) : [...xs, k]));

  return (
    <div>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {FILTERS.map((f) => {
          const active = on.includes(f.key);
          return (
            <button
              key={f.key}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(f.key)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${active ? "border-accent bg-accent-wash-strong text-accent-bright" : "border-border-strong text-text-secondary hover:border-text-dim hover:text-text-primary"}`}
            >
              {active ? "✓ " : ""}
              {f.label}
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-sm text-text-muted" aria-live="polite">
        {results.length} of {casinos.length} casinos match{on.length ? "" : ". Pick what matters to you"}.
      </p>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((c) => (
          <article key={c.slug} className="ccs-card ccs-lift flex min-w-0 flex-col p-5">
            <div className="flex items-center gap-3">
              <span aria-hidden className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border-strong bg-surface-raised text-sm font-bold text-accent">{c.mono}</span>
              <div className="min-w-0">
                <h3 className="truncate font-semibold text-text-primary">{c.name}</h3>
                {blocked.has(c.slug) && <p className="text-xs text-warning">Not available in your country</p>}
              </div>
            </div>
            <dl className="mt-4 divide-y divide-row-divider rounded-xl bg-page text-sm">
              {[
                ["KYC", c.kyc],
                ["Stated withdrawal", c.withdrawal],
                ["Bonus wagering", c.wagering],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-3 px-3 py-2">
                  <dt className="shrink-0 text-xs text-text-dim">{k}</dt>
                  <dd className="min-w-0 text-right font-semibold text-text-primary">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-auto flex gap-2 pt-4">
              {c.link && !blocked.has(c.slug) && (
                <a href={`/go/${c.slug}/?p=home-finder`} rel="nofollow sponsored" className="ccs-btn-primary flex-1 !py-2 text-center text-sm">
                  Visit
                </a>
              )}
              <Link href={c.path} className="ccs-btn-ghost flex-1 !py-2 text-center text-sm">
                Stats
              </Link>
            </div>
          </article>
        ))}
      </div>
      {results.length === 0 && <p className="mt-4 text-sm text-text-muted">No casino matches all of those. Try removing a filter.</p>}
      <p className="mt-6 text-sm">
        <Link href="/casinos/#all-casinos" className="font-semibold text-accent hover:underline">
          See all {casinos.length} casinos →
        </Link>
      </p>
    </div>
  );
}
