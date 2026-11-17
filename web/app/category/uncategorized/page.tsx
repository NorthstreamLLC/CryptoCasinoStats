import Image from "next/image";
import Link from "next/link";
import { allPosts, AUTHORS } from "@/lib/posts";
import { prepareArticle } from "@/lib/article";
import { pageMeta, fmtDate } from "@/lib/site";
import { DocHero } from "@/components/doc/DocHero";
import { Articles } from "@/components/home/Articles";

export const metadata = pageMeta(
  "Uncategorized Archives",
  "Analysis and guides from Crypto Casino Stats: how to read casino stats, which metrics matter, and where on-chain casino analytics is heading.",
  "/category/uncategorized/"
);

export default function Page() {
  const posts = allPosts();
  const [lead, ...rest] = posts;
  const leadMin = prepareArticle(lead.html).minutes;
  return (
    <>
      <DocHero eyebrow={<span>Analysis · {posts.length} articles</span>} title="Analysis" lede="Guides to reading crypto casino numbers: which metrics matter, how to track your own sessions, and where on-chain analytics is heading." wide />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <Link href={`/${lead.slug}/`} className="ccs-card ccs-lift ccs-card-glow group grid grid-cols-1 overflow-hidden lg:grid-cols-[1.2fr_1fr]">
          {lead.image && (
            <div className="overflow-hidden">
              <Image src={lead.image} alt="" width={1600} height={900} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
            </div>
          )}
          <div className="flex flex-col justify-center p-6 sm:p-10">
            <p className="ccs-eyebrow">Latest · {fmtDate(lead.date)} · {leadMin} min read</p>
            <h2 className="ccs-display mt-3 text-3xl sm:text-4xl">{lead.title}</h2>
            <p className="mt-3 text-text-secondary">{lead.description}</p>
            <p className="mt-6 text-sm text-text-dim">By {AUTHORS[lead.author]?.name}</p>
            <span className="mt-4 text-sm font-semibold text-accent">Read the article →</span>
          </div>
        </Link>
        {rest.length > 0 && (
          <div className="mt-6">
            <Articles posts={rest} />
          </div>
        )}
      </div>
    </>
  );
}
