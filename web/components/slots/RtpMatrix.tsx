import Link from "next/link";
import { fmtDate } from "@/lib/site";
import type { rtpMatrix } from "@/lib/slot-page";

type M = ReturnType<typeof rtpMatrix>;

/**
 * Slots × casinos. Each cell is the RTP that casino showed for its own copy:
 * green when it matches the studio's published figure, amber when lower, a
 * dash when not read. The first column stays put while the grid scrolls.
 */
export function RtpMatrix({ m }: { m: M }) {
  return (
    <div className="ccs-card overflow-hidden">
      <div className="flex flex-col gap-2 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-text-primary">
          {m.matching} of {m.total} readings match the studio&apos;s published RTP
        </p>
        <div className="flex items-center gap-4 text-xs text-text-dim">
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-accent/70" /> Matches studio</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-warning" /> Lower</span>
          <span>Read {fmtDate(m.lastRead)}</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <caption className="sr-only">RTP each casino showed for its own copy of each slot, against the studio&apos;s published RTP</caption>
          <thead>
            <tr>
              <th scope="col" className="sticky left-0 z-10 bg-surface px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-dim">Slot</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-dim">Studio</th>
              {m.casinos.map((c) => (
                <th key={c.slug} scope="col" className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-dim">
                  <Link href={c.path} className="hover:text-accent">{c.name}</Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {m.rows.map((r) => (
              <tr key={r.slug} className="border-t border-row-divider">
                <th scope="row" className="sticky left-0 z-10 bg-surface px-5 py-3 text-left font-semibold text-text-primary">{r.name}</th>
                <td className="ccs-num px-3 py-3 text-text-secondary">{r.provider != null ? `${r.provider.toFixed(2)}%` : "—"}</td>
                {r.cells.map((c, i) => (
                  <td key={i} className="px-1.5 py-1.5">
                    {c ? (
                      <span className={`ccs-num block rounded-md px-2 py-1.5 text-center font-semibold ${c.state === "lower" ? "bg-warning/20 text-warning" : "bg-accent-wash-strong text-accent-bright"}`}>{c.rtp.toFixed(2)}%</span>
                    ) : (
                      <span className="block text-center text-text-dim">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
