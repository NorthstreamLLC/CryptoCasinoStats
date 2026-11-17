import posts from "@/data/ccs/posts.json";

export interface Post {
  slug: string;
  title: string;
  date: string;
  modified: string;
  author: number;
  description: string;
  image: string | null;
  html: string;
}

export const AUTHORS: Record<number, { slug: string; name: string; bio?: string }> = {
  2: { slug: "smartercarter", name: "Triston Carter", bio: "Writes about crypto casino data and how to read it." },
  1: { slug: "user", name: "user" },
};

/** All posts, newest first. hello-world is WordPress's starter post: kept at its URL, out of the index. */
export const allPosts = (): Post[] => [...(posts as Post[])].sort((a, b) => b.date.localeCompare(a.date));
export const articles = () => allPosts().filter((p) => p.slug !== "hello-world");
export const getPost = (slug: string) => allPosts().find((p) => p.slug === slug) ?? null;

/** Article HTML from WordPress, with the theme's empty spacer blocks removed. */
export const cleanHtml = (html: string) => html.replace(/<div style="height:\d+px" aria-hidden="true" class="wp-block-spacer"><\/div>/g, "").replace(/<br>\s*<\/p>/g, "</p>");
