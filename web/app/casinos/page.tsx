import Image from "next/image";
import Link from "next/link";
import { pageMeta, fmtDate, SITE_URL } from "@/lib/site";
import { heroStats, leaderboards, sourcedFactCount } from "@/lib/home-data";
import { directoryRows, headToHead } from "@/lib/directory";
import { partnerCards } from "@/lib/partners";
import { casinoPath, getCasino } from "@/lib/casinos";
import { goPath, hasLink } from "@/lib/outbound";
import { PageHero } from "@/components/home/PageHero";
import { Section } from "@/components/home/Section";
import { Leaderboard } from "@/components/home/Leaderboard";
import { Directory } from "@/components/casinos/Directory";
import { HeadToHead } from "@/components/casinos/HeadToHead";
import { PartnerCards } from "@/components/PartnerCards";

export const metadata = pageMeta(
  "Casinos",
  "Crypto casinos compared: 30-day on-chain deposits, hot-wallet balances, KYC, withdrawal times and wagering for 46 casinos, each figure with its source.",
  "/casinos/",
  { image: "/wp-content/uploads/2025/07/22.png" }
);

const BEST = [
  { slug: "roobet", logo: "/wp-content/uploads/2025/07/roobet-logo.png", line: "High-ranking platform offering unique house games." },
  { slug: "razed", logo: "/wp-content/uploads/2025/07/images.jpeg", line: "Highest RTP, widest game variety, and unmatched monthly rewards." },
  { slug: "stake", logo: "/wp-content/uploads/2025/07/Untitled-design-79.png", line: "Top-tier crypto casino with strong community backing." },
];

const FEATURED = [
  { slug: "roobet", name: "Roobet", logo: "/wp-content/uploads/2025/07/roobet-logo.png" },
  { slug: "razed", name: "Razed", logo: "/wp-content/uploads/2025/07/images.jpeg" },
  { slug: "stake", name: "Stake", logo: "/wp-content/uploads/2025/07/Untitled-design-79.png" },
  { slug: "shuffle", name: "Shuffle", logo: "/wp-content/uploads/2025/07/0x0.png" },
  { slug: "rainbet", name: "Rainbet", logo: "/wp-content/uploads/2025/07/0x0-1.png" },
  { slug: "jackbit", name: "Jackbit", logo: "/wp-content/uploads/2025/07/0x0-2.png" },
  { slug: "betpanda", name: "Betpanda", logo: "/wp-content/uploads/2025/07/0x0-3.png" },
  { slug: "playbet", name: "Playbet", logo: "/wp-content/uploads/2025/07/0x0-4.png" },
];

const NO_KYC = ["razed", "shuffle", "rainbet"];

export default function CasinosPage() {
  const s = heroStats();
  const rows = directoryRows();
  const lb = leaderboards(50);
  const h2h = headToHead(BEST.map((b) => b.slug)).map((c, i) => ({ ...c, logo: BEST[i].logo, line: BEST[i].line }));
  const ld = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Crypto casinos tracked by Crypto Casino Stats",
    numberOfItems: rows.length,
    itemListElement: rows.map((r, i) => ({ "@type": "ListItem", position: i + 1, name: r.name, url: `${SITE_URL}${r.path}` })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <PageHero
        eyebrow={`${rows.length} casinos · data as of ${fmtDate(s.updated)}`}
        title="Top Crypto Casinos"
        lede="Discover the best crypto casinos for higher RTPs, no KYC, and next-gen slot rewards, with the numbers behind them: deposit volume, wallet balances and the RTP each casino runs."
        stats={[
          { value: String(rows.length), label: "Casinos tracked", foot: "Every one has its own stats page", href: "#all-casinos" },
          { value: s.deposits.value, label: "30-day on-chain deposits", foot: `${s.deposits.casinos} casinos, each its trailing 30 days as read on ${fmtDate(s.run)} (FairGambling)${s.deposits.stale ? `; ${s.deposits.stale} older figures left out` : ""}`, href: "#volume" },
          { value: sourcedFactCount().toLocaleString("en-US"), label: "Casino facts with a source", foot: "Each linked to the casino's own page and dated", href: "/methodology/" },
        ]}
        primary={{ href: "#all-casinos", label: `Browse all ${rows.length} casinos →` }}
        secondary={{ href: "#volume", label: "See the deposit leaderboard" }}
      />

      <Section id="comparison" eyebrow="Best rated casinos" title="Roobet, Razed and Stake, side by side" lede="The three casinos we cover in depth, compared on the same sourced numbers.">
        <HeadToHead cols={h2h} />
      </Section>

      <Section id="all-casinos" eyebrow="The directory" title="Every casino we track" lede="Search, filter by what matters to you, or sort by the numbers. KYC, withdrawal and wagering are each casino's own published terms; withdrawal times are what the casino states, not timed tests." className="bg-section">
        <Directory rows={rows} />
      </Section>

      <Section id="volume" eyebrow="On-chain deposit volume" title="All tracked casinos, ranked" lede="Third-party attribution of 30-day deposits and hot-wallet balances, as each tracker published them." action={<Link href="/methodology/" className="ccs-btn-ghost">How to read these</Link>}>
        <Leaderboard deposits={lb.deposits} wallet={lb.wallet} depositsOther={lb.depositsOther} walletOther={lb.walletOther} asOf={lb.asOf} />
      </Section>

      <section className="bg-section py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 lg:grid-cols-2">
          <div className="ccs-card p-6 sm:p-8">
            <p className="ccs-eyebrow">Privacy first</p>
            <h2 className="ccs-display mt-3 text-3xl">No KYC Crypto Casinos</h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {NO_KYC.map((slug) => (
                <Link key={slug} href={casinoPath(slug)} className="rounded-full border border-border-strong bg-page px-4 py-2 font-semibold text-text-primary hover:border-accent hover:text-accent">
                  {getCasino(slug)?.name}
                </Link>
              ))}
            </div>
            <h3 className="mt-8 text-lg font-semibold text-text-primary">Why No-KYC Casinos?</h3>
            <p className="mt-2 text-text-secondary">
              No-KYC crypto casinos let you play without uploading personal documents, giving you faster access, more privacy, and a smoother signup process.
              These platforms often accept wallets like MetaMask and prioritize user anonymity without sacrificing gameplay quality.
            </p>
            <p className="mt-4 text-xs text-text-dim">Each casino&apos;s own KYC wording is on its stats page, with the source. Use the directory&apos;s &ldquo;No routine KYC&rdquo; filter to see every casino whose policy says it only asks in specific cases.</p>
          </div>
          <div className="ccs-card p-6 sm:p-8">
            <p className="ccs-eyebrow">Featured casinos</p>
            <div className="mt-5 grid grid-cols-4 gap-3">
              {FEATURED.map((f) => {
                const inner = (
                  <>
                    <Image src={f.logo} alt={`${f.name} logo`} width={72} height={72} className="aspect-square w-full rounded-xl object-cover" />
                    <span className="mt-1.5 block truncate text-center text-xs font-semibold text-text-secondary">{f.name}</span>
                  </>
                );
                const cls = "ccs-lift block min-w-0 rounded-xl p-1";
                return getCasino(f.slug) ? (
                  <Link key={f.slug} href={casinoPath(f.slug)} className={cls}>{inner}</Link>
                ) : hasLink(f.slug) ? (
                  <a key={f.slug} href={`${goPath(f.slug)}?p=featured`} rel="nofollow sponsored" className={cls}>{inner}</a>
                ) : (
                  <div key={f.slug} className={cls}>{inner}</div>
                );
              })}
            </div>
            <p className="mt-6 text-sm text-text-muted">We’re actively researching and updating data for more platforms. If your go-to crypto casino isn’t featured yet, chances are it’s coming soon.</p>
          </div>
        </div>
      </section>

      <Section eyebrow="Where to play" title="Partner casinos worth a look" lede="Picked for fast stated withdrawals and light wagering, with their numbers.">
        <PartnerCards cards={partnerCards({ seed: "casinos" })} placement="casinos-partners" />
      </Section>
    </>
  );
}
