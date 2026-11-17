import Link from "next/link";
import { Container } from "@/components/ui";
import { pageMeta, fmtDate } from "@/lib/site";
import { earliestAsOf, latestAsOf } from "@/lib/volume";
import { CATALOGUE_AS_OF, allReadings } from "@/lib/slots";

export const metadata = pageMeta(
  "Methodology and sources",
  "Where every figure on Crypto Casino Stats comes from: on-chain deposit volume, wallet balances, casino RTP readings and slot data, and their limits.",
  "/methodology/"
);

export default function Page() {
  const lastRead = allReadings().map((r) => r.checkedAt).sort().at(-1) ?? "";
  return (
    <Container className="max-w-3xl py-10">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Methodology and sources</h1>
      <div className="prose-ccs mt-6">
        <p>
          We only publish a figure when it has a source someone else can check. Every number on the site is shown with where it came from and the date
          it was read. If we cannot source a number, we leave the cell empty rather than estimate it.
        </p>

        <h2>On-chain deposit volume and hot-wallet balances</h2>
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
        <p>Figures on file currently run from {fmtDate(earliestAsOf())} to {fmtDate(latestAsOf())}. They are refreshed weekly.</p>

        <h2>RTP at each casino</h2>
        <p>
          Studios often release a slot in several RTP versions, and each casino chooses which one to run. A casino RTP reading is the RTP that casino
          shows for its own copy of the game, read by our team on the casino&apos;s game page or in the in-game paytable, with the date. Readings are
          re-checked monthly; the latest were taken on {fmtDate(lastRead)}.
        </p>
        <p>
          We do not publish an RTP above 100%. RTP is a game&apos;s long-run theoretical return: almost always below 100%, and exactly 100% only
          for the rare zero-edge game a casino says it runs. A session or tracker that returned more than was staked describes luck in a sample,
          not the game.
        </p>

        <h2>Slot data</h2>
        <p>
          Provider RTP, volatility, maximum win and release dates come from each studio&apos;s published game information, via the slotessentials.com
          game catalogue (current export: {fmtDate(CATALOGUE_AS_OF)}).
        </p>

        <h2>Casino facts</h2>
        <p>Coins, limits, fees and licence details on casino pages are read from each casino&apos;s own published pages, linked next to the fact with the date read.</p>

        <h2>What we do not do</h2>
        <p>
          We do not describe any casino as rigged or a scam, and we do not rank casinos by anything we cannot show. Where casinos appear in an
          advertised order (&ldquo;Where to play&rdquo; boxes), that order is commercial and is labelled as an ad; it never changes a figure. See our{" "}
          <Link href="/affiliate-disclosure/">affiliate disclosure</Link>.
        </p>
        <p>Spotted a wrong number? Tell us with the source and we will correct it and note the change.</p>
      </div>
    </Container>
  );
}
