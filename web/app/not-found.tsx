import Link from "next/link";
import { Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="max-w-2xl py-20 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-text-muted">That page does not exist. Try the casino stats or slot stats instead.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/casinos/" className="rounded-lg bg-accent px-4 py-2 font-semibold text-page">Casino stats</Link>
        <Link href="/top-slots/" className="rounded-lg border border-border-strong px-4 py-2 font-semibold">Slot stats</Link>
      </div>
    </Container>
  );
}
