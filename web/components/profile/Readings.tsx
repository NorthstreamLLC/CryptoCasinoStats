import { RtpStatusBadge } from "@/components/RtpStatusBadge";
import { fmtRtp, SOURCE_LABEL } from "@/lib/slots";
import type { CasinoProfileData } from "@/lib/casino-profile";

/** Every RTP reading at this casino as a dot against the studio figure, on a fixed 94–97% scale. */
export function Readings({ p }: { p: CasinoProfileData }) {
  const lo = 94, hi = 97;
  const pos = (v: number) => `${Math.min(100, Math.max(0, ((v - lo) / (hi - lo)) * 100))}%`;
  const matches = p.readings.filter((r) => Math.abs(r.rtp - r.publishedRtp) < 0.05).length;
  return (
    <div className="ccs-card overflow-hidden">
      <div className="flex flex-col gap-1 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-text-primary">
          {matches} of {p.readings.length} slots run the studio&apos;s published RTP at {p.o.name}
        </p>
        <RtpStatusBadge />
      </div>
      <ul>
        {p.readings.map((r) => (
          <li key={r.id} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 border-t border-row-divider px-5 py-3 first:border-t-0 sm:grid-cols-[12rem_1fr_6rem]">
            <span className="truncate font-medium text-text-primary">{r.name}</span>
            <span className="ccs-num text-right font-semibold text-accent-bright sm:order-last">{fmtRtp(r.rtp)}</span>
            <span role="img" className="relative col-span-2 h-4 sm:col-span-1" aria-label={`${fmtRtp(r.rtp)} at ${p.o.name}, studio ${fmtRtp(r.publishedRtp)}, ${SOURCE_LABEL[r.source]}`}>
              <span className="absolute inset-x-0 top-1/2 h-px bg-border" />
              <span className="absolute top-0 h-4 w-px bg-accent/60" style={{ left: pos(r.publishedRtp) }} />
              <span className="ccs-dot absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ left: pos(r.rtp) }} />
            </span>
          </li>
        ))}
      </ul>
      <p className="border-t border-border px-5 py-3 text-xs text-text-dim">Dot: RTP {p.o.name} showed for its copy (game page or in-game paytable). Line: studio&apos;s published RTP.</p>
    </div>
  );
}
