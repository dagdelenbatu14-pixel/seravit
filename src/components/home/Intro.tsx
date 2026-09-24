"use client";

import { useEffect, useState } from "react";
import { INK_RECT, WORDMARK_PATHS } from "@/components/brand/logo-paths";
import { asset } from "@/lib/asset";

const KEY = "seravit:intro";
const TOTAL_MS = 3600;
const TILES = 24; // mobil 3×8, masaüstü 6×4

/** Altın zerreler (sabit tohum → sunucu/istemci aynı çıktı) */
const sparks = Array.from({ length: 14 }, (_, i) => {
  const a = (i * 137.5 * Math.PI) / 180;
  const r = 18 + ((i * 29) % 30);
  return { x: 50 + Math.cos(a) * r, y: 50 + Math.sin(a) * r * 0.7, d: 1100 + ((i * 97) % 900), s: 2 + (i % 3) };
});

/**
 * İlk ziyarette açılış: mürekkep açılır, wordmark çizilir, siyah karo duvarı
 * karo karo kalkarak siteyi açar. Oturum başına bir kez; "hareketi azalt"
 * tercihinde gösterilmez. Tekrar ziyarette <html data-intro="seen"> ile anında gizlenir.
 */
export function Intro() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const finish = () => {
      document.documentElement.dataset.intro = "seen";
      setGone(true);
    };
    if (document.documentElement.dataset.intro === "seen") {
      const t = setTimeout(finish, 0);
      return () => clearTimeout(t);
    }
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
    const t = setTimeout(finish, TOTAL_MS);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  return (
    <div className="intro" aria-hidden="true">
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-8 md:grid-cols-6 md:grid-rows-4">
        {Array.from({ length: TILES }, (_, i) => (
          <span
            key={i}
            className="intro-tile"
            style={
              {
                "--dm": `${(Math.floor(i / 3) + (i % 3)) * 45}ms`,
                "--dd": `${(Math.floor(i / 6) + (i % 6)) * 60}ms`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="intro-brand absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-paper">
        <div className="relative w-[min(86vw,720px)]">
          {sparks.map((p, i) => (
            <span
              key={i}
              className="intro-spark"
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, animationDelay: `${p.d}ms` }}
            />
          ))}
          <svg viewBox="130 310 815 430" className="relative w-full overflow-visible">
            <image
              className="intro-ink"
              href={asset("/brand/ink.webp")}
              x={INK_RECT.x}
              y={INK_RECT.y}
              width={INK_RECT.width}
              height={INK_RECT.height}
              preserveAspectRatio="none"
            />
            <g className="intro-word">
              {WORDMARK_PATHS.map((d, i) => (
                <path key={i} d={d} pathLength={1} style={{ animationDelay: `${550 + i * 90}ms, ${1500 + i * 40}ms` }} />
              ))}
            </g>
          </svg>
        </div>
        <p className="intro-tag text-center text-[11px] uppercase text-paper/80 md:text-sm">Seramik · Vitrifiye · Bodrum</p>
      </div>

      <button
        type="button"
        onClick={() => {
          document.documentElement.dataset.intro = "seen";
          setGone(true);
        }}
        className="absolute bottom-6 right-6 z-10 rounded-full border border-paper/25 px-4 py-2 text-xs uppercase tracking-(--tracking-brand) text-paper/70 transition-colors hover:border-paper hover:text-paper"
        tabIndex={-1}
      >
        Geç
      </button>
    </div>
  );
}
