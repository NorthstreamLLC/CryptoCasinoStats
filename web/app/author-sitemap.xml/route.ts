import { urlset } from "@/lib/sitemaps";
export const dynamic = "force-static";
export function GET() {
  return urlset("author-sitemap.xml");
}
