import Image from "next/image";
import Link from "next/link";
import ops from "@/data/ops.json";
import coinsBy from "@/data/coinsBy.json";
import { Container, Hero, H2, TableWrap, th, td, Cite } from "@/components/ui";
import { PartnerList } from "@/components/PartnerList";
import { pageMeta, fmtDate } from "@/lib/site";
import { volumeTable, earliestAsOf, latestAsOf, type VolumeFigure } from "@/lib/volume";
import { goPath, hasLink, CASINO_PAGES } from "@/lib/outbound";
import { readingsFor } from "@/lib/slots";
import type { Operator } from "@/lib/types";

export const metadata = pageMeta(
  "Casinos",
  "Crypto casinos compared: 30-day on-chain deposit volume and hot-wallet balances for 39 casinos, plus RTP readings, each with its source and date.",
  "/casinos/",
  { image: "/wp-content/uploads/2025/07/22.png" }
);

const OPS = ops as Operator[];

const BEST = [
  { slug: "roobet", logo: "/wp-content/uploads/2025/07/roobet-logo.png", line: "High-ranking platform offering unique house games." },
  { slug: "razed", logo: "/wp-content/uploads/2025/07/images.jpeg", line: "Highest RTP, widest game variety, and unmatched monthly rewards." },
  { slug: "stake", logo: "/wp-content/uploads/2025/07/Untitled-design-79.png", line: "Top-tier crypto casino with strong community backing." },
];

const FEATURED = [
  { slug: "roobet", name: "Roobet", logo: "/wp-content/uploads/2025/07/roobet-logo.png" },
  { slug: "razed", name: "Razed", logo: "/wp-content/uploads/2025/07/images.jpeg" },
  { slug: "stake", name: "Stake", logo: "/wp-content/uploads/2025/07/Untitled-design-79.png" },
  { slug: "shuffle", name: "Shuffle", logo: "/wp-content/uploads/2025/07/0x0.png" },
  { slug: "rainbet", name: "Rainbet", logo: "/wp-content/uploads/2025/07/0x0-1.png" },
  { slug: "jackbit", name: "Jackbit", logo: "/wp-content/uploads/2025/07/0x0-2.png" },
  { slug: "betpanda", name: "Betpanda", logo: "/wp-content/uploads/2025/07/0x0-3.png" },
  { slug: "playbet", name: "Playbet", logo: "/wp-content/uploads/2025/07/0x0-4.png" },
];

const NO_KYC = ["razed", "shuffle", "rainbet"];

function Fig({ f }: { f?: VolumeFigure }) {
  if (!f) return <span className="text-text-dim">—</span>;
  return (
    <>
      <span className="font-semibold text-text-primary">{f.value}</span>
      <span className="block">
        <Cite source={f.source} href={f.sourceUrl} asOf={f.asOf} />
      </span>
    </>
  );
}

function CasinoName({ slug, name }: { slug: string; name: string }) {
  return CASINO_PAGES[slug] ? (
    <Link href={CASINO_PAGES[slug]} className="font-medium text-accent hover:underline">
      {name}
    </Link>
  ) : (
    <span className="font-medium text-text-primary">{name}</span>
  );
}

export default function CasinosPage() {
  const rows = volumeTable();
  const nameOf = (slug: string) => OPS.find((o) => o.slug === slug)?.name ?? slug;
  return (
    <>
      <Hero
        title="Top Crypto Casinos"
        lede="Discover the best crypto casinos for higher RTPs, no KYC, and next-gen slot rewards, with the numbers behind them: deposit volume, wallet balances and the RTP each casino runs."
      />
      <Container>
        <H2>Best Rated Casinos</H2>
        <div className="grid gap-4 sm:grid-cols-3">
          {BEST.map((b) => (
            <div key={b.slug} className="flex flex-col rounded-[14px] border border-border bg-surface p-5">
              <Image src={b.logo} alt={`${nameOf(b.slug)} logo`} width={72} height={72} className="h-16 w-16 rounded-xl object-cover" />
              <h3 className="mt-3 text-lg font-semibold">{nameOf(b.slug)}</h3>
              <p className="mt-1 flex-1 text-sm text-text-muted">{b.line}</p>
              <div className="mt-4 flex gap-2">
                {hasLink(b.slug) && (
                  <a href={`${goPath(b.slug)}?p=best-rated`} rel="nofollow sponsored" className="rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-page hover:bg-accent-bright">
                    Play {nameOf(b.slug)}
                  </a>
                )}
                <Link href={CASINO_PAGES[b.slug]} className="rounded-lg border border-border-strong px-3 py-2 text-sm font-semibold hover:bg-row-hover">
                  Stats
                </Link>
              </div>
            </div>
          ))}
        </div>

        <H2 id="comparison">Casinos Comparison</H2>
        <TableWrap caption="RTP readings: what each casino showed for its own copy of the game, read on its game page or in-game paytable. Volume and wallet: FairGambling's on-chain attribution.">
          <thead>
            <tr>
              <th className={th}>Casino</th>
              <th className={th}>30-day deposit volume</th>
              <th className={th}>Hot-wallet balance</th>
              <th className={th}>Slot RTPs read</th>
              <th className={th}>Accepted coins (leading)</th>
            </tr>
          </thead>
          <tbody>
            {BEST.map(({ slug }) => {
              const v = rows.find((r) => r.slug === slug);
              const rd = readingsFor(slug);
              const lo = rd.length ? Math.min(...rd.map((r) => r.rtp)) : null;
              const hi = rd.length ? Math.max(...rd.map((r) => r.rtp)) : null;
              const last = rd.map((r) => r.checkedAt).sort().at(-1);
              return (
                <tr key={slug}>
                  <td className={td}><CasinoName slug={slug} name={nameOf(slug)} /></td>
                  <td className={td}><Fig f={v?.deposits.find((d) => d.source === "FairGambling") ?? v?.deposits[0]} /></td>
                  <td className={td}><Fig f={v?.wallet[0]} /></td>
                  <td className={td}>
                    {rd.length ? (
                      <>
                        <span className="font-semibold text-text-primary">{rd.length} slots, {lo!.toFixed(2)}–{hi!.toFixed(2)}%</span>
                        <span className="block text-xs text-text-dim">read {fmtDate(last!)}</span>
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className={td}><CoinsCell slug={slug} /></td>
                </tr>
              );
            })}
          </tbody>
        </TableWrap>

        <H2 id="volume">On-chain deposit volume, all tracked casinos</H2>
        <p className="mb-4 max-w-3xl text-sm text-text-muted">
          Every casino we have on-chain figures for, largest 30-day deposit volume first. These are third-party attributions of wallet activity
          (FairGambling, Tanzanite), shown as each platform published them with a link to the page and the date read. Figures on file run from{" "}
          {fmtDate(earliestAsOf())} to {fmtDate(latestAsOf())}. <Link href="/methodology/" className="text-accent hover:underline">What these numbers can and cannot tell you</Link>.
        </p>
        <TableWrap>
          <thead>
            <tr>
              <th className={th}>#</th>
              <th className={th}>Casino</th>
              <th className={th}>30-day deposits (FairGambling)</th>
              <th className={th}>30-day deposits (Tanzanite)</th>
              <th className={th}>Hot-wallet balance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.slug}>
                <td className={`${td} text-text-dim`}>{i + 1}</td>
                <td className={td}><CasinoName slug={r.slug} name={r.name} /></td>
                <td className={td}><Fig f={r.deposits.find((d) => d.source === "FairGambling")} /></td>
                <td className={td}><Fig f={r.deposits.find((d) => d.source === "Tanzanite")} /></td>
                <td className={td}><Fig f={r.wallet[0]} /></td>
              </tr>
            ))}
          </tbody>
        </TableWrap>

        <H2>Featured Casinos</H2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {FEATURED.map((f) => {
            const inner = (
              <>
                <Image src={f.logo} alt={`${f.name} logo`} width={96} height={96} className="h-20 w-20 rounded-xl object-cover" />
                <span className="mt-2 text-sm font-semibold">{f.name}</span>
              </>
            );
            const cls = "flex flex-col items-center rounded-[14px] border border-border bg-surface p-4 hover:bg-row-hover";
            return CASINO_PAGES[f.slug] ? (
              <Link key={f.slug} href={CASINO_PAGES[f.slug]} className={cls}>{inner}</Link>
            ) : hasLink(f.slug) ? (
              <a key={f.slug} href={`${goPath(f.slug)}?p=featured`} rel="nofollow sponsored" className={cls}>{inner}</a>
            ) : (
              <div key={f.slug} className={cls}>{inner}</div>
            );
          })}
        </div>
        <p className="mt-4 max-w-3xl text-sm text-text-muted">
          We’re actively researching and updating data for more platforms. If your go-to crypto casino isn’t featured yet, chances are it’s coming soon.
        </p>

        <H2>No KYC Crypto Casinos</H2>
        <div className="flex flex-wrap gap-3">
          {NO_KYC.map((s) => (
            <span key={s} className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold">
              <CasinoName slug={s} name={nameOf(s)} />
            </span>
          ))}
        </div>
        <H2>Why No-KYC Casinos?</H2>
        <p className="max-w-3xl text-text-secondary">
          No-KYC crypto casinos let you play without uploading personal documents, giving you faster access, more privacy, and a smoother signup
          process. These platforms often accept wallets like MetaMask and prioritize user anonymity without sacrificing gameplay quality.
        </p>

        <PartnerList seed="casinos" count={4} />
      </Container>
    </>
  );
}

function CoinsCell({ slug }: { slug: string }) {
  const list = (coinsBy as Record<string, string[]>)[slug];
  return <>{list?.length ? list.slice(0, 8).join(", ") : "—"}</>;
}
