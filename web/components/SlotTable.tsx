import { getGame, readingAt, fmtRtp, fmtX, SOURCE_LABEL } from "@/lib/slots";
import { fmtDate } from "@/lib/site";
import { TableWrap, th, td } from "./ui";

/**
 * Slots at one casino. "Provider RTP" is the studio's published default;
 * "RTP at <casino>" is what that casino showed for its own copy, with the date
 * and where it was read. A blank reading means we have not read it there yet.
 */
export function SlotTable({ slugs, operator, operatorName }: { slugs: string[]; operator?: string; operatorName?: string }) {
  const rows = slugs.map((s) => ({ s, g: getGame(s), r: operator ? readingAt(s, operator) : null }));
  return (
    <TableWrap
      caption={
        <>
          Provider RTP, volatility and max win: studio-published figures via the slotessentials.com game catalogue.
          {operator ? ` RTP at ${operatorName}: read on ${operatorName}'s own game page or paytable on the date shown.` : ""}
        </>
      }
    >
      <thead>
        <tr>
          <th className={th}>Slot</th>
          <th className={th}>Max win</th>
          <th className={th}>Volatility</th>
          <th className={th}>Provider RTP</th>
          {operator && <th className={th}>RTP at {operatorName}</th>}
        </tr>
      </thead>
      <tbody>
        {rows.map(({ s, g, r }) => (
          <tr key={s}>
            <td className={`${td} font-medium text-text-primary`}>{g?.name ?? s}</td>
            <td className={td}>{fmtX(g?.maxWinMultiplier)}</td>
            <td className={`${td} capitalize`}>{g?.volatility ?? "—"}</td>
            <td className={td}>{fmtRtp(g?.rtp)}</td>
            {operator && (
              <td className={td}>
                {r ? (
                  <>
                    <span className="font-semibold text-text-primary">{fmtRtp(r.rtp)}</span>
                    <span className="block text-xs text-text-dim">
                      {SOURCE_LABEL[r.source]}, {fmtDate(r.checkedAt)}
                    </span>
                  </>
                ) : (
                  <span className="text-text-dim">Not read yet</span>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </TableWrap>
  );
}
