import { cleanHtml } from "./posts";

export interface TocItem {
  id: string;
  text: string;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&[a-z]+;/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

const strip = (s: string) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&#8212;|&mdash;/g, "—")
    .replace(/&[a-z#0-9]+;/g, " ")
    .trim();

/** Adds ids to the article's h2s and returns them as a table of contents. The text itself is unchanged. */
export function prepareArticle(html: string): { html: string; toc: TocItem[]; minutes: number } {
  const toc: TocItem[] = [];
  const seen = new Set<string>();
  const out = cleanHtml(html).replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/g, (_m, attrs: string, inner: string) => {
    const text = strip(inner);
    let id = slugify(text) || `section-${toc.length + 1}`;
    while (seen.has(id)) id += "-2";
    seen.add(id);
    toc.push({ id, text });
    return `<h2${attrs.replace(/\sid="[^"]*"/, "")} id="${id}">${inner}</h2>`;
  });
  const words = strip(out).split(/\s+/).filter(Boolean).length;
  return { html: out, toc, minutes: Math.max(1, Math.round(words / 230)) };
}
