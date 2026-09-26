"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Icon } from "@/components/ui/Icon";
import { asset } from "@/lib/asset";

export type HeroSlide = {
  /** Doku adı (public/textures) — `image` yoksa arka plan */
  texture: string;
  /** Fotoğraf arka plan (public/ altı yol); varsa dokunun yerine geçer */
  image?: string;
  tone: "dark" | "light";
  eyebrow: string;
  /** [önce, italik vurgu, sonra] */
  title: [string, string, string];
  text: string;
  cta: { href: string; label: string };
  cta2?: { href: string; label: string };
  /** Qua tarzı: sağ altta koleksiyon + ebat */
  caption: string;
  ink?: boolean;
};

const DURATION = 7000;
/** Açılış animasyonu oynarken ilk slayta eklenen süre */
const INTRO_MS = 3600;

/** Yükselen altın zerreler (sabit tohum) */
const flecks = Array.from({ length: 18 }, (_, i) => ({
  left: (i * 53) % 100,
  bottom: (i * 17) % 40,
  size: 2 + (i % 3),
  dur: 7 + ((i * 7) % 6),
  delay: -((i * 1.3) % 9),
}));

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const go = useCallback(
    (i: number) => {
      setAdvanced(true);
      setIndex((i + slides.length) % slides.length);
    },
    [slides.length],
  );

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const introPlaying = !advanced && document.documentElement.dataset.intro !== "seen";
    const t = setTimeout(() => go(index + 1), DURATION + (introPlaying ? INTRO_MS : 0));
    return () => clearTimeout(t);
  }, [index, paused, go, advanced]);

  /** İmleç konumu → CSS değişkenleri (ışık ve paralaks; yeniden render yok) */
  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const el = sectionRef.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    el.style.setProperty("--px", `${(x - 0.5).toFixed(3)}`);
    el.style.setProperty("--py", `${(y - 0.5).toFixed(3)}`);
  };

  const slide = slides[index];
  const dark = slide.tone === "dark";

  return (
    <section
      ref={sectionRef}
      onPointerMove={onPointerMove}
      aria-roledescription="vitrin"
      aria-label="Öne çıkanlar"
      className="relative isolate flex min-h-[max(560px,calc(100svh-113px))] flex-col overflow-hidden bg-night md:max-h-[900px]"
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((s, i) => (
        <div
          key={s.texture}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0"}`}
        >
          <div className={`absolute inset-0 ${i === index ? "animate-kenburns" : ""}`}>
            <Image src={asset(s.image ?? `/textures/${s.texture}.webp`)} alt="" fill preload={i === 0} sizes="100vw" className="object-cover" />
          </div>
          <div
            className={`absolute inset-0 ${
              s.tone === "dark"
                ? "bg-gradient-to-t from-night/90 via-night/55 to-night/15 md:bg-gradient-to-r md:from-night/90 md:via-night/50 md:to-night/5"
                : s.image
                  ? "bg-gradient-to-t from-paper/95 via-paper/60 to-transparent md:bg-gradient-to-r md:from-paper/85 md:via-paper/35 md:to-transparent"
                  : "bg-gradient-to-t from-paper/95 via-paper/70 to-paper/20 md:bg-gradient-to-r md:from-paper/90 md:via-paper/55 md:to-transparent"
            }`}
          />
          {/* Karo duvarı derzleri (yalnız doku arka planlarda) */}
          {!s.image && (
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(90deg, ${s.tone === "dark" ? "rgba(255,255,255,.07)" : "rgba(255,255,255,.6)"} 1px, transparent 1px), linear-gradient(180deg, ${s.tone === "dark" ? "rgba(255,255,255,.07)" : "rgba(255,255,255,.6)"} 1px, transparent 1px)`,
              backgroundSize: "clamp(160px, 16vw, 260px) clamp(320px, 32vw, 520px)",
            }}
          />
          )}
          {s.ink && (
            <>
              {/* Dev wordmark filigranı */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-[5%] top-[5%] w-[90vw] text-paper/90 md:left-auto md:right-[5%] md:top-auto md:bottom-[15%] md:w-[42vw]"
                style={{ filter: "drop-shadow(0 2px 10px rgba(0,0,0,.75)) drop-shadow(0 0 1px rgba(0,0,0,.9))" }}
              >
                <Logo ink={false} tagline={false} className="w-full [&_path]:stroke-gold-soft/70 [&_path]:[stroke-width:1.2]" />
              </div>
              <div
                className="pointer-events-none absolute inset-0 transition-transform duration-700 ease-out"
                style={{ transform: "translate3d(calc(var(--px, 0) * -40px), calc(var(--py, 0) * -30px), 0)" }}
              >
                <Image
                  src={asset("/brand/ink.webp")}
                  alt=""
                  width={900}
                  height={889}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="absolute -right-28 top-[4%] w-[85vw] max-w-none animate-[breathe_14s_ease-in-out_infinite] opacity-45 mix-blend-screen md:-right-24 md:top-1/2 md:w-[62vh] md:-translate-y-1/2 md:opacity-90 lg:right-[6%]"
                />
              </div>
              {/* Yükselen altın zerreler */}
              <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                {flecks.map((f, k) => (
                  <span
                    key={k}
                    className="absolute rounded-full bg-gold-soft shadow-[0_0_8px_1px_rgba(231,200,115,.6)]"
                    style={{
                      left: `${f.left}%`,
                      bottom: `${f.bottom}%`,
                      width: f.size,
                      height: f.size,
                      animation: `float-up ${f.dur}s linear ${f.delay}s infinite`,
                    }}
                  />
                ))}
              </div>
            </>
          )}
          {/* İmleci takip eden showroom ışığı */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden md:block"
            style={{
              background: `radial-gradient(560px circle at var(--mx, 72%) var(--my, 42%), ${s.tone === "dark" ? "rgba(255,240,255,.10)" : "rgba(255,255,255,.35)"}, transparent 65%)`,
            }}
          />
        </div>
      ))}

      <div className="container-page relative flex flex-1 flex-col justify-end pb-6 pt-10 md:justify-center md:pt-12">
        <div key={index} className={`max-w-2xl space-y-5 md:space-y-6 ${dark ? "text-paper" : "text-ink"} ${advanced ? "" : "hero-first"}`}>
          <p className={`animate-fade-up text-[11px] font-medium uppercase tracking-(--tracking-brand) ${dark ? "text-gold-soft" : "text-amethyst-700"}`}>
            {slide.eyebrow}
          </p>
          <h1 style={{ "--d": "120ms" } as React.CSSProperties} className="animate-fade-up text-5xl leading-[1.02] [animation-delay:120ms] md:text-[clamp(3rem,8.2svh,5.5rem)]">
            {slide.title[0]}
            <em className={dark ? "text-amethyst-300" : "text-amethyst-700"}>{slide.title[1]}</em>
            {slide.title[2]}
          </h1>
          <p style={{ "--d": "240ms" } as React.CSSProperties} className={`max-w-lg animate-fade-up text-lg [animation-delay:240ms] ${dark ? "text-paper/75" : "text-ink-soft"}`}>{slide.text}</p>
          <div style={{ "--d": "360ms" } as React.CSSProperties} className="flex animate-fade-up flex-wrap gap-3 [animation-delay:360ms]">
            <Link href={slide.cta.href} className={dark ? "btn-light" : "btn-primary"}>
              {slide.cta.label}
              <Icon name="arrow-right" className="size-4" />
            </Link>
            {slide.cta2 && (
              <Link href={slide.cta2.href} className={dark ? "btn-outline-light" : "btn-outline"}>
                {slide.cta2.label}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Kontroller */}
      <div className={`relative ${dark ? "text-paper" : "text-ink"}`}>
        <div className="container-page flex items-end justify-between gap-6 pb-6 md:pb-8">
          <div className="flex items-center gap-5">
            <span className="font-display text-sm tabular-nums">
              {String(index + 1).padStart(2, "0")} <span className="opacity-40">/ {String(slides.length).padStart(2, "0")}</span>
            </span>
            <div className="flex gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.texture}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`${i + 1}. görsel`}
                  aria-current={i === index}
                  className="relative h-8 w-10 sm:w-14"
                >
                  <span className={`absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 ${dark ? "bg-paper/25" : "bg-ink/20"}`} />
                  <span
                    key={i === index ? `a${index}` : "i"}
                    className={`absolute left-0 top-1/2 h-0.5 -translate-y-1/2 ${dark ? "bg-paper" : "bg-ink"} ${
                      i === index ? (paused ? "w-full" : "w-0 animate-[grow_7s_linear_forwards]") : i < index ? "w-full" : "w-0"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="hidden border-l border-current/30 pl-5 text-[11px] uppercase tracking-(--tracking-brand) opacity-80 lg:block">{slide.caption}</p>
            <div className="hidden gap-1 sm:flex">
              <button type="button" onClick={() => go(index - 1)} className="grid size-9 place-items-center rounded-full hover:bg-current/10" aria-label="Önceki">
                <Icon name="chevron-left" className="size-4" />
              </button>
              <button type="button" onClick={() => go(index + 1)} className="grid size-9 place-items-center rounded-full hover:bg-current/10" aria-label="Sonraki">
                <Icon name="chevron-right" className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
