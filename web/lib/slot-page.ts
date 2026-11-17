import { getGame, allReadings, fmtRtp, fmtX, CATALOGUE_AS_OF } from "./slots";
import { artProxyPath } from "./art-proxy";
import watchOps from "@/data/watchOps.json";
import catalogue from "@/data/gameCatalogue.json";
import { casinoPath } from "./casinos";

export interface SlotCard {
  slug: string;
  name: string;
  provider: string;
  rtp: string;
  rtpNum: number | null;
  maxWin: string;
  volatility: string;
  released: string | null;
  art: string | null;
}

/** A slot's card data, art served through /api/art when the catalogue has it. */
export function slotCard(slug: string, fallbackArt?: string): SlotCard {
  const g = getGame(slug);
  return {
    slug,
    name: g?.name ?? slug,
    provider: g?.provider ?? "—",
    rtp: fmtRtp(g?.rtp),
    rtpNum: g?.rtp ?? null,
    maxWin: fmtX(g?.maxWinMultiplier),
    volatility: g?.volatility ?? "—",
    released: g?.released ?? null,
    art: fallbackArt ?? artProxyPath(slug),
  };
}

/** The RTP-by-casino matrix: slots that have readings, against every casino read. */
export function rtpMatrix() {
  const rs = allReadings();
  const casinos = (watchOps as { slug: string; name: string }[]).filter((o) => rs.some((r) => r.operatorSlug === o.slug)).map((o) => ({ ...o, path: casinoPath(o.slug) }));
  const slugs = [...new Set(rs.map((r) => r.slotSlug))];
  const rows = slugs
    .map((s) => {
      const g = getGame(s);
      return {
        slug: s,
        name: g?.name ?? s,
        provider: g?.rtp ?? null,
        cells: casinos.map((c) => {
          const r = rs.find((x) => x.slotSlug === s && x.operatorSlug === c.slug);
          return r ? { rtp: r.rtp, state: g?.rtp != null && r.rtp < g.rtp - 0.1 ? "lower" : "match" } : null;
        }),
      };
    })
    .sort((a, b) => b.cells.filter(Boolean).length - a.cells.filter(Boolean).length || a.name.localeCompare(b.name));
  const lastRead = rs.map((r) => r.checkedAt).sort().at(-1) ?? "";
  const matching = rs.filter((r) => {
    const g = getGame(r.slotSlug);
    return g?.rtp == null || r.rtp >= g.rtp - 0.1;
  }).length;
  return { casinos, rows, lastRead, total: rs.length, matching };
}

export const catalogueSize = () => (catalogue as { games: unknown[] }).games.length;
export { CATALOGUE_AS_OF };
