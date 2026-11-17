import Link from "next/link";
import { notFound } from "next/navigation";
import { allPosts, AUTHORS } from "@/lib/posts";
import { pageMeta, fmtDate, SITE_URL } from "@/lib/site";
import { DocHero } from "@/components/doc/DocHero";
import { Articles } from "@/components/home/Articles";

export const dynamicParams = false;

const bySlug = (slug: string) => Object.entries(AUTHORS).find(([, a]) => a.slug === slug);
const initials = (n: string) => n.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

export function generateStaticParams() {
  return Object.values(AUTHORS).map((a) => ({ author: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ author: string }> }) {
  const slug = (await params).author;
  const e = bySlug(slug);
  if (!e) return {};
  const [, a] = e;
  // The default WordPress account has only the starter post: kept, out of the index.
  return pageMeta(`${a.name}, Author at Crypto Casino Stats`, `Articles by ${a.name} on Crypto Casino Stats.`, `/author/${slug}/`, { noindex: slug === "user" });
}

export default async function AuthorPage({ params }: { params: Promise<{ author: string }> }) {
  const e = bySlug((await params).author);
  if (!e) notFound();
  const [id, a] = e;
  const posts = allPosts().filter((p) => p.author === Number(id));
  const first = posts.map((p) => p.date).sort()[0];
  const ld = { "@context": "https://schema.org", "@type": "ProfilePage", mainEntity: { "@type": "Person", name: a.name, url: `${SITE_URL}/author/${a.slug}/` } };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <DocHero eyebrow={<span>Author</span>} title={a.name} lede={a.bio} wide>
        <div className="mt-7 flex flex-wrap items-center gap-6">
          <span aria-hidden className="ccs-num flex h-16 w-16 items-center justify-center rounded-2xl border border-border-strong bg-surface-raised text-xl font-semibold text-accent">{initials(a.name)}</span>
          <dl className="flex gap-8">
            <div>
              <dt className="text-xs text-text-dim">Articles</dt>
              <dd className="ccs-num text-2xl font-semibold text-text-primary">{posts.length}</dd>
            </div>
            {first && (
              <div>
                <dt className="text-xs text-text-dim">Writing since</dt>
                <dd className="ccs-num text-2xl font-semibold text-text-primary">{fmtDate(first)}</dd>
              </div>
            )}
          </dl>
        </div>
      </DocHero>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        {posts.length ? <Articles posts={posts} /> : <p className="text-text-muted">No articles yet.</p>}
        <p className="mt-10 text-sm">
          <Link href="/category/uncategorized/" className="font-semibold text-accent hover:underline">All analysis →</Link>
        </p>
      </div>
    </>
  );
}
