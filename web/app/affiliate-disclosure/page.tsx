import Link from "next/link";
import { pageMeta } from "@/lib/site";
import { DocLayout } from "@/components/doc/DocLayout";

export const metadata = pageMeta("Affiliate disclosure", "How Crypto Casino Stats makes money, and how that is kept apart from the data it publishes.", "/affiliate-disclosure/");

export default function Page() {
  return (
    <DocLayout
      eyebrow={<span>Disclosure</span>}
      title="Affiliate disclosure"
      lede="How this site makes money, and the rules that keep that apart from the numbers."
      heroExtra={
        <div className="mt-8 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            ["Free to you", "Signing up through our links costs you nothing extra."],
            ["Labelled", "Every partner placement is marked as an ad."],
            ["Never in the data", "Commission never changes a figure or a ranking by a number."],
          ].map(([t, d]) => (
            <div key={t} className="ccs-card p-4">
              <p className="font-semibold text-text-primary">{t}</p>
              <p className="mt-1 text-sm text-text-muted">{d}</p>
            </div>
          ))}
        </div>
      }
      sections={[
        {
          id: "how",
          title: "How we make money",
          body: <p>Some links on this site are affiliate links: if you sign up at a casino through one, the casino may pay us a commission. It costs you nothing extra.</p>,
        },
        {
          id: "data",
          title: "What commission never touches",
          body: (
            <p>
              Commission never changes a figure. Deposit volumes, wallet balances, RTP readings and slot data are shown as their sources published them or
              as we read them, whether or not we work with the casino. Any list sorted by a number (deposits, withdrawal time, KYC) is sorted by that
              number alone.
            </p>
          ),
        },
        {
          id: "placements",
          title: "Partner placements",
          body: (
            <p>
              Boxes headed &ldquo;Where to play&rdquo;, &ldquo;Alternatives&rdquo; or &ldquo;Partner casinos&rdquo;, cards marked &ldquo;Partner&rdquo;, and
              the directory&apos;s &ldquo;Featured&rdquo; order are advertising and are labelled as such. Their order reflects our commercial relationships
              and how well each casino fits the page. See the <Link href="/methodology/">methodology</Link> for how every figure is sourced.
            </p>
          ),
        },
      ]}
    />
  );
}
