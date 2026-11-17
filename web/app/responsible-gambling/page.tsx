import { pageMeta } from "@/lib/site";
import { DocLayout } from "@/components/doc/DocLayout";

export const metadata = pageMeta("Responsible gambling", "Gambling is for adults and for entertainment. Where to get help, and how to keep control.", "/responsible-gambling/");

const HELP = [
  ["BeGambleAware", "UK", "Free, confidential support.", "https://www.begambleaware.org/"],
  ["National Council on Problem Gambling", "US", "Call or text 1-800-GAMBLER.", "https://www.ncpgambling.org/help-treatment/"],
  ["Gambling Therapy", "Worldwide", "Free support in several languages.", "https://www.gamblingtherapy.org/"],
  ["Gamban", "Any device", "Blocks gambling sites and apps.", "https://www.gamban.com/"],
];

export default function Page() {
  return (
    <DocLayout
      eyebrow={<span>18+ · Play safe</span>}
      title="Responsible gambling"
      lede="Gambling is for adults (18+, or older where local law requires) and should be entertainment, not a way to make money."
      heroExtra={
        <div className="mt-8 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {HELP.map(([n, where, d, href]) => (
            <a key={n} href={href} target="_blank" rel="noopener noreferrer" className="ccs-card ccs-lift block p-4">
              <p className="ccs-eyebrow">{where}</p>
              <p className="mt-2 font-semibold text-text-primary">{n} ↗</p>
              <p className="mt-1 text-sm text-text-muted">{d}</p>
            </a>
          ))}
        </div>
      }
      sections={[
        {
          id: "odds",
          title: "No number predicts a session",
          body: <p>No statistic on this site, including RTP, predicts what will happen in your session: every game has a house edge, and over time the house wins.</p>,
        },
        {
          id: "control",
          title: "Keep control",
          body: (
            <ul>
              <li>Set a budget before you play and treat it as spent.</li>
              <li>Set time limits, and use the deposit limits, cool-off and self-exclusion tools casinos offer.</li>
              <li>Never chase losses, and never gamble with money you need or have borrowed.</li>
            </ul>
          ),
        },
        {
          id: "help",
          title: "Get help",
          body: (
            <ul>
              {HELP.map(([n, where, d, href]) => (
                <li key={n}>
                  <a href={href} rel="noopener">{n}</a> ({where}): {d}
                </li>
              ))}
            </ul>
          ),
        },
      ]}
    />
  );
}
