import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/posts";

const fmt = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const thumb = (p: Post) => p.image!.replace(/\.png$/, "-1024x576.png");

/** Article cards. The cover images are title graphics, so they are always shown whole, never cropped. */
export function Articles({ posts }: { posts: Post[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {posts.map((p) => (
        <Link key={p.slug} href={`/${p.slug}/`} className="ccs-card ccs-lift group flex min-w-0 flex-col overflow-hidden">
          <div className="overflow-hidden">
            <Image src={thumb(p)} alt="" width={1024} height={576} className="h-auto w-full transition duration-500 group-hover:scale-[1.03]" />
          </div>
          <div className="flex flex-1 flex-col p-5">
            <p className="text-xs text-text-dim">{fmt(p.date)}</p>
            <h3 className="mt-2 text-lg font-semibold leading-snug text-text-primary">{p.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm text-text-muted">{p.description}</p>
            <span className="mt-auto pt-4 text-sm font-semibold text-accent">Read →</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
