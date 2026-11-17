import { SITE_URL, SITE_NAME } from "./site";
import { articles, AUTHORS, cleanHtml } from "./posts";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const rss = (body: string) =>
  new Response(body, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });

/** /feed/: the articles, as WordPress's RSS 2.0 feed listed them. */
export function postsFeed() {
  const items = articles()
    .map(
      (p) => `\t<item>
\t\t<title>${esc(p.title)}</title>
\t\t<link>${SITE_URL}/${p.slug}/</link>
\t\t<guid isPermaLink="true">${SITE_URL}/${p.slug}/</guid>
\t\t<dc:creator><![CDATA[${AUTHORS[p.author]?.name ?? ""}]]></dc:creator>
\t\t<pubDate>${new Date(`${p.date}T12:00:00Z`).toUTCString()}</pubDate>
\t\t<description><![CDATA[${p.description}]]></description>
\t\t<content:encoded><![CDATA[${cleanHtml(p.html).replace(/(href|src)="\//g, `$1="${SITE_URL}/`)}]]></content:encoded>
\t</item>`
    )
    .join("\n");
  return rss(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
\t<title>${SITE_NAME}</title>
\t<atom:link href="${SITE_URL}/feed/" rel="self" type="application/rss+xml" />
\t<link>${SITE_URL}/</link>
\t<description>Crypto casino data with a source on every figure</description>
\t<language>en-US</language>
\t<lastBuildDate>${new Date(`${articles()[0]?.modified ?? "2025-08-11"}T12:00:00Z`).toUTCString()}</lastBuildDate>
${items}
</channel>
</rss>`);
}

/** /comments/feed/: comments are closed since the move; an empty, valid feed. */
export function commentsFeed() {
  return rss(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
\t<title>Comments for ${SITE_NAME}</title>
\t<atom:link href="${SITE_URL}/comments/feed/" rel="self" type="application/rss+xml" />
\t<link>${SITE_URL}/</link>
\t<description>Comments are closed.</description>
</channel>
</rss>`);
}
