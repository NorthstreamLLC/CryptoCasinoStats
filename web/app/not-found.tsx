import Link from "next/link";
import { DocHero } from "@/components/doc/DocHero";

export default function NotFound() {
  return (
    <DocHero eyebrow={<span>404 · Not found</span>} title="That page isn't here." lede="It may have moved when the site was rebuilt. The numbers are all still a click away.">
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="ccs-btn-primary">Home</Link>
        <Link href="/casinos/" className="ccs-btn-ghost">Casino stats</Link>
        <Link href="/top-slots/" className="ccs-btn-ghost">Slot stats</Link>
      </div>
    </DocHero>
  );
}
