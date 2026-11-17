import { atAGlance, specGroups, shortFact } from "@/lib/casinos";
import { Cite, H2, Card } from "./ui";
import type { Operator } from "@/lib/types";

/** The casino's key terms at a glance, then its published facts by group, each linked to the casino's own page. */
export function CasinoFacts({ o }: { o: Operator }) {
  const g = atAGlance(o);
  const groups = specGroups(o.slug);
  const tiles: [string, string, string?][] = [
    ["KYC", g.kyc?.label ?? "Not classified", g.kyc?.why],
    ["Withdrawal time", g.withdrawal.label, g.withdrawal.caption === "stated" ? `As stated by ${o.name}` : g.withdrawal.caption],
    ["Bonus wagering", g.wagering.charAt(0).toUpperCase() + g.wagering.slice(1)],
    ["Licence", g.licence],
    ["Coins (leading)", g.coins.length ? g.coins.slice(0, 10).join(", ") : "Not on file"],
  ];
  if (g.bonus) tiles.splice(3, 0, ["Standing offer", g.bonus]);
  return (
    <section>
      <H2 id="at-a-glance">{o.name} at a glance</H2>
      <div className="grid gap-px overflow-hidden rounded-[14px] border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map(([k, v, note]) => (
          <div key={k} className="bg-surface p-4">
            <div className="text-xs font-semibold text-text-dim-2">{k}</div>
            <div className="mt-1 font-semibold text-text-primary">{v}</div>
            {note && <div className="mt-1 text-xs text-text-muted">{note}</div>}
          </div>
        ))}
      </div>
      {groups.length > 0 && (
        <>
          <H2 id="facts">{o.name} facts, from {o.name}&apos;s own pages</H2>
          <p className="mb-4 max-w-3xl text-sm text-text-muted">Each fact is summarised from the casino&apos;s own published terms or help pages; follow the source link for the full wording.</p>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {groups.map((grp) => (
              <Card key={grp.title} className="min-w-0">
                <h3 className="mb-3 font-semibold">{grp.title}</h3>
                <dl className="grid gap-3 text-sm">
                  {grp.facts.map((f) => (
                    <div key={f.label}>
                      <dt className="text-xs text-text-dim-2">{f.label}</dt>
                      <dd className="text-text-secondary">{shortFact(f)}</dd>
                      {f.sourceUrl && <Cite source="Source" href={f.sourceUrl} asOf={f.asOf} />}
                    </div>
                  ))}
                </dl>
              </Card>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
