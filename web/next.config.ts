import type { NextConfig } from "next";

/**
 * Crypto Casino Stats. Every URL from the old WordPress site keeps its exact
 * path, trailing slash included (WordPress served /stake/, and /stake 301'd to
 * it), so trailingSlash is on. Files with an extension (sitemaps, images) are
 * exempt from the slash, which is what the old site did too.
 */
const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "api.slotessentials.com" }],
  },
  async headers() {
    return [
      // Preview builds stay out of search indexes; never applies to production.
      ...(process.env.VERCEL_ENV === "preview" ? [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }] : []),
      // Any *.vercel.app address (including the project's production one) stays
      // out of search: only cryptocasinostats.com should be indexed.
      { source: "/:path*", has: [{ type: "host", value: "(?<host>.*\\.vercel\\.app)" }], headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // One host: www and any leftover server hostname go to the apex.
      { source: "/:path*", has: [{ type: "host", value: "www.cryptocasinostats.com" }], destination: "https://cryptocasinostats.com/:path*", permanent: true },
      // Casinos the old site had at the root keep their root pages.
      { source: "/casinos/:slug(stake|roobet|razed)", destination: "/:slug/", permanent: true },
      // WordPress odds and ends that people or bots may still request.
      { source: "/wp-admin/:path*", destination: "/", permanent: false },
      { source: "/wp-login.php", destination: "/", permanent: false },
      { source: "/sitemap.xml", destination: "/sitemap_index.xml", permanent: true },
      { source: "/wp-sitemap.xml", destination: "/sitemap_index.xml", permanent: true },
      // The old favicon, renamed: same image, neutral filename.
      { source: "/wp-content/uploads/2025/07/:file(cropped-Razed-Discord-Giveaways-2.*)", destination: "/icon.jpg", permanent: true },
    ];
  },
};

export default nextConfig;
