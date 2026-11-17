"use client";

import { useEffect, useState } from "react";

/** Phone-only action bar that appears once the hero has scrolled away. */
export function StickyBar() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const hero = document.querySelector(".ccs-hero");
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting), { threshold: 0 });
    io.observe(hero);
    return () => io.disconnect();
  }, []);
  return (
    <div className={`fixed inset-x-3 bottom-3 z-40 transition duration-300 sm:hidden ${show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"}`} aria-hidden={!show}>
      <div className="flex gap-2 rounded-2xl border border-border-strong bg-surface-header/95 p-2 shadow-[var(--shadow-dropdown)] backdrop-blur">
        <a href="#finder" tabIndex={show ? 0 : -1} className="ccs-btn-primary flex-1 !py-2.5 text-center text-sm">Find a casino</a>
        <a href="#leaderboard" tabIndex={show ? 0 : -1} className="ccs-btn-ghost flex-1 !py-2.5 text-center text-sm">Leaderboard</a>
      </div>
    </div>
  );
}
