import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, H2, TableWrap, th, td } from "@/components/ui";
import { OnChainPanel } from "@/components/OnChainPanel";
import { CasinoFacts } from "@/components/CasinoFacts";
import { PartnerList } from "@/components/PartnerList";
import { OPS, getCasino, isRootCasino } from "@/lib/casinos";
import { goPath, hasLink } from "@/lib/outbound";
import { readingsFor, getGame, fmtRtp, SOURCE_LABEL } from "@/lib/slots";
import { volumeFor } from "@/lib/volume";
import { pageMeta, fmtDate, SITE_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return OPS.filter((o) => !isRootCasino(o.slug)).map((o) => ({ slug: o.slug }));
}

function describe(slug: string) {
  const o = getCasino(slug)!;
  const v = volumeFor(slug);
  const dep = v?.deposits[0];
  return dep
    ? `${o.name} casino stats: ${dep.value} in 30-day on-chain deposits (${dep.source}), hot-wallet balance, KYC policy, withdrawal times and terms, each with its source.`
    : `${o.name} casino stats: KYC policy, withdrawal times, coins, licence and bonus terms, each taken from ${o.name}'s own pages with the source linked.`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const o = getCasino(slug);
  if (!o) return {};
  return pageMeta(`${o.name} Casino Stats`, describe(slug), `/casinos/${slug}/`);
}

export default async function CasinoPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const o = getCasino(slug);
  if (!o) notFound();
  const readings = readingsFor(slug).sort((a, b) => a.slotSlug.localeCompare(b.slotSlug));
  const ld = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: `${SITE_URL}/casinos/${slug}/`,
    name: `${o.name} Casino Stats`,
    description: describe(slug),
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@type": "Organization", name: o.name },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Casinos", item: `${SITE_URL}/casinos/` },
        { "@type": "ListItem", position: 3, name: o.name },
      ],
    },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="border-b border-border bg-surface-hero/40">
        <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center">
          <div aria-hidden className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-border-strong bg-surface text-2xl font-bold text-accent">
            {o.mono}
          </div>
          <div>
            <nav aria-label="Breadcrumb" className="mb-2 text-xs text-text-dim">
              <Link href="/" className="hover:text-text-primary">Home</Link> / <Link href="/casinos/" className="hover:text-text-primary">Casinos</Link> / {o.name}
            </nav>
            <h1 className="text-4xl font-bold tracking-tight">{o.name} casino stats</h1>
            <p className="mt-2 max-w-2xl text-text-secondary">On-chain activity, verification policy, withdrawals and terms for {o.name}, each figure with its source and date.</p>
            {hasLink(slug) && (
              <a href={`${goPath(slug)}?p=casino-hero`} rel="nofollow sponsored" className="mt-4 inline-flex rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-page shadow-[var(--shadow-cta)] hover:bg-accent-bright">
                Visit {o.name}
              </a>
            )}
          </div>
        </Container>
      </section>
      <Container>
        <OnChainPanel slug={slug} name={o.name} />
        <CasinoFacts o={o} />
        {readings.length > 0 && (
          <>
            <H2 id="rtp-readings">RTP we have read at {o.name}</H2>
            <TableWrap caption={`The RTP ${o.name} showed for its own copy of each game, on the date shown.`}>
              <thead>
                <tr>
                  <th className={th}>Slot</th>
                  <th className={th}>RTP at {o.name}</th>
                  <th className={th}>Provider RTP</th>
                  <th className={th}>Where read</th>
                  <th className={th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {readings.map((r) => (
                  <tr key={r.id}>
                    <td className={`${td} font-medium text-text-primary`}>{getGame(r.slotSlug)?.name ?? r.slotSlug}</td>
                    <td className={`${td} font-semibold text-text-primary`}>{fmtRtp(r.rtp)}</td>
                    <td className={td}>{fmtRtp(r.publishedRtp)}</td>
                    <td className={td}>{SOURCE_LABEL[r.source]}</td>
                    <td className={td}>{fmtDate(r.checkedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          </>
        )}
        <p className="mt-10 text-sm">
          <Link href="/casinos/" className="text-accent hover:underline">All casino stats</Link>
        </p>
        <PartnerList title="Other casinos to compare" context={{ kind: "alternative", of: slug }} seed={slug} exclude={[slug]} />
      </Container>
    </>
  );
}
