import type { CasinoProfileData } from "@/lib/casino-profile";

/** Key terms as a scannable grid. Each value comes from the casino's own pages (sources in the Terms section). */
export function Glance({ p }: { p: CasinoProfileData }) {
  const g = p.glance;
  const items: { k: string; v: string; note?: string; tone?: "good" | "warn" }[] = [
    { k: "KYC", v: g.kyc?.label ?? "Not classified", note: g.kyc?.why, tone: g.kyc && /only if asked|never/i.test(g.kyc.label) ? "good" : undefined },
    { k: "Withdrawal time", v: g.withdrawal.label, note: g.withdrawal.caption === "stated" ? "As stated by the casino" : g.withdrawal.caption },
    { k: "Bonus wagering", v: g.wagering.charAt(0).toUpperCase() + g.wagering.slice(1) },
    ...(g.bonus ? [{ k: "Standing offer", v: g.bonus }] : []),
    { k: "Licence", v: g.licence || "Not on file" },
    { k: "Coins", v: g.coins.length ? g.coins.slice(0, 8).join(" · ") : "Not on file", note: g.coins.length > 8 ? `+${g.coins.length - 8} more` : undefined },
  ];
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((i) => (
        <div key={i.k} className="ccs-card min-w-0 p-5">
          <div className="ccs-eyebrow">{i.k}</div>
          <div className={`mt-2 text-lg font-semibold leading-snug ${i.tone === "good" ? "text-accent-bright" : "text-text-primary"}`}>{i.v}</div>
          {i.note && <p className="mt-2 text-sm text-text-muted">{i.note}</p>}
        </div>
      ))}
    </div>
  );
}
