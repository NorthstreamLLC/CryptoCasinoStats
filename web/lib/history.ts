import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import ops from "@/data/ops.json";
import { casinoPath } from "./casinos";
import type { Operator } from "./types";

/**
 * Weekly snapshots of FairGambling's figures (data/history/onchain/*.json,
 * written by scripts/snapshot-onchain.mjs on every refresh) and the reports
 * built from them. A change is only computed between two figures with
 * different as-of dates, so a figure the refresh held back never shows up
 * as "no change this week".
 */
interface Fig {
  value: string;
  num: number;
  asOf: string;
  sourceUrl: string;
}
interface Snapshot {
  date: string;
  casinos: Record<string, { deposits?: Fig; wallet?: Fig }>;
}

const DIR = join(process.cwd(), "data", "history", "onchain");
const OPS = ops as Operator[];
const nameOf = (slug: string) => OPS.find((o) => o.slug === slug)?.name ?? slug;

export function snapshots(): Snapshot[] {
  let files: string[] = [];
  try {
    files = readdirSync(DIR).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f));
  } catch {
    return [];
  }
  return files.sort().map((f) => JSON.parse(readFileSync(join(DIR, f), "utf8")) as Snapshot);
}

export interface Move {
  slug: string;
  name: string;
  path: string;
  now: Fig;
  prev: Fig | null;
  change: number | null; // fraction, e.g. 0.138
  fresh: boolean; // read on the report's date
}

export interface Report {
  date: string;
  prevDate: string | null;
  deposits: Move[];
  wallet: Move[];
  totals: { deposits: number; prevDeposits: number; wallet: number; prevWallet: number; comparable: number };
  risers: Move[];
  fallers: Move[];
  heldBack: Move[];
  leader: Move | null;
  sourceUrl: string;
}

/** Report dates, newest first. The oldest snapshot is the baseline, not a report. */
export const reportDates = () => snapshots().slice(1).map((s) => s.date).reverse();

function moves(cur: Snapshot, prevs: Snapshot[], k: "deposits" | "wallet"): Move[] {
  return Object.entries(cur.casinos)
    .filter(([, c]) => c[k])
    .map(([slug, c]) => {
      const now = c[k]!;
      // The latest earlier reading with a different as-of date.
      let prev: Fig | null = null;
      for (const p of [...prevs].reverse()) {
        const f = p.casinos[slug]?.[k];
        if (f && f.asOf < now.asOf) {
          prev = f;
          break;
        }
      }
      return { slug, name: nameOf(slug), path: casinoPath(slug), now, prev, change: prev && prev.num > 0 ? now.num / prev.num - 1 : null, fresh: now.asOf === cur.date };
    })
    .sort((a, b) => b.now.num - a.now.num);
}

export function report(date: string): Report | null {
  const all = snapshots();
  const i = all.findIndex((s) => s.date === date);
  if (i < 1) return null;
  const cur = all[i];
  const prevs = all.slice(0, i);
  const deposits = moves(cur, prevs, "deposits");
  const wallet = moves(cur, prevs, "wallet");
  const comparable = deposits.filter((m) => m.fresh && m.change != null);
  const sum = (xs: Move[], f: (m: Move) => number) => xs.reduce((a, m) => a + f(m), 0);
  // Movers: casinos big enough that a percentage means something ($5M+ before).
  const sized = comparable.filter((m) => (m.prev?.num ?? 0) >= 5e6);
  return {
    date,
    prevDate: prevs.at(-1)?.date ?? null,
    deposits,
    wallet,
    totals: {
      deposits: sum(comparable, (m) => m.now.num),
      prevDeposits: sum(comparable, (m) => m.prev!.num),
      wallet: sum(wallet.filter((m) => m.fresh && m.prev), (m) => m.now.num),
      prevWallet: sum(wallet.filter((m) => m.fresh && m.prev), (m) => m.prev!.num),
      comparable: comparable.length,
    },
    risers: [...sized].sort((a, b) => b.change! - a.change!).filter((m) => m.change! > 0).slice(0, 3),
    fallers: [...sized].sort((a, b) => a.change! - b.change!).filter((m) => m.change! < 0).slice(0, 3),
    heldBack: deposits.filter((m) => !m.fresh),
    leader: deposits[0] ?? null,
    sourceUrl: "https://www.fairgambling.com/",
  };
}

export const latestReport = () => {
  const d = reportDates()[0];
  return d ? report(d) : null;
};

/** A casino's latest change, for its profile page. */
export function latestChange(slug: string): { deposits: Move | null; wallet: Move | null } {
  const r = latestReport();
  return { deposits: r?.deposits.find((m) => m.slug === slug && m.fresh && m.change != null) ?? null, wallet: r?.wallet.find((m) => m.slug === slug && m.fresh && m.change != null) ?? null };
}

export const pct = (x: number | null, digits = 1) => (x == null ? "—" : `${x > 0 ? "+" : ""}${(x * 100).toFixed(digits)}%`);
export const big = (n: number) => (n >= 1e9 ? `$${(n / 1e9).toFixed(2)}B` : n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : `$${(n / 1e3).toFixed(1)}K`);
