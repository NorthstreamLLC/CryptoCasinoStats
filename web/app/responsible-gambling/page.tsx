import { Container } from "@/components/ui";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta("Responsible gambling", "Gambling is for adults and for entertainment. Where to get help, and how to keep control.", "/responsible-gambling/");

export default function Page() {
  return (
    <Container className="max-w-3xl py-10">
      <h1 className="text-3xl font-bold tracking-tight">Responsible gambling</h1>
      <div className="prose-ccs mt-6">
        <p>
          Gambling is for adults (18+, or older where local law requires) and should be entertainment, not a way to make money. No statistic on this
          site, including RTP, predicts what will happen in your session: every game has a house edge, and over time the house wins.
        </p>
        <h2>Keep control</h2>
        <ul>
          <li>Set a budget before you play and treat it as spent.</li>
          <li>Set time limits, and use the deposit limits, cool-off and self-exclusion tools casinos offer.</li>
          <li>Never chase losses, and never gamble with money you need or have borrowed.</li>
        </ul>
        <h2>Get help</h2>
        <ul>
          <li><a href="https://www.begambleaware.org/" rel="noopener">BeGambleAware</a> (UK): free, confidential support.</li>
          <li><a href="https://www.ncpgambling.org/help-treatment/" rel="noopener">National Council on Problem Gambling</a> (US): call or text 1-800-GAMBLER.</li>
          <li><a href="https://www.gamblingtherapy.org/" rel="noopener">Gambling Therapy</a>: free support worldwide, in several languages.</li>
          <li><a href="https://www.gamban.com/" rel="noopener">Gamban</a>: software that blocks gambling sites and apps on your devices.</li>
        </ul>
      </div>
    </Container>
  );
}
