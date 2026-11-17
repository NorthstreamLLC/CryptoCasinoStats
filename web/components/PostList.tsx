import Image from "next/image";
import Link from "next/link";
import { fmtDate } from "@/lib/site";
import { AUTHORS, type Post } from "@/lib/posts";

export function PostList({ posts }: { posts: Post[] }) {
  return (
    <div className="grid gap-5">
      {posts.map((p) => (
        <Link key={p.slug} href={`/${p.slug}/`} className="grid gap-4 overflow-hidden rounded-[14px] border border-border bg-surface hover:bg-row-hover sm:grid-cols-[280px_1fr]">
          {p.image ? <Image src={p.image.replace(/\.png$/, "-1024x576.png")} alt="" width={1024} height={576} className="h-full w-full object-cover" /> : <div className="hidden sm:block" />}
          <div className="p-5">
            <h2 className="text-xl font-semibold">{p.title}</h2>
            <p className="mt-1 text-xs text-text-dim">
              {AUTHORS[p.author]?.name} · {fmtDate(p.date)}
            </p>
            <p className="mt-2 text-sm text-text-muted">{p.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
