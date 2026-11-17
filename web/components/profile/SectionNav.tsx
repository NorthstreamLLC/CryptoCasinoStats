"use client";

import { useEffect, useState } from "react";

/** Sticky in-page navigation that tracks which section is on screen. */
export function SectionNav({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  // Sit directly under the site header, whose height changes when its nav wraps on phones.
  const [top, setTop] = useState(61);
  useEffect(() => {
    const h = document.querySelector("header");
    if (!h) return;
    const set = () => setTop(h.getBoundingClientRect().height);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(h);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-120px 0px -60% 0px" }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [items]);
  return (
    <nav aria-label="On this page" style={{ top }} className="sticky z-20 border-b border-border bg-page/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2">
        {items.map((i) => (
          <a
            key={i.id}
            href={`#${i.id}`}
            aria-current={active === i.id ? "true" : undefined}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${active === i.id ? "bg-accent-wash-strong text-accent-bright" : "text-text-muted hover:text-text-primary"}`}
          >
            {i.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
