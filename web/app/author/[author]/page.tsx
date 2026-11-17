import { notFound } from "next/navigation";
import { Container } from "@/components/ui";
import { PostList } from "@/components/PostList";
import { allPosts, AUTHORS } from "@/lib/posts";
import { pageMeta } from "@/lib/site";

export const dynamicParams = false;

const bySlug = (slug: string) => Object.entries(AUTHORS).find(([, a]) => a.slug === slug);

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
  return (
    <Container className="max-w-4xl py-10">
      <h1 className="text-3xl font-bold tracking-tight">Author: {a.name}</h1>
      {a.bio && <p className="mb-8 mt-2 text-text-muted">{a.bio}</p>}
      <div className="mt-6">
        <PostList posts={posts} />
      </div>
    </Container>
  );
}
