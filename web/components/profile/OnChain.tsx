import Link from "next/link";
import { fmtDate } from "@/lib/site";
import type { CasinoProfileData } from "@/lib/casino-profile";

/** Where the casino sits in the deposit ranking, then every cited figure with its source. */
export function OnChain({ p }: { p: CasinoProfileData }) {
  const figs = [...p.deposits.map((f) => ({ label: "30-day deposits", f })), ...p.wallet.map((f) => ({ label: "Hot-wallet balance", f }))];
  if (!figs.length)
    return (
      <div className="ccs-card p-6 text-text-secondary">
        Neither tracker we cite publishes figures for {p.o.name} yet. We add them as soon as one does. <Link href="/casinos/#volume" className="text-accent hover:underline">See the casinos that are tracked →</Link>
      </div>
    );
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.15fr_1fr]">
      {p.neighbours.length > 0 && (
        <div className="ccs-card min-w-0 overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <p className="text-sm font-semibold text-text-primary">Deposit ranking{p.rank ? `: #${p.rank.pos} of ${p.rank.of}` : ""}</p>
            <p className="text-xs text-text-dim">30-day deposits, FairGambling attribution</p>
          </div>
          <ol>
            {p.neighbours.map((r) => {
              const me = r.slug === p.o.slug;
              return (
                <li key={r.slug} className={`border-t border-row-divider first:border-t-0 ${me ? "bg-accent-wash" : ""}`}>
                  <Link href={r.path} aria-current={me ? "page" : undefined} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5 px-5 py-3 hover:bg-row-hover">
                    <span className={`truncate font-semibold ${me ? "text-accent-bright" : "text-text-primary"}`}>{r.name}</span>
                    <span className="ccs-num text-sm font-semibold text-text-primary">{r.value}</span>
                    <span className="col-span-2 h-2 overflow-hidden rounded-full bg-page">
                      <span className={`ccs-bar block h-full rounded-full ${me ? "" : "opacity-50"}`} style={{ width: `${Math.max(2, (r.num / p.neighbourMax) * 100)}%` }} />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      )}
      <div className="grid min-w-0 content-start gap-3">
        {figs.map(({ label, f }, i) => (
          <div key={i} className="ccs-card p-5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm text-text-muted">{label}</span>
              <span className="ccs-num text-2xl font-semibold text-text-primary">{f.value}</span>
            </div>
            {f.note && <p className="mt-1 text-xs text-accent-bright">{f.note}</p>}
            <a href={f.sourceUrl} target="_blank" rel="noopener noreferrer nofollow" className="mt-3 inline-flex rounded-full border border-border px-2.5 py-1 text-xs text-text-dim hover:border-accent hover:text-accent">
              {f.source} ↗ · {fmtDate(f.asOf)}
            </a>
          </div>
        ))}
        <p className="text-xs leading-relaxed text-text-dim">
          Third-party wallet attribution, not our measurement. Deposits are money in, not profit or amount wagered; a hot wallet is not total reserves.{" "}
          <Link href="/methodology/" className="text-accent hover:underline">How to read these</Link>
        </p>
      </div>
    </div>
  );
}
