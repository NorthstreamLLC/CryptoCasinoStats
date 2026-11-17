#!/usr/bin/env node
/**
 * Weekly refresh of FairGambling's on-chain figures in data/onChainVolume.json.
 *
 * For every casino that already cites a FairGambling page, reads that public
 * page (www.fairgambling.com/<casino>, allowed by its robots.txt; its /api/ is
 * not, and is never called) and takes the figures the page itself displays:
 *   - 30-day deposit volume, with market share, unique depositors and deposits
 *   - hot-wallet balance across chains, with the chains listed
 * Each figure keeps its source page and gets today's date as its as-of date.
 *
 * Tanzanite's table loads from its /api/ (disallowed by its robots.txt), so
 * Tanzanite rows are left exactly as they are and keep their own dates.
 *
 * Safety: a figure is only replaced when the page parses cleanly, names the
 * same casino, and the new value is within 10x of the old one. Anything else
 * is left untouched and listed in the report, so a site redesign upstream
 * shows up as "skipped", never as a wrong number. One request every 2 seconds.
 *
 *   node scripts/refresh-onchain.mjs            update the file
 *   node scripts/refresh-onchain.mjs --dry-run  report only
 *   REFRESH_REPORT=path  also write the report there (markdown)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = join(dirname(fileURLToPath(import.meta.url)), "..");
const FILE = join(here, "data", "onChainVolume.json");
const DRY = process.argv.includes("--dry-run");
const UA = "CryptoCasinoStatsBot/1.0 (+https://cryptocasinostats.com/methodology/)";
const TODAY = new Date().toISOString().slice(0, 10);
const DEPOSITS = "30-day deposit volume";
const WALLET = "Hot wallet balance (all chains)";
const CHAIN = { ethereum: "ETH", bitcoin: "BTC", solana: "SOL", tron: "TRX", litecoin: "LTC", dogecoin: "DOGE", ripple: "XRP", xrp: "XRP", bsc: "BSC", "binance-smart-chain": "BSC", polygon: "POLYGON", ton: "TON", stellar: "STELLAR", arbitrum: "ARBITRUM", base: "BASE", avalanche: "AVAX" };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const money = (n) => (n >= 1e9 ? `$${(n / 1e9).toFixed(2)}B` : n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `$${(n / 1e3).toFixed(1)}K` : `$${Math.round(n)}`);
const count = (n) => (n >= 1e6 ? `${(n / 1e6).toFixed(2)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}K` : String(n));
function parseMoney(v) {
  const m = String(v).replace(/[, ]/g, "").match(/\$?([\d.]+)([KMB])?/i);
  return m ? parseFloat(m[1]) * ({ K: 1e3, M: 1e6, B: 1e9 }[(m[2] ?? "").toUpperCase()] ?? 1) : NaN;
}

/** The page's React Server Components payload, decoded into one string. */
function flightPayload(html) {
  let out = "";
  for (const m of html.matchAll(/self\.__next_f\.push\(\[1,("(?:[^"\\]|\\.)*")\]\)/g)) {
    try {
      out += JSON.parse(m[1]);
    } catch {
      /* skip a chunk that is not a plain string */
    }
  }
  return out;
}

/** The JSON value that starts right after `key` in s (balanced brackets, strings respected). */
function valueAfter(s, key) {
  const i = s.indexOf(key);
  if (i < 0) return null;
  let j = i + key.length;
  const open = s[j];
  if (open !== "{" && open !== "[") return null;
  const close = open === "{" ? "}" : "]";
  let depth = 0, str = false, esc = false;
  for (let k = j; k < s.length; k++) {
    const c = s[k];
    if (str) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') str = false;
      continue;
    }
    if (c === '"') str = true;
    else if (c === "{" || c === "[") depth++;
    else if (c === "}" || c === "]") {
      depth--;
      if (depth === 0 && c === close) {
        try {
          return JSON.parse(s.slice(j, k + 1));
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

async function read(url) {
  const res = await fetch(url, { headers: { "user-agent": UA, accept: "text/html" }, redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const s = flightPayload(await res.text());
  const tf = valueAfter(s, '"timeframeData":');
  const d30 = tf?.["30D"]?.data;
  const hw = valueAfter(s, '"hotWallet":');
  return { d30, hw };
}

const sane = (oldV, newN) => {
  const o = parseMoney(oldV);
  return !Number.isFinite(o) || o <= 0 || (newN / o < 10 && o / newN < 10);
};

const data = JSON.parse(readFileSync(FILE, "utf8"));
const rows = [];
for (const entry of data) {
  const fg = entry.sources.filter((s) => s.source === "FairGambling");
  const url = fg[0]?.sourceUrl;
  if (!url || !/^https:\/\/www\.fairgambling\.com\/[a-z0-9-]+\/?$/.test(url)) continue;
  let got;
  try {
    got = await read(url);
  } catch (e) {
    rows.push({ slug: entry.operatorSlug, status: `skipped: ${e.message}` });
    await sleep(2000);
    continue;
  }
  const changes = [];
  const problems = [];
  const dep = fg.find((s) => s.metric === DEPOSITS);
  const d = got.d30;
  if (dep) {
    if (!d || !(d.depositVolume > 0)) problems.push("30-day deposits not found on page");
    else if (!sane(dep.value, d.depositVolume)) problems.push(`30-day deposits ${money(d.depositVolume)} is more than 10x from ${dep.value}`);
    else {
      const before = dep.value;
      dep.value = money(d.depositVolume);
      dep.note = [
        Number.isFinite(d.marketShare) ? `${d.marketShare.toFixed(1)}% market share` : null,
        Number.isFinite(d.differentDeposits) ? `${count(d.differentDeposits)} unique depositors` : null,
        Number.isFinite(d.deposits) ? `${count(d.deposits)} total deposits` : null,
      ].filter(Boolean).join(" · ");
      dep.asOf = TODAY;
      changes.push(`deposits ${before} → ${dep.value}`);
    }
  }
  const wal = fg.find((s) => s.metric === WALLET);
  const chains = Array.isArray(got.hw?.chains) ? got.hw.chains.filter((c) => c.totalUsdValue > 0) : [];
  if (wal) {
    const total = chains.reduce((a, c) => a + c.totalUsdValue, 0);
    if (!chains.length || !(total > 0)) problems.push("hot wallet not found on page");
    else if (!sane(wal.value, total)) problems.push(`hot wallet ${money(total)} is more than 10x from ${wal.value}`);
    else {
      const before = wal.value;
      wal.value = money(total);
      wal.note = chains.sort((a, b) => b.totalUsdValue - a.totalUsdValue).map((c) => CHAIN[c.chain] ?? String(c.chain).toUpperCase()).join(", ");
      wal.asOf = TODAY;
      changes.push(`hot wallet ${before} → ${wal.value}`);
    }
  }
  rows.push({ slug: entry.operatorSlug, status: problems.length ? `partly skipped: ${problems.join("; ")}` : "updated", changes });
  await sleep(2000);
}

if (!DRY) writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n");

const updated = rows.filter((r) => r.status === "updated").length;
const lines = [
  `# On-chain refresh ${TODAY}`,
  "",
  `${updated} of ${rows.length} FairGambling casinos updated${DRY ? " (dry run, nothing written)" : ""}. Tanzanite figures are not refreshed automatically (its data is behind a robots-disallowed API).`,
  "",
  ...rows.map((r) => `- **${r.slug}**: ${r.status}${r.changes?.length ? ` (${r.changes.join(", ")})` : ""}`),
];
const report = lines.join("\n");
console.log(report);
if (process.env.REFRESH_REPORT) writeFileSync(process.env.REFRESH_REPORT, report + "\n");
if (rows.length && updated === 0) {
  console.error("No casino could be refreshed: the page format may have changed.");
  process.exit(1);
}
