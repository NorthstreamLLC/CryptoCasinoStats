#!/usr/bin/env node
/**
 * Copy the shared data files from a CryptoSlotGuide checkout into this site, so
 * both sites publish the same sourced figures. Read-only on the CryptoSlotGuide
 * side: nothing there is changed.
 *
 *   npm run sync:data -- /path/to/cryptoslotguide
 *
 * Every JSON file this site already holds (data/*.json, data/generated/*.json)
 * is replaced by CryptoSlotGuide's copy when it differs, except
 * onChainVolume.json, which is MERGED: this site refreshes FairGambling's
 * figures itself every week (scripts/refresh-onchain.mjs), so for each
 * casino + source + metric the figure with the later as-of date wins. A casino
 * CryptoSlotGuide adds is taken as is. Commit the result in a reviewed commit.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = process.argv[2];
if (!src) {
  console.error("Usage: npm run sync:data -- /path/to/cryptoslotguide");
  process.exit(1);
}
const srcWeb = existsSync(join(src, "web", "data")) ? join(src, "web") : src;
const MERGE = "onChainVolume.json";

function mergeOnChain(ours, theirs) {
  const key = (s) => `${s.source}|${s.metric}`;
  const out = ours.map((e) => ({ ...e, sources: [...e.sources] }));
  let changed = 0;
  for (const t of theirs) {
    const o = out.find((e) => e.operatorSlug === t.operatorSlug);
    if (!o) {
      out.push(t);
      changed++;
      continue;
    }
    for (const s of t.sources) {
      const i = o.sources.findIndex((x) => key(x) === key(s));
      if (i < 0) {
        o.sources.push(s);
        changed++;
      } else if (s.asOf > o.sources[i].asOf) {
        o.sources[i] = s;
        changed++;
      }
    }
  }
  return { out, changed };
}

let changed = 0;
for (const dir of ["data", "data/generated"]) {
  for (const f of readdirSync(join(here, dir)).filter((x) => x.endsWith(".json"))) {
    const from = join(srcWeb, dir, f);
    if (!existsSync(from)) continue;
    const to = join(here, dir, f);
    const a = readFileSync(from, "utf8");
    const b = readFileSync(to, "utf8");
    if (a === b) continue;
    if (dir === "data" && f === MERGE) {
      const { out, changed: n } = mergeOnChain(JSON.parse(b), JSON.parse(a));
      if (n) {
        writeFileSync(to, JSON.stringify(out, null, 2) + "\n");
        console.log(`merged ${dir}/${f}: ${n} newer figure(s) from CryptoSlotGuide`);
        changed++;
      }
      continue;
    }
    writeFileSync(to, a);
    console.log(`updated ${dir}/${f}`);
    changed++;
  }
}
console.log(changed ? `${changed} file(s) updated.` : "Already in sync.");
