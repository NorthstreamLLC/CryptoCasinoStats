import Image from "next/image";
import Link from "next/link";
import { Container, H2, TableWrap, th, td, Cite } from "@/components/ui";
import { PartnerList } from "@/components/PartnerList";
import { pageMeta, fmtDate } from "@/lib/site";
import { volumeTable, latestAsOf } from "@/lib/volume";
import { allReadings, getGame, fmtRtp } from "@/lib/slots";
import { goPath, hasLink, CASINO_PAGES } from "@/lib/outbound";
import posts from "@/data/ccs/posts.json";

export const metadata = pageMeta(
  "Crypto Casino Stats: deposit volumes, wallets and RTP data",
  "Key stats for top crypto casinos: on-chain deposit volume, hot-wallet balances and the RTP each casino runs, every figure with its source and date.",
  "/"
);

const CASINOS = [
  { slug: "razed", name: "Razed", logo: "/wp-content/uploads/2025/07/images.jpeg" },
  { slug: "stake", name: "Stake", logo: "/wp-content/uploads/2025/07/Untitled-design-79.png" },
  { slug: "roobet", name: "Roobet", logo: "/wp-content/uploads/2025/07/roobet-logo.png" },
];
const BANNERS = ["gamba_daily_562.png", "gamba_daily_563.png", "gamba_daily_571.png", "gamba_daily_572.png", "gamba_daily_573-1.png", "gamba_daily_575.png"];

const FAQ: [string, string][] = [
  ["What is RTP?", "RTP, or Return to Player, is a critical metric in slot games that indicates the percentage of wagered money returned to players over time. For example, a slot with an RTP of 96% theoretically pays back $96 for every $100 wagered."],
  ["What are High RTP Slots?", "These slots offer better long-term returns, reducing the house edge. Example: the RTP (Return to Player) for Wanted Dead or a Wild by Hacksaw Gaming is 96.38%, which is considered competitive in the slot gaming world."],
  ["What are Bonus Features?", "Bonus Features include exciting add-ons like “DuelReels,” where VS symbols expand to cover entire reels and apply multipliers ranging from 2x to 100x. These features significantly enhance the potential for big wins."],
  ["What is Session Volatility?", "Session volatility in online slots refers to the level of risk and reward during a single gaming session. It determines how often you win and the size of those wins. High volatility slots offer larger payouts but less frequent wins; low volatility slots provide smaller, more frequent wins; medium volatility sits between the two."],
  ["Why can the same slot have a different RTP at different casinos?", "Studios often release a game in several RTP versions and each casino chooses which one to run. That is why we list the RTP a casino actually shows for its own copy of a game, with the date we read it, next to the studio's published default."],
];

export default function Home() {
  const top = volumeTable().slice(0, 8);
  const readings = allReadings();
  const lastRead = readings.map((r) => r.checkedAt).sort().at(-1) ?? "";
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <section className="border-b border-border bg-surface-hero/40">
        <Container className="grid items-center gap-8 py-12 sm:py-16 lg:grid-cols-[1fr_auto]">
          <div>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">Track Key Stats Across Top Crypto Casinos</h1>
            <p className="mt-4 max-w-2xl text-lg text-text-secondary">
              A data-driven hub for crypto casino deposit volumes, wallet balances, the RTP each casino runs, and slot stats. Every figure shows where it
              came from and when.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/casinos/" className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-page shadow-[var(--shadow-cta)] hover:bg-accent-bright">Casino stats</Link>
              <Link href="/top-slots/" className="rounded-lg border border-border-strong px-5 py-2.5 text-sm font-semibold hover:bg-row-hover">Slot stats</Link>
            </div>
          </div>
          <Image src="/wp-content/uploads/2025/07/22.png" alt="" width={220} height={220} priority className="hidden rounded-2xl lg:block" />
        </Container>
      </section>

      <Container>
        <H2>Why Use Crypto Casino Stats</H2>
        <p className="max-w-3xl text-text-secondary">
          We pull together the numbers that are actually checkable: how much is deposited at each casino on-chain, how much it holds in its hot
          wallets, the RTP each casino shows for popular slots, and each studio&apos;s published RTP, volatility and max win. No number goes up
          without its source.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            ["Detailed Casino Reports", "Deposit volume, wallets, RTP readings and facts for each casino.", "/casinos/"],
            ["Detailed Game Reports", "Provider RTP, volatility, max win, and the RTP by casino.", "/top-slots/"],
            ["Tools For Personal Stat Tracking", "How to track your own sessions, and which numbers matter.", "/how-to-analyze-casino-stats/"],
          ].map(([t, d, h]) => (
            <Link key={t} href={h} className="rounded-[14px] border border-border bg-surface p-5 hover:bg-row-hover">
              <h3 className="font-semibold">{t}</h3>
              <p className="mt-1 text-sm text-text-muted">{d}</p>
            </Link>
          ))}
        </div>

        <H2 id="deposit-volume">Biggest crypto casinos by on-chain deposits</H2>
        <TableWrap caption={<>Third-party on-chain attribution, latest figures as of {fmtDate(latestAsOf())}. Full table on <Link href="/casinos/#volume" className="underline">Casino Stats</Link>.</>}>
          <thead>
            <tr>
              <th className={th}>#</th>
              <th className={th}>Casino</th>
              <th className={th}>30-day deposit volume</th>
              <th className={th}>Hot-wallet balance</th>
            </tr>
          </thead>
          <tbody>
            {top.map((r, i) => {
              const d = r.deposits.find((x) => x.source === "FairGambling") ?? r.deposits[0];
              const w = r.wallet[0];
              return (
                <tr key={r.slug}>
                  <td className={`${td} text-text-dim`}>{i + 1}</td>
                  <td className={td}>
                    {CASINO_PAGES[r.slug] ? <Link href={CASINO_PAGES[r.slug]} className="font-medium text-accent hover:underline">{r.name}</Link> : <span className="font-medium text-text-primary">{r.name}</span>}
                  </td>
                  <td className={td}>
                    {d ? <><span className="font-semibold text-text-primary">{d.value}</span> <Cite source={d.source} href={d.sourceUrl} asOf={d.asOf} /></> : "—"}
                  </td>
                  <td className={td}>
                    {w ? <><span className="font-semibold text-text-primary">{w.value}</span> <Cite source={w.source} href={w.sourceUrl} asOf={w.asOf} /></> : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </TableWrap>

        <H2>Highest RTP Games</H2>
        <div className="flex snap-x gap-3 overflow-x-auto pb-2">
          {BANNERS.map((b) => (
            <Link key={b} href="/top-slots/" className="shrink-0 snap-start">
              <Image src={`/wp-content/uploads/2025/07/${b}`} alt="" width={420} height={236} className="h-auto w-72 rounded-xl" />
            </Link>
          ))}
        </div>
        <p className="mt-3 text-sm text-text-muted">
          Latest casino RTP readings ({fmtDate(lastRead)}):{" "}
          {[...new Set(readings.map((r) => r.slotSlug))].slice(0, 4).map((s, i) => (
            <span key={s}>
              {i ? ", " : ""}
              {getGame(s)?.name} {fmtRtp(getGame(s)?.rtp)}
            </span>
          ))}
          . <Link href="/top-slots/" className="text-accent hover:underline">More Stats</Link>
        </p>

        <H2>Casino Reports</H2>
        <div className="grid gap-4 sm:grid-cols-3">
          {CASINOS.map((c) => (
            <div key={c.slug} className="flex items-center gap-4 rounded-[14px] border border-border bg-surface p-4">
              <Image src={c.logo} alt={`${c.name} logo`} width={64} height={64} className="h-14 w-14 rounded-xl object-cover" />
              <div className="flex-1">
                <Link href={CASINO_PAGES[c.slug]} className="font-semibold hover:text-accent">{c.name}</Link>
                <div className="mt-1 flex gap-3 text-xs">
                  <Link href={CASINO_PAGES[c.slug]} className="text-accent hover:underline">Stats</Link>
                  {hasLink(c.slug) && <a href={`${goPath(c.slug)}?p=home-casinos`} rel="nofollow sponsored" className="text-text-secondary hover:text-text-primary">Play</a>}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm">
          <Link href="/casinos/" className="text-accent hover:underline">More Casinos</Link>
        </p>

        <H2>Latest analysis</H2>
        <div className="grid gap-4 sm:grid-cols-3">
          {posts.filter((p) => p.image).map((p) => (
            <Link key={p.slug} href={`/${p.slug}/`} className="overflow-hidden rounded-[14px] border border-border bg-surface hover:bg-row-hover">
              <Image src={p.image!.replace(/\.png$/, "-1024x576.png")} alt="" width={1024} height={576} className="h-auto w-full" />
              <div className="p-4">
                <h3 className="font-semibold">{p.title}</h3>
                <p className="mt-1 text-xs text-text-dim">{fmtDate(p.date)}</p>
              </div>
            </Link>
          ))}
        </div>

        <H2>Stat Tracking Questions?</H2>
        <div className="grid gap-3">
          {FAQ.map(([q, a]) => (
            <details key={q} className="rounded-[14px] border border-border bg-surface p-4">
              <summary className="cursor-pointer font-semibold">{q}</summary>
              <p className="mt-2 text-text-secondary">{a}</p>
            </details>
          ))}
        </div>

        <PartnerList seed="home" />
      </Container>
    </>
  );
}
