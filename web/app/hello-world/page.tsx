import Link from "next/link";
import { pageMeta } from "@/lib/site";
import { DocLayout } from "@/components/doc/DocLayout";

export const metadata = pageMeta("Hello world!", "Welcome to Crypto Casino Stats: what we track and where to start.", "/hello-world/", { noindex: true });

export default function Page() {
  return (
    <DocLayout
      eyebrow={<span>Welcome</span>}
      title="Hello world!"
      lede="Welcome to Crypto Casino Stats. This was the site's first post; here is what it tracks now."
      heroExtra={
        <div className="mt-8 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            ["Casino stats", "On-chain deposits, wallets and terms for 46 casinos", "/casinos/"],
            ["RTP by casino", "The RTP each casino shows for popular slots", "/top-slots/#rtp-by-casino"],
            ["Methodology", "How every figure is sourced", "/methodology/"],
          ].map(([t, d, h]) => (
            <Link key={t} href={h} className="ccs-card ccs-lift block p-4">
              <p className="font-semibold text-text-primary">{t} →</p>
              <p className="mt-1 text-sm text-text-muted">{d}</p>
            </Link>
          ))}
        </div>
      }
      sections={[
        {
          id: "tracks",
          title: "What we track",
          body: (
            <ul>
              <li><Link href="/casinos/">On-chain deposit volume and hot-wallet balances</Link> for crypto casinos, each figure with its source and date.</li>
              <li><Link href="/top-slots/">The RTP each casino shows</Link> for popular slots, next to the studio&apos;s published figure.</li>
              <li>Casino reports for <Link href="/roobet/">Roobet</Link>, <Link href="/stake/">Stake</Link> and <Link href="/razed/">Razed</Link>.</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
