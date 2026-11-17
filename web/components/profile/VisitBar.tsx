"use client";

import { useEffect, useState } from "react";

/** Phone-only bar with the casino's Visit button once the hero is out of view. */
export function VisitBar({ slug, name }: { slug: string; name: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const hero = document.querySelector(".ccs-hero");
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting));
    io.observe(hero);
    return () => io.disconnect();
  }, []);
  return (
    <div className={`fixed inset-x-3 bottom-3 z-40 transition duration-300 sm:hidden ${show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"}`} aria-hidden={!show}>
      <div className="flex items-center gap-3 rounded-2xl border border-border-strong bg-surface-header/95 p-2 pl-4 shadow-[var(--shadow-dropdown)] backdrop-blur">
        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-text-primary">{name}</span>
        <a href={`/go/${slug}/?p=profile-bar`} rel="nofollow sponsored" tabIndex={show ? 0 : -1} className="ccs-btn-primary !py-2.5 text-sm">Visit {name}</a>
      </div>
    </div>
  );
}
