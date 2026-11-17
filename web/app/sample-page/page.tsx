import Link from "next/link";
import { Container } from "@/components/ui";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta("Sample Page", "About Crypto Casino Stats and the data it publishes.", "/sample-page/", { noindex: true });

export default function Page() {
  return (
    <Container className="max-w-3xl py-10">
      <h1 className="text-3xl font-bold tracking-tight">About Crypto Casino Stats</h1>
      <div className="prose-ccs mt-6">
        <p>
          Crypto Casino Stats publishes figures about crypto casinos that anyone can check: on-chain deposit volumes and wallet balances attributed by
          public trackers, the RTP casinos display for their games, and the studios&apos; own published slot numbers. Every figure links to where it
          came from and says when it was read.
        </p>
        <p>
          Read the <Link href="/methodology/">methodology</Link>, see <Link href="/casinos/">casino stats</Link>, or read our{" "}
          <Link href="/affiliate-disclosure/">affiliate disclosure</Link>.
        </p>
      </div>
    </Container>
  );
}
