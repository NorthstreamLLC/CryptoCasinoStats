import Link from "next/link";

const STEPS = [
  ["Read the primary source", "On-chain trackers for money flows, each casino's own terms and help pages for its rules, the in-game paytable for RTP."],
  ["Link it and date it", "Every figure on the site carries its source link and the day it was read, so you can check it yourself."],
  ["Re-check on a schedule", "On-chain figures weekly, RTP readings monthly. Anything older is labelled, and corrections are logged."],
];

export function TrustSteps({ facts, casinos }: { facts: number; casinos: number }) {
  return (
    <div className="ccs-card overflow-hidden">
      <ol className="grid divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
        {STEPS.map(([t, d], i) => (
          <li key={t} className="p-6 sm:p-8">
            <span className="ccs-num flex h-9 w-9 items-center justify-center rounded-full border border-accent/40 text-sm font-semibold text-accent">{i + 1}</span>
            <h3 className="mt-4 text-lg font-semibold text-text-primary">{t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">{d}</p>
          </li>
        ))}
      </ol>
      <div className="flex flex-col gap-4 border-t border-border bg-section px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="text-sm text-text-secondary">
          <span className="ccs-num font-semibold text-text-primary">{facts.toLocaleString("en-US")}</span> casino facts linked to their source across{" "}
          <span className="ccs-num font-semibold text-text-primary">{casinos}</span> casinos. Figures without a source: <span className="ccs-num font-semibold text-accent">0</span>.
        </p>
        <div className="flex gap-4 text-sm font-semibold">
          <Link href="/methodology/" className="text-accent hover:underline">Methodology →</Link>
          <Link href="/affiliate-disclosure/" className="text-text-secondary hover:text-text-primary">How we make money</Link>
        </div>
      </div>
    </div>
  );
}
