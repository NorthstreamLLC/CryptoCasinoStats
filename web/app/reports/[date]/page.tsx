import Link from "next/link";
import { notFound } from "next/navigation";
import { report, reportDates, big, pct } from "@/lib/history";
import { pageMeta, fmtDate, SITE_URL } from "@/lib/site";
import { DocHero } from "@/components/doc/DocHero";
import { ReportView, summary } from "@/components/reports/ReportView";

export const dynamicParams = false;
export function generateStaticParams() {
  return reportDates().map((date) => ({ date }));
}

const title = (d: string) => `Crypto casino deposits report, ${fmtDate(d)}`;

export async function generateMetadata({ params }: { params: Promise<{ date: string }> }) {
  const r = report((await params).date);
  if (!r) return {};
  return pageMeta(title(r.date), summary(r).slice(0, 2).join(" ").slice(0, 158), `/reports/${r.date}/`, { type: "article", published: r.date });
}

export default async function ReportPage({ params }: { params: Promise<{ date: string }> }) {
  const r = report((await params).date);
  if (!r) notFound();
  const dates = reportDates();
  const i = dates.indexOf(r.date);
  const older = dates[i + 1];
  const newer = dates[i - 1];
  const t = r.totals;
  const ld = [
    { "@context": "https://schema.org", "@type": "Article", headline: title(r.date), datePublished: r.date, dateModified: r.date, author: { "@type": "Organization", name: "Crypto Casino Stats" }, publisher: { "@id": `${SITE_URL}/#organization` }, mainEntityOfPage: `${SITE_URL}/reports/${r.date}/` },
    { "@context": "https://schema.org", "@type": "Dataset", name: title(r.date), description: "30-day on-chain deposit volume and hot-wallet balances for crypto casinos, as attributed by FairGambling, with change on the previous reading.", url: `${SITE_URL}/reports/${r.date}/`, dateModified: r.date, creator: { "@type": "Organization", name: "Crypto Casino Stats" }, isBasedOn: "https://www.fairgambling.com/" },
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <DocHero
        eyebrow={
          <>
            <Link href="/reports/" className="text-accent hover:underline">Weekly report</Link>
            <span aria-hidden>·</span>
            <span>FairGambling on-chain data</span>
          </>
        }
        title={title(r.date)}
        lede={r.prevDate ? `Each casino compared with its previous reading. The last saved snapshot was ${fmtDate(r.prevDate)}.` : undefined}
        wide
      >
        <div className="mt-8 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            [big(t.deposits), "30-day deposits", t.prevDeposits ? `${pct(t.deposits / t.prevDeposits - 1)} on previous readings` : ""],
            [r.leader?.now.value ?? "—", `${r.leader?.name ?? ""}, the largest`, r.leader?.change != null ? `${pct(r.leader.change)} on its previous reading` : ""],
            [String(t.comparable), "casinos re-read", `${r.heldBack.length} held back with older figures`],
          ].map(([v, l, f]) => (
            <div key={l} className="ccs-card p-5">
              <p className="ccs-num text-3xl font-semibold text-text-primary">{v}</p>
              <p className="mt-1.5 font-medium text-text-primary">{l}</p>
              {f && <p className="mt-1 text-xs text-text-dim">{f}</p>}
            </div>
          ))}
        </div>
      </DocHero>
      <ReportView r={r} />
      <nav aria-label="Other reports" className="mx-auto flex max-w-6xl justify-between gap-4 px-4 pb-16 text-sm font-semibold">
        {older ? <Link href={`/reports/${older}/`} className="text-accent hover:underline">← {fmtDate(older)}</Link> : <span />}
        <Link href="/reports/" className="text-text-secondary hover:text-text-primary">All reports</Link>
        {newer ? <Link href={`/reports/${newer}/`} className="text-accent hover:underline">{fmtDate(newer)} →</Link> : <span />}
      </nav>
    </>
  );
}
