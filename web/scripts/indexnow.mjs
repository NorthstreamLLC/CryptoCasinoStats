#!/usr/bin/env node
/**
 * Tell IndexNow (Bing, Yandex, Seznam, Naver…) that the site's URLs changed.
 * Reads every URL from the live sitemaps and submits them in one request.
 * The key file is web/public/a0151198ac92559ed1d18810a3ad19a6.txt, served at the site root.
 *
 *   node scripts/indexnow.mjs
 */
const HOST = "cryptocasinostats.com";
const KEY = "a0151198ac92559ed1d18810a3ad19a6";
const maps = ["post-sitemap.xml", "page-sitemap.xml", "category-sitemap.xml", "author-sitemap.xml"];
const urls = [];
for (const m of maps) {
  const xml = await (await fetch(`https://${HOST}/${m}`)).text();
  for (const x of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) urls.push(x[1]);
}
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow: HTTP ${res.status} for ${urls.length} URLs`);
if (res.status >= 400) process.exit(1);
