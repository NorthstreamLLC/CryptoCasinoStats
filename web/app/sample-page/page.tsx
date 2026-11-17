import Link from "next/link";
import { pageMeta } from "@/lib/site";
import { DocLayout } from "@/components/doc/DocLayout";

export const metadata = pageMeta("Sample Page", "About Crypto Casino Stats and the data it publishes.", "/sample-page/", { noindex: true });

export default function Page() {
  return (
    <DocLayout
      eyebrow={<span>About</span>}
      title="About Crypto Casino Stats"
      lede="Figures about crypto casinos that anyone can check."
      sections={[
        {
          id: "what",
          title: "What we publish",
          body: (
            <p>
              On-chain deposit volumes and wallet balances attributed by public trackers, the RTP casinos display for their games, and the studios&apos;
              own published slot numbers. Every figure links to where it came from and says when it was read.
            </p>
          ),
        },
        {
          id: "more",
          title: "Read more",
          body: (
            <p>
              Read the <Link href="/methodology/">methodology</Link>, see <Link href="/casinos/">casino stats</Link>, or read our{" "}
              <Link href="/affiliate-disclosure/">affiliate disclosure</Link>.
            </p>
          ),
        },
      ]}
    />
  );
}
