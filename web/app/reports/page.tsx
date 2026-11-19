import Link from "next/link";
import { report, reportDates, big, pct } from "@/lib/history";
import { pageMeta, fmtDate } from "@/lib/site";
import { DocHero } from "@/components/doc/DocHero";

export const metadata = pageMeta("Weekly crypto casino reports", "Every week: 30-day on-chain deposits and hot-wallet balances for crypto casinos, the biggest risers and fallers, each figure sourced and dated.", "/reports/");

export default function ReportsIndex() {
  const rs = reportDates().map((d) => report(d)!).filter(Boolean);
  return (
    <>
      <DocHero eyebrow={<span>Weekly report · {rs.length} published</span>} title="Weekly crypto casino reports" lede="Every Monday we re-read the on-chain figures for every casino FairGambling covers and publish what moved: total deposits, the leaders, and the biggest risers and fallers." wide />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-3 px-4 py-12 sm:py-16 md:grid-cols-2">
        {rs.map((r, i) => (
          <Link key={r.date} href={`/reports/${r.date}/`} className={`ccs-card ccs-lift block p-6 ${i === 0 ? "ccs-card-glow md:col-span-2" : ""}`}>
            <p className="ccs-eyebrow">{i === 0 ? "Latest · " : ""}{fmtDate(r.date)}</p>
            <h2 className="ccs-display mt-2 text-2xl">Crypto casino deposits report, {fmtDate(r.date)}</h2>
            <p className="mt-3 text-text-secondary">
              <span className="ccs-num font-semibold text-text-primary">{big(r.totals.deposits)}</span> in 30-day deposits across {r.totals.comparable} casinos
              {r.totals.prevDeposits ? <> ({pct(r.totals.deposits / r.totals.prevDeposits - 1)})</> : null}
              {r.risers[0] ? <>. Biggest rise: {r.risers[0].name} {pct(r.risers[0].change)}</> : null}
              {r.fallers[0] ? <>; biggest fall: {r.fallers[0].name} {pct(r.fallers[0].change)}</> : null}.
            </p>
          </Link>
        ))}
        {rs.length === 0 && <p className="text-text-muted">The first report is published after the next weekly refresh.</p>}
      </div>
    </>
  );
}
