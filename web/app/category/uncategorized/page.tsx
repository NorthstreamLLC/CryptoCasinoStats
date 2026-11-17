import { Container } from "@/components/ui";
import { PostList } from "@/components/PostList";
import { allPosts } from "@/lib/posts";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta("Uncategorized Archives", "Analysis and guides from Crypto Casino Stats: how to read casino stats, which metrics matter, and where on-chain casino analytics is heading.", "/category/uncategorized/");

export default function Page() {
  return (
    <Container className="max-w-4xl py-10">
      <h1 className="text-3xl font-bold tracking-tight">Analysis</h1>
      <p className="mb-8 mt-2 text-text-muted">Guides to reading crypto casino numbers.</p>
      <PostList posts={allPosts()} />
    </Container>
  );
}
