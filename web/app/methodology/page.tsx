import Link from "next/link";
import { pageMeta, fmtDate } from "@/lib/site";
import { earliestAsOf, latestAsOf } from "@/lib/volume";
import { CATALOGUE_AS_OF, allReadings } from "@/lib/slots";
import { sourcedFactCount, heroStats } from "@/lib/home-data";
import { DocLayout } from "@/components/doc/DocLayout";

export const metadata = pageMeta(
  "Methodology and sources",
  "Where every figure on Crypto Casino Stats comes from: on-chain deposit volume, wallet balances, casino RTP readings and slot data, and their limits.",
  "/methodology/"
);

export default function Page() {
  const lastRead = allReadings().map((r) => r.checkedAt).sort().at(-1) ?? "";
  const s = heroStats();
  const SOURCES = [
    ["30-day deposit volume", "FairGambling, Tanzanite", "Third-party wallet attribution", "FairGambling weekly, automatically; Tanzanite by hand"],
    ["Hot-wallet balance", "FairGambling", "Third-party wallet attribution", "Weekly, automatically"],
    ["RTP at a casino", "The casino's game page or in-game paytable", "Read by our team", "Monthly, by hand"],
    ["Slot RTP, volatility, max win", "Studio data via slotessentials.com", "Studio-published", "With each catalogue export"],
    ["KYC, limits, fees, licence", "The casino's own terms and help pages", "Read by our team", "Re-checked periodically"],
  ];
  return (
    <DocLayout
      eyebrow={<span>Methodology · data as of {fmtDate(s.updated)}</span>}
      title="Methodology and sources"
      lede="We only publish a figure when it has a source someone else can check. Every number on the site shows where it came from and the date it was read. If we cannot source a number, we leave the cell empty rather than estimate it."
      heroExtra={
        <div className="mt-8 grid max-w-3xl grid-cols-3 gap-3">
          {[
            [sourcedFactCount().toLocaleString("en-US"), "facts with a source"],
            [String(allReadings().length), "casino RTP readings"],
            ["0", "figures without a source"],
          ].map(([v, l]) => (
            <div key={l} className="ccs-card p-4">
              <p className="ccs-num text-2xl font-semibold text-text-primary sm:text-3xl">{v}</p>
              <p className="mt-1 text-xs text-text-dim">{l}</p>
            </div>
          ))}
        </div>
      }
      aside={
        <div className="ccs-card p-5 text-sm text-text-secondary">
          <p className="font-semibold text-text-primary">Spotted a wrong number?</p>
          <p className="mt-1">Tell us with the source and we will correct it and note the change.</p>
        </div>
      }
      sections={[
        {
          id: "sources",
          title: "Sources at a glance",
          body: (
            <div className="not-prose -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              <table className="w-full min-w-[620px] border-collapse overflow-hidden rounded-[14px] border border-border text-sm">
                <thead>
                  <tr className="bg-surface-raised text-left text-xs uppercase tracking-wide text-text-dim">
                    {["Figure", "Source", "Kind", "Refreshed"].map((h) => (
                      <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SOURCES.map((r) => (
                    <tr key={r[0]} className="border-t border-row-divider bg-surface">
                      <td className="px-4 py-3 font-semibold text-text-primary">{r[0]}</td>
                      <td className="px-4 py-3 text-text-secondary">{r[1]}</td>
                      <td className="px-4 py-3 text-text-secondary">{r[2]}</td>
                      <td className="px-4 py-3 text-text-secondary">{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ),
        },
        {
          id: "on-chain",
          title: "On-chain deposit volume and hot-wallet balances",
          body: (
            <>
              <p>
                Crypto deposits to a casino are public transactions. Two public trackers group wallet addresses they attribute to each casino and publish
                totals: <a href="https://www.fairgambling.com/" rel="nofollow noopener">FairGambling</a> (30-day deposit volume, depositors, hot-wallet
                balance across chains) and <a href="https://www.tanzanite.xyz/centralized/volume" rel="nofollow noopener">Tanzanite</a> (30-day deposit
                volume). We show each platform&apos;s figure as it published it, link the exact page, and give the date.
              </p>
              <ul>
                <li>These are third-party attributions, not our measurements. Grouping wallets is a heuristic: a tracker can miss wallets or include ones that are not the casino&apos;s.</li>
                <li>Deposit volume is money in, not profit, and not the amount wagered: the same funds can be wagered many times.</li>
                <li>A hot-wallet balance is what sits in the casino&apos;s spending wallets at one moment. Casinos also hold funds in cold storage, so it is not a measure of total reserves or solvency.</li>
                <li>The two trackers can disagree for the same casino; we show both rather than pick one.</li>
              </ul>
              <p>Figures on file currently run from {fmtDate(earliestAsOf())} to {fmtDate(latestAsOf())}. FairGambling&apos;s figures are re-read from its public casino pages every Monday; a figure that fails to read, or moves more than tenfold in a week, is held back for a person to check rather than published. Tanzanite&apos;s figures are updated by hand. Totals on the site say which casinos and dates they add up.</p>
            </>
          ),
        },
        {
          id: "rtp",
          title: "RTP at each casino",
          body: (
            <>
              <p>
                Studios often release a slot in several RTP versions, and each casino chooses which one to run. A casino RTP reading is the RTP that casino
                shows for its own copy of the game, read by our team on the casino&apos;s game page or in the in-game paytable, with the date. Readings are
                re-checked monthly; the latest were taken on {fmtDate(lastRead)}. See them all on <Link href="/top-slots/#rtp-by-casino">RTP by casino</Link>.
              </p>
              <p>
                We do not publish an RTP above 100%. RTP is a game&apos;s long-run theoretical return: almost always below 100%, and exactly 100% only
                for the rare zero-edge game a casino says it runs. A session or tracker that returned more than was staked describes luck in a sample,
                not the game.
              </p>
            </>
          ),
        },
        {
          id: "slots",
          title: "Slot data",
          body: (
            <p>
              Provider RTP, volatility, maximum win and release dates come from each studio&apos;s published game information, via the slotessentials.com
              game catalogue (current export: {fmtDate(CATALOGUE_AS_OF)}).
            </p>
          ),
        },
        {
          id: "facts",
          title: "Casino facts",
          body: <p>Coins, limits, fees, KYC policy and licence details on casino pages are read from each casino&apos;s own published pages, summarised, and linked next to the fact with the date read. Follow the link for the casino&apos;s full wording.</p>,
        },
        {
          id: "principles",
          title: "What we do not do",
          body: (
            <>
              <p>
                We do not describe any casino as rigged or a scam, and we do not rank casinos by anything we cannot show. Where casinos appear in an
                advertised order (&ldquo;Where to play&rdquo; boxes and partner cards), that order is commercial and is labelled as an ad; it never changes a figure.
                See our <Link href="/affiliate-disclosure/">affiliate disclosure</Link>.
              </p>
              <p>Spotted a wrong number? Tell us with the source and we will correct it and note the change.</p>
            </>
          ),
        },
      ]}
    />
  );
}
