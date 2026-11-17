import catalogue from "@/data/gameCatalogue.json";
import rtpWatch from "@/data/rtpWatch.json";
import type { RtpReading } from "./types";

/**
 * Slot facts for Crypto Casino Stats.
 *
 * Two different kinds of RTP figure, never mixed:
 *  - providerRtp: the studio's published default RTP, from the shared game
 *    catalogue (gameCatalogue.json, exported from slotessentials.com).
 *  - reading: the RTP a specific casino shows for its own copy of the game,
 *    read on that casino's game page or in-game paytable, with the date it was
 *    read (rtpWatch.json). A casino can run a lower-RTP version of a game, so
 *    only a reading says what that casino actually runs.
 * Nothing else is published as an RTP. In particular no figure above 100% is:
 * that is not a game's RTP, whatever a tracker's sample returned.
 */
export interface CatalogueGame {
  name: string;
  slug: string;
  provider: string;
  rtp: number | null;
  volatility: string | null;
  maxWinMultiplier: number | null;
  image: string | null;
  released: string | null;
}

const GAMES = (catalogue as { asOf: string; games: CatalogueGame[] }).games;
export const CATALOGUE_AS_OF = (catalogue as { asOf: string }).asOf;
const BY_SLUG = new Map(GAMES.map((g) => [g.slug, g]));

export const getGame = (slug: string) => BY_SLUG.get(slug) ?? null;

const READINGS = rtpWatch as RtpReading[];

/** The latest reading of a slot at a casino, or null. */
export function readingAt(slotSlug: string, operatorSlug: string): RtpReading | null {
  const r = READINGS.filter((x) => x.slotSlug === slotSlug && x.operatorSlug === operatorSlug).sort((a, b) => b.checkedAt.localeCompare(a.checkedAt));
  return r[0] ?? null;
}

export const readingsFor = (operatorSlug: string) => READINGS.filter((x) => x.operatorSlug === operatorSlug);
export const allReadings = () => READINGS;

export const SOURCE_LABEL: Record<RtpReading["source"], string> = {
  in_client_paytable: "in-game paytable",
  operator_game_page: "casino's game page",
  operator_support: "casino support",
  reader_report: "reader report",
};

export const fmtRtp = (n: number | null | undefined) => (n == null ? "—" : `${n.toFixed(2)}%`);
export const fmtX = (n: number | null | undefined) => (n == null ? "—" : `${n.toLocaleString("en-US")}x`);
