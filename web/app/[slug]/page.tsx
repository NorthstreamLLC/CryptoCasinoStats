import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui";
import { PartnerList } from "@/components/PartnerList";
import { articles, getPost, cleanHtml, AUTHORS } from "@/lib/posts";
import { pageMeta, fmtDate, SITE_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return articles().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug);
  if (!p) return {};
  return pageMeta(p.title, p.description, `/${p.slug}/`, { image: p.image ?? undefined, type: "article", published: p.date, modified: p.modified });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug);
  if (!p) notFound();
  const a = AUTHORS[p.author];
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    description: p.description,
    datePublished: p.date,
    dateModified: p.modified,
    image: p.image ? `${SITE_URL}${p.image}` : undefined,
    author: { "@type": "Person", name: a.name, url: `${SITE_URL}/author/${a.slug}/` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: `${SITE_URL}/${p.slug}/`,
  };
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Container className="max-w-3xl py-10">
        <nav aria-label="Breadcrumb" className="mb-3 text-xs text-text-dim">
          <Link href="/" className="hover:text-text-primary">Home</Link> / <Link href="/category/uncategorized/" className="hover:text-text-primary">Analysis</Link>
        </nav>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{p.title}</h1>
        <p className="mt-3 text-sm text-text-dim">
          By <Link href={`/author/${a.slug}/`} className="text-text-secondary hover:text-accent">{a.name}</Link> · {fmtDate(p.date)}
          {p.modified !== p.date && <> · updated {fmtDate(p.modified)}</>}
        </p>
        {p.image && <Image src={p.image} alt="" width={1600} height={900} priority className="mt-6 h-auto w-full rounded-[14px]" />}
        <div className="prose-ccs mt-8" dangerouslySetInnerHTML={{ __html: cleanHtml(p.html) }} />
        <div className="mt-10 rounded-[14px] border border-border bg-surface p-5 text-sm text-text-secondary">
          Put this into practice with the numbers: <Link href="/casinos/" className="text-accent hover:underline">casino deposit volumes and RTP readings</Link> and{" "}
          <Link href="/top-slots/" className="text-accent hover:underline">slot stats by casino</Link>.
        </div>
        <PartnerList seed={p.slug} />
      </Container>
    </article>
  );
}
