import { rtpStatus } from "@/lib/slots";
import { fmtDate } from "@/lib/site";

/** "Read 18 Sept · historical, re-check overdue" (amber) or "Read X · next check by Y". */
export function RtpStatusBadge({ className = "" }: { className?: string }) {
  const s = rtpStatus();
  if (!s.last) return null;
  return s.overdue ? (
    <span className={`inline-flex items-center gap-1.5 rounded-full border border-warning/40 bg-warning/10 px-2.5 py-1 text-xs font-semibold text-warning ${className}`}>
      Read {fmtDate(s.last)} · historical, re-check overdue
    </span>
  ) : (
    <span className={`inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs text-text-dim ${className}`}>
      Read {fmtDate(s.last)} · next check by {fmtDate(s.due)}
    </span>
  );
}
