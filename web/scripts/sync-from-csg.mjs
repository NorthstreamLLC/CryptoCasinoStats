#!/usr/bin/env node
/**
 * Copy the shared data files from a CryptoSlotGuide checkout into this site, so
 * both sites publish the same sourced figures. Read-only on the CryptoSlotGuide
 * side: nothing there is changed.
 *
 *   npm run sync:data -- /path/to/cryptoslotguide
 *
 * Copies the JSON files this site already holds (data/*.json and
 * data/generated/*.json) when the CryptoSlotGuide copy differs, and reports
 * what changed. Commit the result in a reviewed commit.
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
let changed = 0;
for (const dir of ["data", "data/generated"]) {
  for (const f of readdirSync(join(here, dir)).filter((x) => x.endsWith(".json"))) {
    const from = join(srcWeb, dir, f);
    if (!existsSync(from)) continue;
    const a = readFileSync(from, "utf8");
    const b = readFileSync(join(here, dir, f), "utf8");
    if (a !== b) {
      writeFileSync(join(here, dir, f), a);
      console.log(`updated ${dir}/${f}`);
      changed++;
    }
  }
}
console.log(changed ? `${changed} file(s) updated.` : "Already in sync.");
