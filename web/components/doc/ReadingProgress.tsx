"use client";

import { useEffect, useState } from "react";

/** A thin bar under the header showing how far through the article the reader is. */
export function ReadingProgress({ target = "article" }: { target?: string }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = document.querySelector(target);
    if (!el) return;
    const on = () => {
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      setP(total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, [target]);
  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-50 h-[3px]">
      <div className="h-full origin-left bg-accent" style={{ transform: `scaleX(${p})` }} />
    </div>
  );
}
