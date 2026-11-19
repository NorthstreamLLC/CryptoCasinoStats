import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-section">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm text-text-muted sm:grid-cols-3">
        <div>
          <p className="font-semibold text-text-primary">Crypto Casino Stats</p>
          <p className="mt-2 max-w-xs">Crypto casino deposit volumes, wallet balances, RTP readings and slot data, each figure shown with its source and date.</p>
        </div>
        <nav aria-label="Site" className="flex flex-col gap-2">
          <Link href="/casinos/" className="hover:text-text-primary">Casino Stats</Link>
          <Link href="/top-slots/" className="hover:text-text-primary">Slot Stats</Link>
          <Link href="/reports/" className="hover:text-text-primary">Weekly reports</Link>
          <Link href="/category/uncategorized/" className="hover:text-text-primary">Analysis</Link>
          <Link href="/methodology/" className="hover:text-text-primary">Methodology and sources</Link>
        </nav>
        <nav aria-label="Legal" className="flex flex-col gap-2">
          <Link href="/affiliate-disclosure/" className="hover:text-text-primary">Affiliate disclosure</Link>
          <Link href="/responsible-gambling/" className="hover:text-text-primary">Responsible gambling</Link>
          <Link href="/feed/" className="hover:text-text-primary">RSS feed</Link>
        </nav>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-text-dim">
          18+ only. Gambling involves risk and no figure on this site predicts a result. We earn a commission when you sign up through some links;
          it does not change any figure we publish. <Link href="/affiliate-disclosure/" className="underline">How we make money</Link>.
        </p>
      </div>
    </footer>
  );
}
