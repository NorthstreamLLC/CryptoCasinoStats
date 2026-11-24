import Image from "next/image";
import Link from "next/link";
import { pageMeta, fmtDate, SITE_URL } from "@/lib/site";
import { slotCard, rtpMatrix, catalogueSize, CATALOGUE_AS_OF } from "@/lib/slot-page";
import { partnerCards } from "@/lib/partners";
import { PageHero } from "@/components/home/PageHero";
import { Section } from "@/components/home/Section";
import { RtpMatrix } from "@/components/slots/RtpMatrix";
import { SlotLists } from "@/components/slots/SlotLists";
import { SlotArt } from "@/components/slots/SlotArt";
import { PartnerCards } from "@/components/PartnerCards";
import { RtpStatusBadge } from "@/components/RtpStatusBadge";
import { rtpStatus } from "@/lib/slots";

export const metadata = pageMeta(
  "Top Slots",
  "Top crypto slots with sourced numbers: published RTP, volatility and max win, and the RTP each casino actually runs for the same game.",
  "/top-slots/",
  { image: "/wp-content/uploads/2025/07/Untitled-design-78.png" }
);

const TOP_RTP = ["gates-of-olympus-1000", "sweet-bonanza-1000", "le-king"];
const COMMUNITY = ["sweet-bonanza", "le-king", "slayers-inc", "spinman", "fruit-party", "chaos-crew", "gates-of-olympus-1000", "5-lions-megaways-2"];
const PAYING = ["fortune-of-aztec", "brute-force-alien-onslaught", "sweet-bonanza-super-scatter"];
const VOLATILE: [string, string][] = [
  ["san-quentin-2-death-row", "Insane High"],
  ["chaos-crew-2", "Extremely High"],
  ["fire-in-the-hole-2-1", "Very High"],
  ["brute-force-alien-onslaught", "Very High"],
  ["wanted-dead-or-a-wild", "High"],
  ["sweet-bonanza-super-scatter", "High"],
  ["mental-1", "Extremely High"],
];
const BANNERS = ["gamba_daily_562.png", "gamba_daily_563.png", "gamba_daily_571.png", "gamba_daily_572.png", "gamba_daily_573-1.png", "gamba_daily_575.png"];
const FEATURED: [string, string][] = [
  ["sweet-bonanza-1000", "Sweet-Bonanza-1000.jpg"],
  ["sugar-rush-1000", "Sugar-Rush-1000.jpg"],
  ["wanted-dead-or-a-wild", "Wanted.jpg"],
  ["chaos-crew-2", "Chaso-Crew-II.jpg"],
  ["san-quentin-2-death-row", "San-Quentin-2.jpg"],
  ["fire-in-the-hole-2-1", "Fire-In-Hole.jpg"],
  ["mental-2", "Mental-2.jpg"],
  ["duck-hunters", "Duck-Hunters.jpg"],
  ["outsourced", "Outsourced.jpg"],
  ["rip-city", "Rip-City.jpg"],
  ["gates-of-olympus", "Gates-Olympus-1.jpg"],
  ["le-king", "Le-King.jpg"],
  ["le-bandit", "Le-Bandit.jpg"],
  ["sweet-bonanza", "Sweet-Bonanza.jpg"],
  ["starlight-princess-1000", "Starlight-princess-1000.jpg"],
];
const up = (f: string) => `/wp-content/uploads/2025/07/${f}`;

const EXPLAIN: [string, string, string][] = [
  ["RTP", "Long-run return", "The share of all money wagered that a game pays back over millions of spins. 96% means $96 back per $100 wagered on average, never per session."],
  ["Volatility", "How it pays", "High volatility pays big wins rarely; low pays small wins often. Two games with the same RTP can feel completely different."],
  ["Max win", "The ceiling", "The largest multiple of your stake the game can pay on one spin or bonus. Rarely hit, and usually only in the bonus round."],
];

export default function TopSlotsPage() {
  const m = rtpMatrix();
  const st = rtpStatus();
  const top = TOP_RTP.map((s) => slotCard(s));
  const ld = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "RTP by crypto casino",
    description: "The RTP each crypto casino displays for its own copy of popular slots, read on the casino's game page or in-game paytable, with dates.",
    url: `${SITE_URL}/top-slots/#rtp-by-casino`,
    creator: { "@type": "Organization", name: "Crypto Casino Stats" },
    dateModified: m.lastRead,
    variableMeasured: "Return to player (%)",
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <PageHero
        eyebrow={`RTP readings ${fmtDate(m.lastRead)} · ${m.casinos.length} casinos`}
        title="Top Slots Worth Your Spin"
        lede="The highest RTP, most volatile, and community-favorite games, with each studio's published numbers and the RTP each casino actually runs, on platforms like Razed, Roobet and Stake."
        stats={[
          { value: catalogueSize().toLocaleString("en-US"), label: "Slots in the catalogue", foot: `Studio-published RTP, volatility and max win, export of ${fmtDate(CATALOGUE_AS_OF)}`, href: "#lists" },
          { value: String(m.total), label: st.overdue ? "Casino RTP readings (historical)" : "Casino RTP readings", foot: `${m.casinos.length} casinos, last read ${fmtDate(st.last)}${st.overdue ? "; monthly re-check overdue" : ""}`, href: "#rtp-by-casino" },
          { value: `${m.matching}/${m.total}`, label: "Match the studio's RTP", foot: "Readings at or above the published figure", href: "#rtp-by-casino" },
        ]}
        primary={{ href: "#rtp-by-casino", label: "See RTP by casino →" }}
        secondary={{ href: "#featured", label: "Browse featured slots" }}
      />

      <Section eyebrow="Top RTP slots" title="Three to start with">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {top.map((s, i) => (
            <article key={s.slug} className={`ccs-card ccs-lift group overflow-hidden ${i === 0 ? "ccs-card-glow" : ""}`}>
              <div className="relative overflow-hidden">
                <SlotArt src={s.art} name={s.name} width={640} className="aspect-[4/3] w-full transition duration-500 group-hover:scale-[1.03]" />
                <span className="ccs-num absolute left-3 top-3 rounded-full bg-page/85 px-2.5 py-1 text-xs font-semibold text-text-primary backdrop-blur">#{i + 1}</span>
              </div>
              <div className="p-5">
                <p className="text-xs text-text-dim">{s.provider}</p>
                <h3 className="ccs-display mt-1 text-2xl">{s.name}</h3>
                <dl className="mt-4 grid grid-cols-3 gap-2 text-sm">
                  {[["RTP", s.rtp], ["Max win", s.maxWin], ["Volatility", s.volatility]].map(([k, v]) => (
                    <div key={k} className="rounded-lg bg-page px-2.5 py-2">
                      <dt className="text-xs text-text-dim">{k}</dt>
                      <dd className="ccs-num mt-0.5 font-semibold capitalize text-text-primary">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section id="rtp-by-casino" eyebrow="RTP by casino" title="Same slot, every casino" lede="Studios release games in several RTP versions and each casino picks one. These are the versions each casino showed us when we last read them; a casino can switch versions, so treat older readings as historical." action={<RtpStatusBadge />} className="bg-section">
        <RtpMatrix m={m} />
      </Section>

      <Section id="lists" eyebrow="Slots across crypto casinos" title="Picks, payers and volatility">
        <SlotLists
          lists={[
            { title: "Top Community Slot Picks", note: "The games players come back to.", rows: COMMUNITY.map((s) => slotCard(s)) },
            { title: "Top Paying Slots This Month", note: "The biggest maximum wins among recent releases.", rows: PAYING.map((s) => slotCard(s)) },
            { title: "Top Volatile Games", note: "Volatility as the studio describes it.", rows: VOLATILE.map(([s, v]) => ({ ...slotCard(s), tag: v })) },
          ]}
        />
      </Section>

      <Section eyebrow="Reading a slot" title="Three numbers, three different questions" className="bg-section">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {EXPLAIN.map(([k, t, d]) => (
            <div key={k} className="ccs-card p-6">
              <p className="ccs-num text-3xl font-semibold text-accent">{k}</p>
              <h3 className="mt-3 font-semibold text-text-primary">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="featured" eyebrow="Highest RTP games" title="Featured Slots" lede="Studio-published RTP and max win for each.">
        <div className="-mx-4 mb-8 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          {BANNERS.map((b) => (
            <Image key={b} src={up(b)} alt="" width={420} height={236} className="h-auto w-64 shrink-0 snap-start rounded-xl sm:w-72" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {FEATURED.map(([s, img]) => {
            const c = slotCard(s, up(img));
            return (
              <article key={s} className="ccs-card ccs-lift group min-w-0 overflow-hidden">
                <div className="overflow-hidden">
                  <Image src={c.art!} alt={c.name} width={300} height={300} className="aspect-square w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                </div>
                <div className="p-3">
                  <h3 className="truncate text-sm font-semibold text-text-primary">{c.name}</h3>
                  <p className="ccs-num mt-1 text-xs text-text-muted">
                    {c.rtp} · {c.maxWin}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
        <p className="mt-6 text-xs text-text-dim">
          Studio RTP, volatility and max win via the slotessentials.com game catalogue (export of {fmtDate(CATALOGUE_AS_OF)}). Casino readings are taken by our team on each casino&apos;s game page or paytable. <Link href="/methodology/" className="underline">Methodology</Link>
        </p>
      </Section>

      <Section eyebrow="Where to play" title="Casinos to play these at" lede="Partner casinos picked for fast stated withdrawals and light wagering, with their numbers." className="bg-section">
        <PartnerCards cards={partnerCards({ seed: "top-slots", context: { kind: "slots" } })} placement="slots-partners" />
      </Section>
    </>
  );
}
