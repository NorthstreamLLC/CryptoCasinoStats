import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, getPost, AUTHORS } from "@/lib/posts";
import { prepareArticle } from "@/lib/article";
import { heroStats } from "@/lib/home-data";
import { partnerCards } from "@/lib/partners";
import { pageMeta, fmtDate, SITE_URL } from "@/lib/site";
import { DocHero } from "@/components/doc/DocHero";
import { Toc } from "@/components/doc/Toc";
import { ReadingProgress } from "@/components/doc/ReadingProgress";
import { Articles } from "@/components/home/Articles";
import { PartnerCards } from "@/components/PartnerCards";

export const dynamicParams = false;

export function generateStaticParams() {
  return articles().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug);
  if (!p) return {};
  return pageMeta(p.title, p.description, `/${p.slug}/`, { image: p.image ?? undefined, type: "article", published: p.date, modified: p.modified });
}

const initials = (n: string) => n.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug);
  if (!p) notFound();
  const a = AUTHORS[p.author];
  const { html, toc, minutes } = prepareArticle(p.html);
  const s = heroStats();
  const more = articles().filter((x) => x.slug !== p.slug);
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
    timeRequired: `PT${minutes}M`,
  };
  const numbers = [
    { v: s.deposits.value, l: "30-day on-chain deposits", h: "/casinos/#volume" },
    { v: s.readings.value, l: "casino RTP readings", h: "/top-slots/#rtp-by-casino" },
    { v: String(s.casinosTracked), l: "casinos tracked", h: "/casinos/#all-casinos" },
  ];

  return (
    <>
      <ReadingProgress target="#article-body" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <DocHero
        eyebrow={
          <>
            <Link href="/category/uncategorized/" className="text-accent hover:underline">Analysis</Link>
            <span aria-hidden>·</span>
            <time dateTime={p.date}>{fmtDate(p.date)}</time>
            <span aria-hidden>·</span>
            <span>{minutes} min read</span>
          </>
        }
        title={p.title}
        lede={p.description}
      >
        <div className="mt-7 flex items-center gap-3">
          <span aria-hidden className="ccs-num flex h-11 w-11 items-center justify-center rounded-full border border-border-strong bg-surface-raised text-sm font-semibold text-accent">{initials(a.name)}</span>
          <div className="text-sm">
            <Link href={`/author/${a.slug}/`} className="font-semibold text-text-primary hover:text-accent">{a.name}</Link>
            <p className="text-text-dim">{p.modified !== p.date ? `Updated ${fmtDate(p.modified)}` : `Published ${fmtDate(p.date)}`}</p>
          </div>
        </div>
      </DocHero>

      <div className="mx-auto max-w-6xl px-4">
        {p.image && (
          <div className="ccs-card relative mx-auto -mt-px max-w-4xl overflow-hidden sm:mt-8">
            <Image src={p.image} alt="" width={1600} height={900} priority className="h-auto w-full" />
          </div>
        )}

        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-14">
          <article id="article-body" className="min-w-0">
            {toc.length > 1 && (
              <details className="ccs-card mb-8 p-4 lg:hidden">
                <summary className="cursor-pointer font-semibold text-text-primary">On this page</summary>
                <ol className="mt-3 grid gap-2 text-sm">
                  {toc.map((t) => (
                    <li key={t.id}><a href={`#${t.id}`} className="text-text-secondary hover:text-accent">{t.text}</a></li>
                  ))}
                </ol>
              </details>
            )}
            <div className="ccs-prose ccs-lead" dangerouslySetInnerHTML={{ __html: html }} />

            <div className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                ["Casino stats", "Deposits, wallets and terms for 46 casinos", "/casinos/"],
                ["RTP by casino", "What each casino actually runs", "/top-slots/#rtp-by-casino"],
                ["Methodology", "Where every number comes from", "/methodology/"],
              ].map(([t, d, h]) => (
                <Link key={t} href={h} className="ccs-card ccs-lift p-5">
                  <p className="font-semibold text-text-primary">{t} →</p>
                  <p className="mt-1 text-sm text-text-muted">{d}</p>
                </Link>
              ))}
            </div>

            <div className="ccs-card mt-6 flex items-start gap-4 p-5">
              <span aria-hidden className="ccs-num flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border-strong bg-surface-raised font-semibold text-accent">{initials(a.name)}</span>
              <div>
                <p className="ccs-eyebrow">Written by</p>
                <Link href={`/author/${a.slug}/`} className="mt-1 block text-lg font-semibold text-text-primary hover:text-accent">{a.name}</Link>
                {a.bio && <p className="mt-1 text-sm text-text-muted">{a.bio}</p>}
              </div>
            </div>
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-24 grid gap-6">
              <Toc items={toc} />
              <div className="ccs-card p-5">
                <p className="ccs-eyebrow">The numbers</p>
                <ul className="mt-3 grid gap-3">
                  {numbers.map((n) => (
                    <li key={n.l}>
                      <Link href={n.h} className="group block">
                        <span className="ccs-num block text-2xl font-semibold text-text-primary group-hover:text-accent">{n.v}</span>
                        <span className="text-xs text-text-dim">{n.l}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 border-t border-border pt-3 text-xs text-text-dim">Data as of {fmtDate(s.updated)}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {more.length > 0 && (
        <section className="mt-20 bg-section py-16">
          <div className="mx-auto max-w-6xl px-4">
            <p className="ccs-eyebrow">Keep reading</p>
            <h2 className="ccs-display mb-8 mt-3 text-3xl">More analysis</h2>
            <Articles posts={more} />
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <p className="ccs-eyebrow">Where to play</p>
          <h2 className="ccs-display mb-8 mt-3 text-3xl">Partner casinos with the numbers</h2>
          <PartnerCards cards={partnerCards({ seed: p.slug })} placement="article" />
        </div>
      </section>
    </>
  );
}
