import Image from "next/image";
import Link from "next/link";
import { Container, Hero, H2, TableWrap, th, td } from "@/components/ui";
import { PartnerList } from "@/components/PartnerList";
import { pageMeta, fmtDate } from "@/lib/site";
import { getGame, fmtRtp, fmtX, allReadings, CATALOGUE_AS_OF } from "@/lib/slots";
import watchOps from "@/data/watchOps.json";
import { CASINO_PAGES } from "@/lib/outbound";

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

function SlotList({ slugs }: { slugs: string[] }) {
  return (
    <TableWrap>
      <thead>
        <tr>
          <th className={th}>Slot</th>
          <th className={th}>Provider</th>
          <th className={th}>Provider RTP</th>
          <th className={th}>Max win</th>
          <th className={th}>Volatility</th>
        </tr>
      </thead>
      <tbody>
        {slugs.map((s) => {
          const g = getGame(s);
          return (
            <tr key={s}>
              <td className={`${td} font-medium text-text-primary`}>{g?.name ?? s}</td>
              <td className={td}>{g?.provider ?? "—"}</td>
              <td className={td}>{fmtRtp(g?.rtp)}</td>
              <td className={td}>{fmtX(g?.maxWinMultiplier)}</td>
              <td className={`${td} capitalize`}>{g?.volatility ?? "—"}</td>
            </tr>
          );
        })}
      </tbody>
    </TableWrap>
  );
}

export default function TopSlotsPage() {
  const readings = allReadings();
  const slotSlugs = [...new Set(readings.map((r) => r.slotSlug))];
  const casinos = (watchOps as { slug: string; name: string }[]).filter((o) => readings.some((r) => r.operatorSlug === o.slug));
  const lastRead = readings.map((r) => r.checkedAt).sort().at(-1) ?? "";
  const ld = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "RTP by crypto casino",
    description: "The RTP each crypto casino displays for its own copy of popular slots, read on the casino's game page or in-game paytable, with dates.",
    url: "https://cryptocasinostats.com/top-slots/#rtp-by-casino",
    creator: { "@type": "Organization", name: "Crypto Casino Stats" },
    dateModified: lastRead,
    variableMeasured: "Return to player (%)",
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Hero
        title="Top Slots Worth Your Spin"
        lede="Looking for the most rewarding slots in crypto casinos? We’ve handpicked the highest RTP, most volatile, and community-favorite games available today, with each studio's published numbers and the RTP each casino actually runs, especially on platforms like Razed, Roobet and Stake."
      />
      <Container>
        <H2>Top RTP Slots</H2>
        <div className="grid gap-4 sm:grid-cols-3">
          {TOP_RTP.map((s) => {
            const g = getGame(s);
            return (
              <div key={s} className="rounded-[14px] border border-border bg-surface p-5">
                <h3 className="text-lg font-semibold">{g?.name}</h3>
                <p className="mt-2 text-sm text-text-secondary">RTP: {fmtRtp(g?.rtp)} <span className="text-text-dim">(provider)</span></p>
                <p className="text-sm text-text-secondary">Max Win: {fmtX(g?.maxWinMultiplier)}</p>
              </div>
            );
          })}
        </div>

        <H2 id="rtp-by-casino">RTP by casino</H2>
        <p className="mb-4 max-w-3xl text-sm text-text-muted">
          The same slot can run at a different RTP from one casino to the next. Each cell is the RTP that casino showed for its own copy of the game,
          read on its game page or in the in-game paytable on {fmtDate(lastRead)}. A dash means we have not read it there.
        </p>
        <TableWrap>
          <thead>
            <tr>
              <th className={th}>Slot</th>
              <th className={th}>Provider RTP</th>
              {casinos.map((c) => (
                <th key={c.slug} className={th}>
                  {CASINO_PAGES[c.slug] ? <Link href={CASINO_PAGES[c.slug]} className="hover:text-text-primary">{c.name}</Link> : c.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slotSlugs.map((s) => {
              const g = getGame(s);
              return (
                <tr key={s}>
                  <td className={`${td} font-medium text-text-primary`}>{g?.name ?? s}</td>
                  <td className={td}>{fmtRtp(g?.rtp)}</td>
                  {casinos.map((c) => {
                    const r = readings.find((x) => x.slotSlug === s && x.operatorSlug === c.slug);
                    return (
                      <td key={c.slug} className={td}>
                        {r ? <span className={r.rtp < (g?.rtp ?? r.rtp) - 0.1 ? "font-semibold text-warning" : "text-text-primary"}>{fmtRtp(r.rtp)}</span> : "—"}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </TableWrap>

        <H2>Slots Across Crypto Casino</H2>
        <h3 className="mb-3 mt-6 text-lg font-semibold">Top Community Slot Picks</h3>
        <SlotList slugs={COMMUNITY} />
        <h3 className="mb-3 mt-8 text-lg font-semibold">Top Paying Slots This Month</h3>
        <p className="mb-3 text-sm text-text-muted">The biggest maximum wins among recent releases.</p>
        <SlotList slugs={PAYING} />
        <h3 className="mb-3 mt-8 text-lg font-semibold">Top Volatile Games</h3>
        <TableWrap caption="Volatility as described by the studio; the catalogue rating is shown alongside.">
          <thead>
            <tr>
              <th className={th}>Slot Title</th>
              <th className={th}>Volatility</th>
              <th className={th}>Provider</th>
              <th className={th}>Max win</th>
            </tr>
          </thead>
          <tbody>
            {VOLATILE.map(([s, v]) => {
              const g = getGame(s);
              return (
                <tr key={s}>
                  <td className={`${td} font-medium text-text-primary`}>{g?.name ?? s}</td>
                  <td className={td}>{v}</td>
                  <td className={td}>{g?.provider ?? "—"}</td>
                  <td className={td}>{fmtX(g?.maxWinMultiplier)}</td>
                </tr>
              );
            })}
          </tbody>
        </TableWrap>

        <H2>Highest RTP Games</H2>
        <div className="flex snap-x gap-3 overflow-x-auto pb-2">
          {BANNERS.map((b) => (
            <Image key={b} src={up(b)} alt="" width={420} height={236} className="h-auto w-72 shrink-0 snap-start rounded-xl" />
          ))}
        </div>

        <H2>Featured Slots</H2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {FEATURED.map(([s, img]) => {
            const g = getGame(s);
            return (
              <div key={s} className="overflow-hidden rounded-[14px] border border-border bg-surface">
                <Image src={up(img)} alt={g?.name ?? s} width={300} height={300} className="aspect-square w-full object-cover" />
                <div className="p-3">
                  <h3 className="text-sm font-semibold">{g?.name ?? s}</h3>
                  <p className="text-xs text-text-muted">
                    {fmtRtp(g?.rtp)} RTP, {fmtX(g?.maxWinMultiplier)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-xs text-text-dim">
          Provider RTP, volatility and max win from the slotessentials.com game catalogue (export of {fmtDate(CATALOGUE_AS_OF)}). Casino RTP readings
          are read by our team on each casino&apos;s game page or paytable.
        </p>

        <PartnerList seed="top-slots" context={{ kind: "slots" }} />
      </Container>
    </>
  );
}
