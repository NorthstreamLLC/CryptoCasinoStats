import Link from "next/link";

const SOURCES = ["FairGambling", "Tanzanite", "Casino help centres", "Studio game data", "In-game paytables"];

export function SourceStrip() {
  return (
    <div className="border-b border-border bg-section">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="ccs-eyebrow">Sourced from</span>
          {SOURCES.map((s) => (
            <span key={s} className="text-sm font-semibold tracking-tight text-text-muted">{s}</span>
          ))}
        </div>
        <Link href="/methodology/" className="shrink-0 text-sm font-semibold text-accent hover:underline">How we check →</Link>
      </div>
    </div>
  );
}
