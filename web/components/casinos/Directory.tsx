"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getGeo } from "@/lib/geo-client";

export interface DirRow {
  slug: string;
  name: string;
  mono: string;
  path: string;
  link: boolean;
  deposits: string | null;
  depNum: number;
  wallet: string | null;
  walNum: number;
  kyc: string;
  kycRank: number;
  withdrawal: string;
  withdrawalMins: number;
  wagering: string;
  licence: string;
  noKyc: boolean;
  instant: boolean;
  noWagering: boolean;
  sol: boolean;
  sports: boolean;
}

const FILTERS = [
  { key: "noKyc", label: "No routine KYC" },
  { key: "instant", label: "Instant withdrawals (stated)" },
  { key: "noWagering", label: "No bonus wagering" },
  { key: "sol", label: "Takes SOL" },
  { key: "sports", label: "Sportsbook" },
] as const;
type FKey = (typeof FILTERS)[number]["key"];

const SORTS = {
  partner: { label: "Featured", fn: () => 0 },
  deposits: { label: "Deposits, high to low", fn: (a: DirRow, b: DirRow) => b.depNum - a.depNum },
  wallet: { label: "Hot wallet, high to low", fn: (a: DirRow, b: DirRow) => b.walNum - a.walNum },
  withdrawal: { label: "Fastest stated withdrawal", fn: (a: DirRow, b: DirRow) => a.withdrawalMins - b.withdrawalMins },
  kyc: { label: "Lightest KYC", fn: (a: DirRow, b: DirRow) => a.kycRank - b.kycRank },
  name: { label: "Name, A–Z", fn: (a: DirRow, b: DirRow) => a.name.localeCompare(b.name) },
} as const;
type SKey = keyof typeof SORTS;

/**
 * Every tracked casino: search, filter, sort. All rows are in the server HTML
 * (crawlable, works without JS); the controls only reorder and hide. "Featured"
 * is the commercial order and is labelled; every other sort is by a figure.
 */
export function Directory({ rows }: { rows: DirRow[] }) {
  const [q, setQ] = useState("");
  const [on, setOn] = useState<FKey[]>([]);
  const [sort, setSort] = useState<SKey>("partner");
  const [blocked, setBlocked] = useState<Set<string>>(new Set());
  useEffect(() => {
    getGeo().then((g) => {
      if (g?.detected && g.casinos) setBlocked(new Set([...g.casinos.restrictedSlugs, ...(g.regionBlocked ?? []).map((r) => r.slug)]));
    });
  }, []);
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const xs = rows.filter((r) => (!needle || r.name.toLowerCase().includes(needle)) && on.every((k) => r[k]));
    return sort === "partner" ? xs : [...xs].sort(SORTS[sort].fn);
  }, [rows, q, on, sort]);
  const toggle = (k: FKey) => setOn((xs) => (xs.includes(k) ? xs.filter((x) => x !== k) : [...xs, k]));

  return (
    <div>
      <div className="ccs-card flex flex-col gap-3 p-3 sm:p-4 lg:flex-row lg:items-center">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Search casinos</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${rows.length} casinos`} className="w-full rounded-xl border border-border-strong bg-page px-4 py-2.5 text-text-primary placeholder:text-text-dim focus:border-accent focus:outline-none" />
        </label>
        <div className="-mx-3 flex gap-2 overflow-x-auto px-3 sm:mx-0 sm:px-0 lg:flex-wrap">
          {FILTERS.map((f) => {
            const a = on.includes(f.key);
            return (
              <button key={f.key} type="button" aria-pressed={a} onClick={() => toggle(f.key)} className={`shrink-0 rounded-full border px-3.5 py-2 text-sm font-semibold transition ${a ? "border-accent bg-accent-wash-strong text-accent-bright" : "border-border-strong text-text-secondary hover:text-text-primary"}`}>
                {a ? "✓ " : ""}
                {f.label}
              </button>
            );
          })}
        </div>
        <label className="flex shrink-0 items-center gap-2 text-sm text-text-muted">
          Sort
          <select value={sort} onChange={(e) => setSort(e.target.value as SKey)} className="rounded-xl border border-border-strong bg-page px-3 py-2.5 font-semibold text-text-primary">
            {Object.entries(SORTS).map(([k, s]) => (
              <option key={k} value={k}>{s.label}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="mt-3 text-sm text-text-muted" aria-live="polite">
        {list.length} of {rows.length} casinos{sort === "partner" ? " · featured order puts partners first" : ""}
      </p>

      <div className="ccs-card mt-4 overflow-hidden">
        <div className="hidden grid-cols-[1.5fr_1fr_1fr_1.2fr_1fr_1.2fr_auto] gap-4 border-b border-border px-5 py-3 text-xs font-semibold uppercase tracking-wide text-text-dim lg:grid">
          <span>Casino</span><span>30-day deposits</span><span>Hot wallet</span><span>KYC</span><span>Stated withdrawal</span><span>Bonus wagering</span><span className="w-[9.5rem]" />
        </div>
        <ul>
          {list.map((r) => (
            <li key={r.slug} className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-row-divider px-4 py-4 first:border-t-0 sm:px-5 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr_1fr_1.2fr_auto] lg:items-center lg:py-3">
              <div className="col-span-2 flex min-w-0 items-center gap-3 lg:col-span-1">
                <span aria-hidden className="ccs-num flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border-strong bg-surface-raised text-[11px] font-semibold text-accent">{r.mono}</span>
                <div className="min-w-0">
                  <Link href={r.path} className="block truncate font-semibold text-text-primary hover:text-accent">{r.name}</Link>
                  <span className="block truncate text-xs text-text-dim">{blocked.has(r.slug) ? <span className="text-warning">Not available in your country</span> : r.licence}</span>
                </div>
              </div>
              {[
                ["30-day deposits", r.deposits ?? "—", true],
                ["Hot wallet", r.wallet ?? "—", true],
                ["KYC", r.kyc, false],
                ["Stated withdrawal", r.withdrawal, false],
                ["Bonus wagering", r.wagering, false],
              ].map(([k, v, num]) => (
                <div key={k as string} className="min-w-0 text-sm">
                  <span className="block text-xs text-text-dim lg:hidden">{k}</span>
                  <span className={`${num ? "ccs-num" : ""} font-semibold text-text-primary`}>{v}</span>
                </div>
              ))}
              <div className="col-span-2 flex gap-2 lg:col-span-1 lg:w-[9.5rem]">
                {r.link && !blocked.has(r.slug) && (
                  <a href={`/go/${r.slug}/?p=directory`} rel="nofollow sponsored" className="ccs-btn-primary flex-1 !px-3 !py-1.5 text-sm">Visit</a>
                )}
                <Link href={r.path} className="ccs-btn-ghost flex-1 !px-3 !py-1.5 text-sm">Stats</Link>
              </div>
            </li>
          ))}
        </ul>
        {list.length === 0 && <p className="px-5 py-8 text-center text-text-muted">No casino matches. Try removing a filter.</p>}
      </div>
    </div>
  );
}
