import Link from "next/link";
import pages from "@/data/ccs/casinoPages.json";
import roobetKyc from "@/data/ccs/roobetKyc.json";
import { casinoProfile } from "@/lib/casino-profile";
import { getGame, readingAt, fmtRtp, fmtX, SOURCE_LABEL } from "@/lib/slots";
import { fmtDate, SITE_URL } from "@/lib/site";
import { Inline } from "@/components/ui";
import { ProfileHero } from "./ProfileHero";
import { SectionNav } from "./SectionNav";
import { Block } from "./Block";
import { Glance } from "./Glance";
import { OnChain } from "./OnChain";
import { Story } from "./Story";
import { SlotTabs, type SlotRow } from "./SlotTabs";
import { Readings } from "./Readings";
import { Terms } from "./Terms";
import { Compare } from "./Compare";
import { VisitBar } from "./VisitBar";

type Copy = {
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

/** Hand-written copy carried over from the old site, for the casinos it profiled. */
export const casinoCopy = (slug: string): Copy | undefined => (pages as unknown as Record<string, Copy>)[slug];

/**
 * One casino profile layout for every casino. Casinos the old site wrote copy
 * for (Stake, Roobet, Razed) show it as written, in its own sections; every
 * figure on the page comes from the shared, sourced data.
 */
export function CasinoProfile({ slug, path }: { slug: string; path: string }) {
  const p = casinoProfile(slug);
  const c = casinoCopy(slug);
  const name = p.o.name;

  const slotGroups = c
    ? Object.entries(c.slots).map(([provider, slugs]) => ({
        provider,
        rows: slugs.map((s): SlotRow => {
          const g = getGame(s);
          const r = readingAt(s, slug);
          return {
            slug: s,
            name: g?.name ?? s,
            maxWin: fmtX(g?.maxWinMultiplier),
            volatility: g?.volatility ?? "—",
            provider: fmtRtp(g?.rtp),
            reading: r ? { rtp: fmtRtp(r.rtp), where: SOURCE_LABEL[r.source], date: fmtDate(r.checkedAt) } : null,
          };
        }),
      }))
    : [];
  const hasSlots = slotGroups.length > 0 || p.readings.length > 0;

  const nav = [
    { id: "overview", label: "Overview" },
    ...(c ? [{ id: "why", label: "Why " + name }] : []),
    { id: "on-chain", label: "On-chain" },
    ...(hasSlots ? [{ id: "slots", label: "Slots & RTP" }] : []),
    ...(slug === "roobet" ? [{ id: "kyc", label: "KYC" }] : []),
    { id: "terms", label: "Terms" },
    ...(c ? [{ id: "verdict", label: "Verdict" }] : []),
    { id: "compare", label: "Compare" },
  ];

  const ld = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: `${SITE_URL}${path}`,
    name: c ? `${name} - Crypto Casino Stats` : `${name} Casino Stats`,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@type": "Organization", name },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Casinos", item: `${SITE_URL}/casinos/` },
        { "@type": "ListItem", position: 3, name },
      ],
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <ProfileHero p={p} logo={c?.logo} tagline={c?.tagline} />
      <SectionNav items={nav} />

      <Block id="overview" eyebrow="At a glance" title={`${name} in six numbers and terms`} lede={`Taken from ${name}'s own terms and help pages; the sources are under Terms.`}>
        <Glance p={p} />
      </Block>

      {c && (
        <Block id="why" eyebrow="Our take" title={c.whyTitle} tint>
          <Story why={c.why} highlights={c.highlights} />
        </Block>
      )}

      <Block
        id="on-chain"
        eyebrow="On-chain activity"
        title={p.rank ? `#${p.rank.pos} of ${p.rank.of} by 30-day deposits` : `${name} on-chain`}
        lede="Deposits to a casino are public on the blockchain. Here is where public trackers place it."
        tint={!c}
      >
        <OnChain p={p} />
      </Block>

      {hasSlots && (
        <Block
          id="slots"
          eyebrow="Slots & RTP"
          title={c ? `Slots on ${name}` : `The RTP ${name} runs`}
          lede={`Studios publish a default RTP, but a casino can run a lower-RTP version of the same game. The figure that matters is the one ${name} shows for its own copy.`}
          tint={!!c}
        >
          <div className="grid gap-4">
            {slotGroups.length > 0 && <SlotTabs groups={slotGroups} casino={name} />}
            {p.readings.length > 0 && <Readings p={p} />}
          </div>
        </Block>
      )}

      {slug === "roobet" && (
        <Block id="kyc" eyebrow="Verification" title="Roobet KYC: what Roobet publishes" lede="Upload documents only inside your own Roobet account. Nobody else can approve verification, and nobody legitimate needs your password, 2FA code or recovery key.">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {roobetKyc.facts.map((f) => (
              <div key={f.label} className="ccs-card min-w-0 p-5">
                <div className="ccs-eyebrow">{f.label}</div>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{f.value}</p>
                <a href={f.url} target="_blank" rel="noopener noreferrer nofollow" className="mt-3 inline-block text-xs text-text-dim hover:text-accent">
                  {f.source} ↗ · {fmtDate(roobetKyc.checkedAt)}
                </a>
              </div>
            ))}
          </div>
        </Block>
      )}

      <Block id="terms" eyebrow="Terms" title={`${name}'s published facts`} lede={`${p.factCount} facts, each summarised from ${name}'s own pages and linked to the source.`} tint={slug === "roobet" || !c}>
        <Terms p={p} />
      </Block>

      {c && (
        <Block id="verdict" eyebrow="Verdict" title={c.verdictTitle} tint={slug !== "roobet"}>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_1fr_1fr]">
            <div className="ccs-card ccs-card-glow min-w-0 p-6">
              <p className="text-lg leading-relaxed text-text-secondary">
                <Inline text={c.verdict} />
              </p>
              {p.link && (
                <a href={`/go/${slug}/?p=profile-verdict`} rel="nofollow sponsored" className="ccs-btn-primary mt-6">
                  Visit {name} →
                </a>
              )}
            </div>
            {(
              [
                ["Rewards & Bonuses", c.rewards],
                ["Platform & Security", c.platform],
              ] as const
            ).map(([t, list]) => (
              <div key={t} className="ccs-card min-w-0 p-6">
                <h3 className="font-semibold text-text-primary">{t}</h3>
                <ul className="mt-3 grid gap-2.5 text-sm text-text-secondary">
                  {list.map((x) => (
                    <li key={x} className="flex gap-2">
                      <span aria-hidden className="text-accent">✓</span>
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Block>
      )}

      <Block id="compare" eyebrow="Compare" title={`Alternatives to ${name}`} lede="Partner casinos picked for how they differ from this one, with the numbers to check it.">
        <Compare p={p} />
        <div className="mt-10 flex flex-col gap-3 rounded-2xl border border-border bg-section p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-text-secondary">Every figure on this page links to where it came from. Spotted something out of date?</p>
          <div className="flex gap-4 text-sm font-semibold">
            <Link href="/methodology/" className="text-accent hover:underline">Methodology →</Link>
            <Link href="/casinos/" className="text-text-secondary hover:text-text-primary">All casinos</Link>
          </div>
        </div>
      </Block>

      {p.link && <VisitBar slug={slug} name={name} />}
    </>
  );
}
