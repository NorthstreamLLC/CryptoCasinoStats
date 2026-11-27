import onChain from "@/data/onChainVolume.json";
import ops from "@/data/ops.json";
import type { OnChainVolumeEntry, Operator } from "./types";

/**
 * Third-party on-chain figures (FairGambling, Tanzanite): each platform's own
 * attribution of wallet activity to a casino, cited with its page and date.
 * We did not measure these; clustering wallets is a heuristic. Values are kept
 * as the source displayed them; `num` is parsed only to sort.
 */
export interface VolumeFigure {
  value: string;
  num: number;
  note?: string;
  source: string;
  sourceUrl: string;
  asOf: string;
}

const ENTRIES = onChain as OnChainVolumeEntry[];
const OPS = ops as Operator[];

export function parseMoney(v: string): number {
  const m = v.replace(/[, ]/g, "").match(/\$?([\d.]+)([KMB])?/i);
  if (!m) return NaN;
  const mult = { K: 1e3, M: 1e6, B: 1e9 }[(m[2] ?? "").toUpperCase() as "K" | "M" | "B"] ?? 1;
  return parseFloat(m[1]) * mult;
}

function pick(slug: string, metric: string): VolumeFigure[] {
  const e = ENTRIES.find((x) => x.operatorSlug === slug);
  if (!e) return [];
  return e.sources
    .filter((s) => s.metric === metric)
    .map((s) => ({ value: s.value, num: parseMoney(s.value), note: s.note, source: s.source, sourceUrl: s.sourceUrl, asOf: s.asOf }))
    .sort((a, b) => b.asOf.localeCompare(a.asOf));
}

export const DEPOSITS = "30-day deposit volume";
export const HOT_WALLET = "Hot wallet balance (all chains)";

export interface CasinoVolumeRow {
  slug: string;
  name: string;
  deposits: VolumeFigure[];
  wallet: VolumeFigure[];
}

export function volumeFor(slug: string): CasinoVolumeRow | null {
  const o = OPS.find((x) => x.slug === slug);
  const deposits = pick(slug, DEPOSITS);
  const wallet = pick(slug, HOT_WALLET);
  if (!deposits.length && !wallet.length) return null;
  return { slug, name: o?.name ?? slug, deposits, wallet };
}

/** Every casino with at least one cited figure, largest FairGambling 30-day deposit volume first. */
export function volumeTable(): CasinoVolumeRow[] {
  const rows = ENTRIES.map((e) => volumeFor(e.operatorSlug)).filter((r): r is CasinoVolumeRow => !!r);
  const key = (r: CasinoVolumeRow) => {
    const fg = r.deposits.find((d) => d.source === "FairGambling") ?? r.deposits[0];
    return fg ? fg.num : -1;
  };
  return rows.sort((a, b) => key(b) - key(a));
}

/** Latest as-of date across every figure, for "data as of" lines. */
export function latestAsOf(): string {
  return ENTRIES.flatMap((e) => e.sources.map((s) => s.asOf)).sort().at(-1) ?? "";
}
export function earliestAsOf(): string {
  return ENTRIES.flatMap((e) => e.sources.map((s) => s.asOf)).sort()[0] ?? "";
}

/**
 * The current window. FairGambling's figures are each a trailing 30 days as of
 * the day we read them. Figures read within CURRENT_DAYS of the latest weekly
 * run cover (nearly) the same 30 days and can be added up or ranked together;
 * anything older is "stale": shown with its own date, never summed or ranked
 * with current figures.
 */
export const CURRENT_DAYS = 7;
const dayMs = 86400000;

export function latestRun(): string {
  return ENTRIES.flatMap((e) => e.sources.filter((s) => s.source === "FairGambling").map((s) => s.asOf)).sort().at(-1) ?? "";
}

export const isCurrent = (asOf: string, ref = latestRun()) =>
  !!asOf && !!ref && (new Date(`${ref}T00:00:00Z`).getTime() - new Date(`${asOf}T00:00:00Z`).getTime()) / dayMs <= CURRENT_DAYS;
