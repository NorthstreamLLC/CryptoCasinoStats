import { leaderboards, type BoardRow } from "./home-data";
import { volumeFor } from "./volume";
import { getCasino, atAGlance, specGroups, shortFact, casinoPath } from "./casinos";
import { readingsFor, getGame } from "./slots";
import { hasLink } from "./outbound";
import { partnerCards } from "./partners";
import { getSpecFact } from "./spec-sheet";
import { volumeTable } from "./volume";
import { OPS } from "./casinos";

/**
 * Everything a casino profile page shows, computed from the shared data. Ranks
 * are positions in the FairGambling 30-day deposit ranking (the same one the
 * home leaderboard uses), with the date of the casino's own figure.
 */

function fullBoard(metric: "deposits" | "wallet"): BoardRow[] {
  return volumeTable()
    .map((r) => {
      const list = metric === "deposits" ? r.deposits : r.wallet;
      const f = list.find((x) => x.source === "FairGambling");
      if (!f || !Number.isFinite(f.num)) return null;
      const o = OPS.find((x) => x.slug === r.slug);
      return { slug: r.slug, name: r.name, mono: o?.mono ?? "", path: casinoPath(r.slug), value: f.value, num: f.num, source: f.source, sourceUrl: f.sourceUrl, asOf: f.asOf };
    })
    .filter((x): x is BoardRow => !!x)
    .sort((a, b) => b.num - a.num);
}

export function casinoProfile(slug: string) {
  const o = getCasino(slug)!;
  const g = atAGlance(o);
  const v = volumeFor(slug);
  const board = fullBoard("deposits");
  const idx = board.findIndex((r) => r.slug === slug);
  const neighbours = idx < 0 ? [] : board.slice(Math.max(0, Math.min(idx - 2, board.length - 5)), Math.max(0, Math.min(idx - 2, board.length - 5)) + 5);
  const wallets = fullBoard("wallet");
  const widx = wallets.findIndex((r) => r.slug === slug);
  const readings = readingsFor(slug)
    .map((r) => ({ ...r, name: getGame(r.slotSlug)?.name ?? r.slotSlug }))
    .sort((a, b) => a.name.localeCompare(b.name));
  const alternatives = partnerCards({ context: { kind: "alternative", of: slug }, seed: slug, exclude: [slug] });
  const groups = specGroups(slug).map((grp) => ({
    title: grp.title,
    facts: grp.facts.map((f) => ({ label: f.label, value: shortFact(f), sourceUrl: f.sourceUrl ?? null, asOf: f.asOf ?? null })),
  }));
  const licenceFact = getSpecFact(slug, "Compliance", "Licence");
  return {
    o,
    glance: g,
    link: hasLink(slug),
    deposits: v?.deposits ?? [],
    wallet: v?.wallet ?? [],
    rank: idx >= 0 ? { pos: idx + 1, of: board.length, row: board[idx] } : null,
    walletRank: widx >= 0 ? { pos: widx + 1, of: wallets.length } : null,
    neighbours,
    neighbourMax: board[0]?.num ?? 1,
    readings,
    alternatives,
    groups,
    licenceSource: licenceFact?.sourceUrl ? { url: licenceFact.sourceUrl, asOf: licenceFact.asOf ?? null } : null,
    factCount: groups.reduce((n, gr) => n + gr.facts.filter((f) => f.sourceUrl).length, 0),
  };
}

export type CasinoProfileData = ReturnType<typeof casinoProfile>;
export { leaderboards };
