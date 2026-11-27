import Link from "next/link";
import { fmtDate } from "@/lib/site";
import { pct, big, type Report } from "@/lib/history";

/** The latest weekly report in one band: total, change, top movers, link to the full report. */
export function WeekBand({ r }: { r: Report }) {
  const t = r.totals;
  const movers = [...r.risers.slice(0, 2), ...r.fallers.slice(0, 2)];
  return (
    <section className="border-y border-border bg-section">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-6 px-4 py-10 lg:grid-cols-[1fr_1.6fr_auto]">
        <div>
          <p className="ccs-eyebrow">Weekly report · {fmtDate(r.date)}</p>
          <p className="mt-2 text-text-secondary">
            <span className="ccs-num text-2xl font-semibold text-text-primary">{big(t.freshDeposits)}</span> in 30-day deposits, {t.fresh} casinos
            {t.comparable ? <span className="ccs-num ml-2 font-semibold text-text-primary">{pct(t.deposits / t.prevDeposits - 1)}</span> : null}
          </p>
          {t.comparable ? <p className="mt-1 text-xs text-text-dim">Like for like: {t.comparable} casinos since {fmtDate(r.window!.from)} ({r.window!.days} days)</p> : <p className="mt-1 text-xs text-text-dim">No like-for-like change this time</p>}
        </div>
        <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {movers.map((m) => (
            <li key={m.slug} className="shrink-0">
              <Link href={m.path} className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-page px-3.5 py-2 text-sm hover:border-accent">
                <span className="font-semibold text-text-primary">{m.name}</span>
                <span className={`ccs-num font-semibold ${m.change! > 0 ? "text-accent-bright" : "text-warning"}`}>{pct(m.change)}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href={`/reports/${r.date}/`} className="ccs-btn-ghost shrink-0">Read the report →</Link>
      </div>
    </section>
  );
}
