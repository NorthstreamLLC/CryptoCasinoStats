"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A figure that counts up once when it scrolls into view. The final value is
 * what the server renders, so crawlers, no-JS readers and reduced-motion users
 * get the real number; the animation only runs on top of it.
 */
export function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const m = value.match(/^([^\d]*)([\d.,]+)(.*)$/);
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (!m || !ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const [, pre, num, post] = m;
    const target = parseFloat(num.replace(/,/g, ""));
    const decimals = (num.split(".")[1] ?? "").length;
    const el = ref.current;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const dur = 1100;
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          setShown(`${pre}${(target * eased).toFixed(decimals)}${post}`);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span ref={ref} className={className} aria-label={value}>
      <span aria-hidden>{shown}</span>
    </span>
  );
}
