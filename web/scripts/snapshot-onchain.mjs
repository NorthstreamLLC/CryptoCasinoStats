#!/usr/bin/env node
/**
 * Write a dated snapshot of every casino's FairGambling figures to
 * data/history/onchain/<date>.json. The weekly reports and the "change since
 * last reading" figures on casino pages are built from these snapshots.
 *
 *   node scripts/snapshot-onchain.mjs [data/onChainVolume.json] [YYYY-MM-DD]
 *
 * Each figure keeps its own as-of date: a figure the refresh held back keeps
 * its older date, so a report never presents an old number as this week's.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = process.argv[2] ?? join(here, "data", "onChainVolume.json");
const date = process.argv[3] ?? new Date().toISOString().slice(0, 10);
const parse = (v) => {
  const m = String(v).replace(/[, ]/g, "").match(/\$?([\d.]+)([KMB])?/i);
  return m ? parseFloat(m[1]) * ({ K: 1e3, M: 1e6, B: 1e9 }[(m[2] ?? "").toUpperCase()] ?? 1) : null;
};
const METRIC = { "30-day deposit volume": "deposits", "Hot wallet balance (all chains)": "wallet" };
const casinos = {};
for (const e of JSON.parse(readFileSync(src, "utf8"))) {
  for (const s of e.sources) {
    const k = METRIC[s.metric];
    if (s.source !== "FairGambling" || !k) continue;
    const num = parse(s.value);
    if (num == null) continue;
    (casinos[e.operatorSlug] ??= {})[k] = { value: s.value, num, asOf: s.asOf, sourceUrl: s.sourceUrl };
  }
}
const dir = join(here, "data", "history", "onchain");
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, `${date}.json`), JSON.stringify({ date, source: "FairGambling", casinos }, null, 1) + "\n");
console.log(`snapshot ${date}: ${Object.keys(casinos).length} casinos`);
