import Link from "next/link";
import { fmtDate } from "@/lib/site";
import { pct, big, type Report, type Move } from "@/lib/history";

function Change({ x }: { x: number | null }) {
  if (x == null) return <span className="text-text-dim">—</span>;
  const up = x > 0;
  return <span className={`ccs-num font-semibold ${up ? "text-accent-bright" : x < 0 ? "text-warning" : "text-text-secondary"}`}>{pct(x)}</span>;
}

function MoverCard({ m, kind }: { m: Move; kind: "up" | "down" }) {
  return (
    <Link href={m.path} className="ccs-card ccs-lift block min-w-0 p-5">
      <p className="ccs-eyebrow">{kind === "up" ? "Biggest rise" : "Biggest fall"}</p>
      <p className="mt-2 truncate text-lg font-semibold text-text-primary">{m.name}</p>
      <p className="mt-1 text-2xl"><Change x={m.change} /></p>
      <p className="ccs-num mt-2 text-sm text-text-muted">
        {m.prev!.value} → {m.now.value}
      </p>
      <p className="mt-1 text-xs text-text-dim">{fmtDate(m.prev!.asOf)} → {fmtDate(m.now.asOf)}</p>
    </Link>
  );
}

/** Sentences built only from the numbers in the report, so the text can never say more than the data. */
export function summary(r: Report): string[] {
  const t = r.totals;
  const w = r.window;
  const out: string[] = [];
  out.push(`On ${fmtDate(r.date)}, 30-day on-chain deposits at the ${t.fresh} casinos we re-read on FairGambling totalled ${big(t.freshDeposits)}. Each figure is that casino's trailing 30 days as of the day it was read.`);
  if (w && t.comparable > 0 && t.prevDeposits > 0) {
    const ch = t.deposits / t.prevDeposits - 1;
    out.push(`For the ${t.comparable} casinos also read in our previous snapshot (${fmtDate(w.from)}, ${w.days} days earlier), deposits moved from ${big(t.prevDeposits)} to ${big(t.deposits)} (${pct(ch)}).`);
  } else if (w) {
    out.push(`No change is given against the previous snapshot (${fmtDate(w.from)}): its figures were read on different dates, so they do not cover the same 30 days. Like-for-like changes start with the next weekly run.`);
  }
  if (r.leader) out.push(`${r.leader.name} is the largest at ${r.leader.now.value}${r.leader.change != null ? ` (${pct(r.leader.change)} since ${fmtDate(r.leader.prev!.asOf)})` : ""}${t.freshDeposits > 0 ? `, ${((r.leader.now.num / t.freshDeposits) * 100).toFixed(0)}% of the total` : ""}.`);
  if (r.risers[0]) out.push(`The biggest rise among casinos with at least $5M in deposits was ${r.risers[0].name} (${pct(r.risers[0].change)}, ${r.risers[0].prev!.value} to ${r.risers[0].now.value}).`);
  if (r.fallers[0]) out.push(`The biggest fall was ${r.fallers[0].name} (${pct(r.fallers[0].change)}, ${r.fallers[0].prev!.value} to ${r.fallers[0].now.value}).`);
  if (t.prevWallet > 0) {
    const ch = t.wallet / t.prevWallet - 1;
    out.push(`Hot-wallet balances at casinos read on both dates came to ${big(t.wallet)}, ${pct(ch)} since ${fmtDate(w!.from)}.`);
  }
  if (r.heldBack.length) out.push(`${r.heldBack.length} casino${r.heldBack.length > 1 ? "s were" : " was"} not re-read this time. Their older figures are listed with their own dates and left out of the totals.`);
  return out;
}

export function ReportView({ r }: { r: Report }) {
  const lines = summary(r);
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <div className="ccs-card ccs-card-glow p-6 sm:p-8">
        <p className="ccs-eyebrow">In numbers</p>
        <div className="mt-4 grid gap-3 text-lg leading-relaxed text-text-secondary">
          {lines.map((l) => (
            <p key={l}>{l}</p>
          ))}
        </div>
      </div>

      {(r.risers.length > 0 || r.fallers.length > 0) && (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {r.risers.slice(0, 2).map((m) => <MoverCard key={m.slug} m={m} kind="up" />)}
          {r.fallers.slice(0, 1).map((m) => <MoverCard key={m.slug} m={m} kind="down" />)}
        </div>
      )}

      <h2 className="ccs-display mt-14 text-3xl">Every casino, deposits and hot wallets</h2>
      <p className="mt-2 max-w-3xl text-sm text-text-muted">30-day deposits and hot-wallet balance as FairGambling attributes them. A change is shown only where the casino was also read in the previous snapshot{r.window ? ` (${fmtDate(r.window.from)})` : ""}, so both figures are like for like. Each figure links to its source page.</p>
      <div className="ccs-card mt-6 overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-text-dim">
              <th className="px-4 py-3 font-semibold">#</th>
              <th className="px-4 py-3 font-semibold">Casino</th>
              <th className="px-4 py-3 font-semibold">30-day deposits</th>
              <th className="px-4 py-3 font-semibold">Previous</th>
              <th className="px-4 py-3 font-semibold">Change</th>
              <th className="px-4 py-3 font-semibold">Hot wallet</th>
              <th className="px-4 py-3 font-semibold">Change</th>
            </tr>
          </thead>
          <tbody>
            {r.deposits.map((m, i) => {
              const w = r.wallet.find((x) => x.slug === m.slug);
              return (
                <tr key={m.slug} className="border-t border-row-divider">
                  <td className="ccs-num px-4 py-3 text-text-dim">{i + 1}</td>
                  <td className="px-4 py-3"><Link href={m.path} className="font-semibold text-text-primary hover:text-accent">{m.name}</Link></td>
                  <td className="px-4 py-3">
                    <a href={m.now.sourceUrl} target="_blank" rel="noopener noreferrer nofollow" className="ccs-num font-semibold text-text-primary hover:text-accent">{m.now.value}</a>
                    {!m.fresh && <span className="block text-xs text-warning">as of {fmtDate(m.now.asOf)}</span>}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {m.prev ? (
                      <><span className="ccs-num">{m.prev.value}</span><span className="block text-xs text-text-dim">{fmtDate(m.prev.asOf)}</span></>
                    ) : m.last ? (
                      <><span className="ccs-num">{m.last.value}</span><span className="block text-xs text-text-dim">{fmtDate(m.last.asOf)}, not like for like</span></>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3">{m.fresh ? <Change x={m.change} /> : <span className="text-xs text-text-dim">not re-read</span>}</td>
                  <td className="ccs-num px-4 py-3 text-text-secondary">{w?.now.value ?? "—"}</td>
                  <td className="px-4 py-3">{w?.fresh ? <Change x={w.change} /> : <span className="text-xs text-text-dim">—</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="ccs-card p-5 text-sm text-text-secondary">
          <p className="font-semibold text-text-primary">How this report is made</p>
          <p className="mt-2">Every Monday we re-read FairGambling&apos;s public page for each casino it covers and save the figures. This report compares each casino only with its figure in the previous snapshot, and only when both were read in their own week; older figures are shown with their dates but never compared or totalled. A figure that fails to read, or moves more than tenfold, is held back and keeps its older date.</p>
        </div>
        <div className="ccs-card p-5 text-sm text-text-secondary">
          <p className="font-semibold text-text-primary">What these numbers are</p>
          <p className="mt-2">Third-party attribution of on-chain wallet activity, not our measurement. Deposits are money in, not profit or amount wagered; a hot wallet is not total reserves. <Link href="/methodology/" className="text-accent underline decoration-accent/50 underline-offset-2">Methodology</Link></p>
        </div>
      </div>
    </div>
  );
}
