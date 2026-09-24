"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

/**
 * Scroll-snap tabanlı yatay kaydırıcı. Dokunmatikte doğal kaydırma,
 * masaüstünde önceki/sonraki düğmeleri ve ilerleme çubuğu.
 */
export function Carousel({
  children,
  label,
  itemClassName = "w-[78%] sm:w-[45%] lg:w-[30%]",
  tone = "light",
}: {
  children: React.ReactNode[];
  label: string;
  itemClassName?: string;
  tone?: "light" | "dark";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft > max - 8 });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  const btn = `grid size-12 place-items-center rounded-full border transition-colors disabled:opacity-30 ${
    tone === "dark" ? "border-paper/30 text-paper hover:bg-paper hover:text-ink" : "border-ink/20 hover:bg-ink hover:text-paper"
  }`;

  return (
    <div role="region" aria-roledescription="kaydırıcı" aria-label={label}>
      <div ref={ref} onScroll={update} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0">
        {children.map((child, i) => (
          <div key={i} className={`shrink-0 snap-start ${itemClassName}`}>
            {child}
          </div>
        ))}
      </div>
      <div className="mt-8 flex items-center gap-6">
        <div className={`h-px flex-1 ${tone === "dark" ? "bg-paper/20" : "bg-line"}`}>
          <div
            className={`h-px ${tone === "dark" ? "bg-gold" : "bg-ink"} transition-[width] duration-300`}
            style={{ width: `${Math.max(12, progress * 100)}%` }}
          />
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => scroll(-1)} disabled={edges.start} className={btn} aria-label="Önceki">
            <Icon name="chevron-left" />
          </button>
          <button type="button" onClick={() => scroll(1)} disabled={edges.end} className={btn} aria-label="Sonraki">
            <Icon name="chevron-right" />
          </button>
        </div>
      </div>
    </div>
  );
}
