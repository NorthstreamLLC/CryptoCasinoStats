"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/article";

/** "On this page" list that highlights the section being read. */
export function Toc({ items, title = "On this page" }: { items: TocItem[]; title?: string }) {
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-90px 0px -65% 0px" }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [items]);
  if (!items.length) return null;
  return (
    <nav aria-label={title}>
      <p className="ccs-eyebrow">{title}</p>
      <ol className="mt-3 grid gap-0.5 border-l border-border">
        {items.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              aria-current={active === i.id ? "true" : undefined}
              className={`-ml-px block border-l-2 py-1.5 pl-3 text-sm leading-snug transition ${active === i.id ? "border-accent font-semibold text-text-primary" : "border-transparent text-text-muted hover:text-text-primary"}`}
            >
              {i.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
