"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { asset } from "@/lib/asset";

export type HeroSlide = {
  texture: string;
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

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = useCallback((i: number) => setIndex((i + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => go(index + 1), DURATION);
    return () => clearTimeout(t);
  }, [index, paused, go]);

  const slide = slides[index];
  const dark = slide.tone === "dark";

  return (
    <section
      aria-roledescription="vitrin"
      aria-label="Öne çıkanlar"
      className="relative isolate h-[calc(100svh-113px)] min-h-[560px] max-h-[860px] overflow-hidden bg-night"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
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
            <Image src={asset(`/textures/${s.texture}.webp`)} alt="" fill preload={i === 0} sizes="100vw" className="object-cover" />
          </div>
          <div
            className={`absolute inset-0 ${
              s.tone === "dark"
                ? "bg-gradient-to-t from-night/90 via-night/50 to-night/10 md:bg-gradient-to-r md:from-night/85 md:via-night/40 md:to-transparent"
                : "bg-gradient-to-t from-paper/95 via-paper/70 to-paper/20 md:bg-gradient-to-r md:from-paper/90 md:via-paper/55 md:to-transparent"
            }`}
          />
          {s.ink && (
            <Image
              src={asset("/brand/ink.webp")}
              alt=""
              width={900}
              height={889}
              loading={i === 0 ? "eager" : "lazy"}
              className="pointer-events-none absolute -right-28 top-[4%] w-[85vw] max-w-none opacity-45 mix-blend-screen md:-right-24 md:top-1/2 md:w-[62vh] md:-translate-y-1/2 md:opacity-90 lg:right-[6%]"
            />
          )}
        </div>
      ))}

      <div className="container-page relative flex h-full flex-col justify-end pb-24 md:justify-center md:pb-0">
        <div key={index} className={`max-w-2xl space-y-6 ${dark ? "text-paper" : "text-ink"}`}>
          <p className={`animate-fade-up text-[11px] font-medium uppercase tracking-(--tracking-brand) ${dark ? "text-gold-soft" : "text-amethyst-700"}`}>
            {slide.eyebrow}
          </p>
          <h1 className="animate-fade-up text-5xl leading-[1.02] [animation-delay:120ms] md:text-7xl xl:text-[5.5rem]">
            {slide.title[0]}
            <em className={dark ? "text-amethyst-300" : "text-amethyst-700"}>{slide.title[1]}</em>
            {slide.title[2]}
          </h1>
          <p className={`max-w-lg animate-fade-up text-lg [animation-delay:240ms] ${dark ? "text-paper/75" : "text-ink-soft"}`}>{slide.text}</p>
          <div className="flex animate-fade-up flex-wrap gap-3 [animation-delay:360ms]">
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
      <div className={`absolute inset-x-0 bottom-0 ${dark ? "text-paper" : "text-ink"}`}>
        <div className="container-page flex items-end justify-between gap-6 pb-8">
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
