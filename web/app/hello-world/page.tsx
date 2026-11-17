import Link from "next/link";
import { Container } from "@/components/ui";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta("Hello world!", "Welcome to Crypto Casino Stats: what we track and where to start.", "/hello-world/", { noindex: true });

export default function Page() {
  return (
    <Container className="max-w-3xl py-10">
      <h1 className="text-3xl font-bold tracking-tight">Hello world!</h1>
      <div className="prose-ccs mt-6">
        <p>Welcome to Crypto Casino Stats. This was the site&apos;s first post; the site now tracks:</p>
        <ul>
          <li><Link href="/casinos/">on-chain deposit volume and hot-wallet balances</Link> for crypto casinos, each figure with its source and date;</li>
          <li><Link href="/top-slots/">the RTP each casino shows</Link> for popular slots, next to the studio&apos;s published figure;</li>
          <li>casino reports for <Link href="/roobet/">Roobet</Link>, <Link href="/stake/">Stake</Link> and <Link href="/razed/">Razed</Link>.</li>
        </ul>
        <p>How we collect and check it is on the <Link href="/methodology/">methodology page</Link>.</p>
      </div>
    </Container>
  );
}
