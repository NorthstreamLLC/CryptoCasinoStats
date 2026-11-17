import { volumeFor, type VolumeFigure } from "@/lib/volume";
import { Cite, H2 } from "./ui";
import Link from "next/link";

function Figure({ label, f }: { label: string; f: VolumeFigure }) {
  return (
    <div className="bg-surface p-5">
      <div className="text-xs font-semibold text-text-dim-2">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-text-primary">{f.value}</div>
      {f.note && <div className="mt-1 text-xs text-accent-bright">{f.note}</div>}
      <div className="mt-2">
        <Cite source={f.source} href={f.sourceUrl} asOf={f.asOf} />
      </div>
    </div>
  );
}

/** A casino's third-party on-chain figures, every one cited. Renders nothing when none are on file. */
export function OnChainPanel({ slug, name }: { slug: string; name: string }) {
  const v = volumeFor(slug);
  if (!v) return null;
  const figs = [...v.deposits.map((f) => ({ label: `30-day deposit volume (${f.source})`, f })), ...v.wallet.map((f) => ({ label: `Hot-wallet balance, all chains (${f.source})`, f }))];
  return (
    <section>
      <H2 id="on-chain">{name} on-chain activity</H2>
      <p className="mb-4 max-w-3xl text-sm text-text-muted">
        Deposits to a casino are public on the blockchain. These figures are each platform&apos;s own attribution of wallet activity to {name}, not
        something we measured; grouping wallets is a heuristic and can be wrong. <Link href="/methodology/" className="text-accent hover:underline">How to read them</Link>.
      </p>
      <div className="grid gap-px overflow-hidden rounded-[14px] border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {figs.map(({ label, f }, i) => (
          <Figure key={i} label={label} f={f} />
        ))}
      </div>
    </section>
  );
}
