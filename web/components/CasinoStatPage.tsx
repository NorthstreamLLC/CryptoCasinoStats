import Image from "next/image";
import Link from "next/link";
import pages from "@/data/ccs/casinoPages.json";
import { Container, H2, Card, Inline, TableWrap, th, td, Cite } from "./ui";
import { OnChainPanel } from "./OnChainPanel";
import { SlotTable } from "./SlotTable";
import { PartnerList } from "./PartnerList";
import { goPath, hasLink } from "@/lib/outbound";
import { readingsFor, getGame, fmtRtp, SOURCE_LABEL } from "@/lib/slots";
import { getCasinoSpecSheet } from "@/lib/spec-sheet";
import { fmtDate, SITE_URL } from "@/lib/site";

type CasinoPage = {
  name: string;
  logo: string;
  tagline: string;
  description: string;
  whyTitle: string;
  why: string;
  highlights: [string, string, string][];
  slots: Record<string, string[]>;
  verdictTitle: string;
  verdict: string;
  rewards: string[];
  platform: string[];
};

export const casinoPage = (slug: string) => (pages as unknown as Record<string, CasinoPage>)[slug];

/** Spec-sheet groups worth showing on a stats page, in this order. */
const GROUPS = ["Coins & deposit limits", "Payouts & fees", "Compliance"];

function PlayButton({ slug, name, placement }: { slug: string; name: string; placement: string }) {
  if (!hasLink(slug)) return null;
  return (
    <a href={`${goPath(slug)}?p=${placement}`} rel="nofollow sponsored" className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-page shadow-[var(--shadow-cta)] hover:bg-accent-bright">
      Play {name}
    </a>
  );
}

export function CasinoStatPage({ slug }: { slug: string }) {
  const c = casinoPage(slug);
  const sheet = getCasinoSpecSheet(slug);
  const readings = readingsFor(slug).sort((a, b) => a.slotSlug.localeCompare(b.slotSlug));
  const ld = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/${slug}/#webpage`,
    url: `${SITE_URL}/${slug}/`,
    name: `${c.name} - Crypto Casino Stats`,
    description: c.description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@type": "Organization", name: c.name },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Casinos", item: `${SITE_URL}/casinos/` },
        { "@type": "ListItem", position: 3, name: c.name },
      ],
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="border-b border-border bg-surface-hero/40">
        <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:py-14">
          <Image src={c.logo} alt={`${c.name} logo`} width={120} height={120} className="h-24 w-24 rounded-2xl object-cover" priority />
          <div>
            <nav aria-label="Breadcrumb" className="mb-2 text-xs text-text-dim">
              <Link href="/" className="hover:text-text-primary">Home</Link> / <Link href="/casinos/" className="hover:text-text-primary">Casinos</Link> / {c.name}
            </nav>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{c.name}</h1>
            <p className="mt-3 max-w-2xl text-lg text-text-secondary">{c.tagline}</p>
            <div className="mt-5">
              <PlayButton slug={slug} name={c.name} placement="casino-hero" />
            </div>
          </div>
        </Container>
      </section>

      <Container>
        <H2>{c.whyTitle}</H2>
        <p className="max-w-3xl text-text-secondary">
          <Inline text={c.why} />
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {c.highlights.map(([icon, title, body]) => (
            <li key={title} className="rounded-[14px] border border-border bg-surface p-4">
              <span aria-hidden className="mr-2">{icon}</span>
              <span className="font-semibold text-text-primary">{title}</span>
              {body && <p className="mt-1 text-sm text-text-muted">{body}</p>}
            </li>
          ))}
        </ul>

        <OnChainPanel slug={slug} name={c.name} />

        <H2 id="slots">Slots on {c.name}</H2>
        <p className="mb-4 max-w-3xl text-sm text-text-muted">
          RTP is the share of all money wagered on a game that it pays back over a very long run. Studios publish a default RTP, but a casino can offer
          a lower-RTP version of the same game, so the column that matters is the one read at {c.name}. We only fill it once we have read it on{" "}
          {c.name}&apos;s own game page or in-game paytable.
        </p>
        <div className="grid grid-cols-1 gap-8">
          {Object.entries(c.slots).map(([provider, slugs]) => (
            <div key={provider} className="min-w-0">
              <h3 className="mb-3 text-lg font-semibold">{provider} slots on {c.name}</h3>
              <SlotTable slugs={slugs} operator={slug} operatorName={c.name} />
            </div>
          ))}
        </div>

        {readings.length > 0 && (
          <>
            <H2 id="rtp-readings">RTP we have read at {c.name}</H2>
            <TableWrap caption={<>Each reading is the RTP {c.name} showed for its own copy of the game on the date shown. Readings are re-checked monthly.</>}>
              <thead>
                <tr>
                  <th className={th}>Slot</th>
                  <th className={th}>RTP at {c.name}</th>
                  <th className={th}>Provider RTP</th>
                  <th className={th}>Where read</th>
                  <th className={th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {readings.map((r) => {
                  const g = getGame(r.slotSlug);
                  return (
                    <tr key={r.id}>
                      <td className={`${td} font-medium text-text-primary`}>{g?.name ?? r.slotSlug}</td>
                      <td className={`${td} font-semibold text-text-primary`}>{fmtRtp(r.rtp)}</td>
                      <td className={td}>{fmtRtp(r.publishedRtp)}</td>
                      <td className={td}>{SOURCE_LABEL[r.source]}</td>
                      <td className={td}>{fmtDate(r.checkedAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </TableWrap>
          </>
        )}

        {sheet && (
          <>
            <H2 id="facts">{c.name} facts, from {c.name}&apos;s own pages</H2>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {sheet.groups
                .filter((g) => GROUPS.includes(g.title))
                .sort((a, b) => GROUPS.indexOf(a.title) - GROUPS.indexOf(b.title))
                .map((g) => (
                  <Card key={g.title}>
                    <h3 className="mb-3 font-semibold">{g.title}</h3>
                    <dl className="grid gap-3 text-sm">
                      {g.facts.slice(0, 6).map((f) => (
                        <div key={f.label}>
                          <dt className="text-xs text-text-dim-2">{f.label}</dt>
                          <dd className="text-text-secondary">{f.chips ? f.chips.join(", ") : f.value}</dd>
                          {f.sourceUrl && <Cite source="Source" href={f.sourceUrl} asOf={f.asOf} />}
                        </div>
                      ))}
                    </dl>
                  </Card>
                ))}
            </div>
          </>
        )}

        <H2>{c.verdictTitle}</H2>
        <p className="max-w-3xl text-text-secondary">
          <Inline text={c.verdict} />
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <PlayButton slug={slug} name={c.name} placement="casino-verdict" />
          <Link href="/casinos/" className="inline-flex items-center rounded-lg border border-border-strong px-5 py-2.5 text-sm font-semibold hover:bg-row-hover">
            More Casinos
          </Link>
          <Link href="/top-slots/" className="inline-flex items-center rounded-lg border border-border-strong px-5 py-2.5 text-sm font-semibold hover:bg-row-hover">
            More Slot Stats
          </Link>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <Card>
            <h2 className="mb-3 text-lg font-bold">Rewards &amp; Bonuses</h2>
            <ul className="grid gap-2 text-sm text-text-secondary">
              {c.rewards.map((r) => (
                <li key={r}>• {r}</li>
              ))}
            </ul>
          </Card>
          <Card>
            <h2 className="mb-3 text-lg font-bold">Platform &amp; Security</h2>
            <ul className="grid gap-2 text-sm text-text-secondary">
              {c.platform.map((r) => (
                <li key={r}>• {r}</li>
              ))}
            </ul>
          </Card>
        </div>

        <PartnerList title="Other casinos to compare" context={{ kind: "alternative", of: slug }} seed={slug} exclude={[slug]} />
      </Container>
    </>
  );
}
