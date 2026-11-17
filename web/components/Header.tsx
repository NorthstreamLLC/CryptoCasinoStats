import Link from "next/link";
import Image from "next/image";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/casinos/", label: "Casino Stats" },
  { href: "/top-slots/", label: "Slot Stats" },
  { href: "/category/uncategorized/", label: "Analysis" },
  { href: "/methodology/", label: "Methodology" },
];

export function Header() {
  return (
    <header className="border-b border-border bg-surface-header/80 backdrop-blur sticky top-0 z-30">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
        <Link href="/" className="flex items-center" aria-label="Crypto Casino Stats home">
          <Image src="/wp-content/uploads/2025/07/cropped-21.png" alt="Crypto Casino Stats" width={180} height={52} priority className="h-9 w-auto" />
        </Link>
        <nav aria-label="Main" className="-mx-1 flex max-w-full gap-1 overflow-x-auto text-sm">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="whitespace-nowrap rounded-md px-3 py-2 text-text-secondary hover:bg-row-hover hover:text-text-primary">
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
