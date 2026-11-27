import Link from "next/link";
import { pageMeta } from "@/lib/site";
import { heroStats, leaderboards, finderCasinos, rtpSlots, sourcedFactCount, featured } from "@/lib/home-data";
import { articles } from "@/lib/posts";
import { StatHero } from "@/components/home/StatHero";
import { SourceStrip } from "@/components/home/SourceStrip";
import { Section } from "@/components/home/Section";
import { Leaderboard } from "@/components/home/Leaderboard";
import { CasinoFinder } from "@/components/home/CasinoFinder";
import { RtpPanel } from "@/components/home/RtpPanel";
import { Featured } from "@/components/home/Featured";
import { TrustSteps } from "@/components/home/TrustSteps";
import { Articles } from "@/components/home/Articles";
import { StickyBar } from "@/components/home/StickyBar";
import { WeekBand } from "@/components/home/WeekBand";
import { latestReport } from "@/lib/history";
import { rtpStatus } from "@/lib/slots";
import { SITE_URL } from "@/lib/site";

export const metadata = pageMeta(
  "Crypto Casino Stats: deposit volumes, wallets and RTP data",
  "Where crypto casino money actually goes: on-chain deposits, hot-wallet balances and the RTP each casino runs, for 46 casinos, every figure sourced.",
  "/"
);

const FAQ: [string, string][] = [
  ["What is RTP?", "RTP, or Return to Player, is the share of all money wagered on a game that it pays back over a very long run. A slot with a 96% RTP theoretically returns $96 for every $100 wagered across millions of spins. It says nothing about a single session."],
  ["Why can the same slot have a different RTP at different casinos?", "Studios often release a game in several RTP versions and each casino chooses which one to run. That is why we show the RTP a casino actually displays for its own copy, with the date we read it, next to the studio's published figure."],
  ["What does on-chain deposit volume tell me?", "How much crypto flowed into wallets a tracker attributes to a casino over 30 days. It is a signal of size and activity, not profit, and not the amount wagered, since the same money can be bet many times."],
  ["Is a big hot-wallet balance a sign a casino is safe?", "Not on its own. A hot wallet is what a casino keeps on hand for withdrawals at one moment; most also hold funds in cold storage that trackers cannot see."],
  ["What is session volatility?", "How a slot spreads its returns. High-volatility games pay big wins rarely; low-volatility games pay small wins often. Two slots with the same RTP can feel completely different."],
  ["How do you make money?", "Some casino links are affiliate links and pay us a commission if you sign up. That never changes a figure; partner placements are labelled."],
];

export default function Home() {
  const s = heroStats();
  const lb = leaderboards();
  const casinos = finderCasinos();
  const facts = sourcedFactCount();
  const week = latestReport();
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Crypto casino 30-day on-chain deposit volume",
      description: "Third-party attribution of 30-day on-chain deposit volume and hot-wallet balances to crypto casinos, with the source and date of each figure.",
      url: `${SITE_URL}/#leaderboard`,
      creator: { "@type": "Organization", name: "Crypto Casino Stats" },
      dateModified: s.updated,
      variableMeasured: ["30-day deposit volume (USD)", "Hot-wallet balance (USD)"],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <StatHero s={s} />
      <SourceStrip />

      <Section
        id="leaderboard"
        eyebrow="The leaderboard"
        title="Who takes the most deposits"
        lede="Ranked by 30-day on-chain deposits. Switch to hot-wallet balance to see what each casino keeps on hand."
        action={<Link href="/casinos/#volume" className="ccs-btn-ghost">All {s.deposits.casinos} casinos</Link>}
      >
        <Leaderboard deposits={lb.deposits} wallet={lb.wallet} depositsOther={lb.depositsOther} walletOther={lb.walletOther} asOf={lb.asOf} />
      </Section>

      {week && <WeekBand r={week} />}

      <Section id="finder" eyebrow="Casino finder" title="Find a casino that fits" lede="Filter by what matters to you. Every attribute comes from the casino's own published terms." className="bg-section">
        <CasinoFinder casinos={casinos} />
      </Section>

      <section className="scroll-mt-20 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <RtpPanel slots={rtpSlots()} overdue={rtpStatus().overdue} />
        </div>
      </section>

      <Section eyebrow="Casino reports" title="The casinos we cover in depth" lede="Full stats pages with on-chain activity, slot RTPs and terms." className="bg-section">
        <Featured items={featured()} />
      </Section>

      <Section eyebrow="How we source" title="Every number, checkable." lede="We only publish what someone else can verify, and we say when we last looked.">
        <TrustSteps facts={facts} casinos={s.casinosTracked} />
      </Section>

      <Section
        eyebrow="Analysis"
        title="Reading the numbers"
        action={<Link href="/category/uncategorized/" className="ccs-btn-ghost">All analysis</Link>}
        className="bg-section"
      >
        <Articles posts={articles()} />
      </Section>

      <Section eyebrow="Questions" title="Stat tracking, explained">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {FAQ.map(([q, a], i) => (
            <details key={q} open={i < 2} className="ccs-card group min-w-0 p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold text-text-primary">
                {q}
                <span aria-hidden className="mt-0.5 text-accent transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{a}</p>
            </details>
          ))}
        </div>
      </Section>

      <StickyBar />
    </>
  );
}
