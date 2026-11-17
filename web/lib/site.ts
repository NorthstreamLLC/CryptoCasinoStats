import type { Metadata } from "next";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://cryptocasinostats.com").replace(/\/$/, "");
export const SITE_NAME = "Crypto Casino Stats";
export const SITE_TAGLINE = "Crypto casino data with a source on every figure";

/** Page metadata with a canonical on the apex host and the trailing slash the site uses. */
export function pageMeta(
  title: string,
  description: string,
  path: string,
  opts: { image?: string; noindex?: boolean; type?: "website" | "article"; published?: string; modified?: string } = {}
): Metadata {
  const url = `${SITE_URL}${path}`;
  const images = [{ url: opts.image ?? "/wp-content/uploads/2025/07/22.png" }];
  return {
    title: title.length > 40 || title.includes(SITE_NAME) ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    ...(opts.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: opts.type ?? "website",
      images,
      ...(opts.published ? { publishedTime: opts.published } : {}),
      ...(opts.modified ? { modifiedTime: opts.modified } : {}),
    },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export const fmtDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** Days between an ISO date and now. */
export const ageDays = (iso: string) => Math.floor((Date.now() - new Date(`${iso}T00:00:00Z`).getTime()) / 86400000);
