import { SITE_URL } from "./site";
import { articles } from "./posts";
import { latestAsOf } from "./volume";
import { allReadings } from "./slots";
import { OPS, isRootCasino } from "./casinos";

/**
 * The same sitemap files the WordPress site (Yoast) published, so Search
 * Console's submitted sitemap keeps working. Only indexable pages are listed.
 */
type Entry = { path: string; lastmod?: string };

const dataDate = () => [latestAsOf(), ...allReadings().map((r) => r.checkedAt)].sort().at(-1);

export const SITEMAPS: Record<string, () => Entry[]> = {
  "post-sitemap.xml": () => articles().map((p) => ({ path: `/${p.slug}/`, lastmod: p.modified })),
  "page-sitemap.xml": () => [
    { path: "/", lastmod: dataDate() },
    { path: "/casinos/", lastmod: dataDate() },
    { path: "/stake/", lastmod: dataDate() },
    { path: "/roobet/", lastmod: dataDate() },
    { path: "/razed/", lastmod: dataDate() },
    { path: "/top-slots/", lastmod: dataDate() },
    ...OPS.filter((o) => !isRootCasino(o.slug)).map((o) => ({ path: `/casinos/${o.slug}/`, lastmod: dataDate() })),
    { path: "/methodology/" },
    { path: "/affiliate-disclosure/" },
    { path: "/responsible-gambling/" },
  ],
  "category-sitemap.xml": () => [{ path: "/category/uncategorized/", lastmod: articles()[0]?.modified }],
  "author-sitemap.xml": () => [{ path: "/author/smartercarter/", lastmod: articles()[0]?.modified }],
};

const xml = (body: string) =>
  new Response(`<?xml version="1.0" encoding="UTF-8"?>\n${body}`, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });

export function urlset(name: string) {
  const rows = SITEMAPS[name]()
    .map((e) => `\t<url>\n\t\t<loc>${SITE_URL}${e.path}</loc>${e.lastmod ? `\n\t\t<lastmod>${e.lastmod}</lastmod>` : ""}\n\t</url>`)
    .join("\n");
  return xml(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows}\n</urlset>`);
}

export function sitemapIndex() {
  const rows = Object.entries(SITEMAPS)
    .map(([name, fn]) => {
      const last = fn().map((e) => e.lastmod).filter(Boolean).sort().at(-1);
      return `\t<sitemap>\n\t\t<loc>${SITE_URL}/${name}</loc>${last ? `\n\t\t<lastmod>${last}</lastmod>` : ""}\n\t</sitemap>`;
    })
    .join("\n");
  return xml(`<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows}\n</sitemapindex>`);
}
