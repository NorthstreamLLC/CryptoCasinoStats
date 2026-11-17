import Link from "next/link";
import { Container } from "@/components/ui";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta("Affiliate disclosure", "How Crypto Casino Stats makes money, and how that is kept apart from the data it publishes.", "/affiliate-disclosure/");

export default function Page() {
  return (
    <Container className="max-w-3xl py-10">
      <h1 className="text-3xl font-bold tracking-tight">Affiliate disclosure</h1>
      <div className="prose-ccs mt-6">
        <p>
          Some links on this site are affiliate links: if you sign up at a casino through one, the casino may pay us a commission. It costs you
          nothing extra.
        </p>
        <p>
          Commission never changes a figure. Deposit volumes, wallet balances, RTP readings and slot data are shown as their sources published them or
          as we read them, whether or not we work with the casino. Boxes headed &ldquo;Where to play&rdquo; or &ldquo;Other casinos to compare&rdquo;
          are advertising and are labelled as such; their order reflects our commercial relationships and how well each casino fits the page.
        </p>
        <p>
          See the <Link href="/methodology/">methodology</Link> for how every figure is sourced.
        </p>
      </div>
    </Container>
  );
}
