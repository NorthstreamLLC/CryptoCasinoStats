import data from "@/data/ccs/roobetKyc.json";
import { H2, Cite } from "./ui";

/** Roobet's verification rules as Roobet's Help Center states them (checked on the date shown). */
export function RoobetKyc() {
  return (
    <section>
      <H2 id="kyc">Roobet KYC: what Roobet publishes</H2>
      <p className="mb-4 max-w-3xl text-sm text-text-muted">
        Upload documents only inside your own Roobet account. No affiliate, streamer or community moderator can approve verification, and nobody legitimate needs your password, 2FA code or recovery key.
      </p>
      <div className="grid gap-px overflow-hidden rounded-[14px] border border-border bg-border sm:grid-cols-2">
        {data.facts.map((f) => (
          <div key={f.label} className="bg-surface p-4">
            <div className="text-xs font-semibold text-text-dim-2">{f.label}</div>
            <p className="mt-1 text-sm text-text-secondary">{f.value}</p>
            <Cite source={f.source} href={f.url} asOf={data.checkedAt} />
          </div>
        ))}
      </div>
    </section>
  );
}
