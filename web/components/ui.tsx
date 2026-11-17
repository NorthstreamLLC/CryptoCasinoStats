import Link from "next/link";
import type { ReactNode } from "react";
import { fmtDate } from "@/lib/site";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-6xl px-4 ${className}`}>{children}</div>;
}

export function Hero({ title, lede, children }: { title: string; lede?: ReactNode; children?: ReactNode }) {
  return (
    <section className="border-b border-border bg-surface-hero/40">
      <Container className="py-10 sm:py-14">
        <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-text-primary sm:text-5xl">{title}</h1>
        {lede && <p className="mt-4 max-w-2xl text-lg text-text-secondary">{lede}</p>}
        {children}
      </Container>
    </section>
  );
}

export function H2({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2 id={id} className="mb-3 mt-12 text-2xl font-bold tracking-tight text-text-primary">
      {children}
    </h2>
  );
}

/** A cited source: name, link, date. Every published figure carries one. */
export function Cite({ source, href, asOf, prefix = "" }: { source: string; href?: string; asOf?: string; prefix?: string }) {
  const body = (
    <>
      {prefix}
      {source}
      {href ? " ↗" : ""}
      {asOf ? ` · ${fmtDate(asOf)}` : ""}
    </>
  );
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer nofollow" className="text-xs text-text-dim underline-offset-2 hover:text-accent hover:underline">
      {body}
    </a>
  ) : (
    <span className="text-xs text-text-dim">{body}</span>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[14px] border border-border bg-surface p-5 ${className}`}>{children}</div>;
}

export function ButtonLink({ href, children, external = false }: { href: string; children: ReactNode; external?: boolean }) {
  const cls = "inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-page shadow-[var(--shadow-cta)] hover:bg-accent-bright";
  return external ? (
    <a href={href} rel="nofollow sponsored noopener" target="_blank" className={cls}>
      {children}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function TableWrap({ children, caption }: { children: ReactNode; caption?: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-[14px] border border-border">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        {caption && <caption className="caption-bottom px-4 py-3 text-left text-xs text-text-dim">{caption}</caption>}
        {children}
      </table>
    </div>
  );
}

export const th = "bg-surface-raised px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-dim-2";
export const td = "border-t border-row-divider px-4 py-3 align-top text-text-secondary";

/** Very small inline markdown: [label](href) links only, used in carried-over copy. */
export function Inline({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((p, i) => {
        const m = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        return m ? (
          <Link key={i} href={m[2]} className="text-accent hover:underline">
            {m[1]}
          </Link>
        ) : (
          <span key={i}>{p}</span>
        );
      })}
    </>
  );
}
