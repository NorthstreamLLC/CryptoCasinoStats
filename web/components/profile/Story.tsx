import { Inline } from "@/components/ui";

/** The hand-written casino copy carried over from the old site (Stake, Roobet, Razed), shown as written. */
export function Story({ why, highlights }: { why: string; highlights: [string, string, string][] }) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
      <p className="text-lg leading-relaxed text-text-secondary">
        <Inline text={why} />
      </p>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {highlights.map(([icon, title, body]) => (
          <li key={title} className="ccs-card min-w-0 p-5">
            <span aria-hidden className="text-xl">{icon}</span>
            <p className="mt-2 font-semibold text-text-primary">{title}</p>
            {body && <p className="mt-1 text-sm text-text-muted">{body}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
