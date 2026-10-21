"use client";

import { useState } from "react";
import Image from "next/image";
import { asset } from "@/lib/asset";

/**
 * Ürün galerisi: görseller kırpılmadan, kendi en-boy oranlarıyla gösterilir
 * (karo yüzeyi de mekân fotoğrafı da eksiksiz görünür).
 */
export function PhotoGallery({ images, alt, cover = false }: { images: string[]; alt: string; cover?: boolean }) {
  const [active, setActive] = useState(0);
  const [ratios, setRatios] = useState<Record<string, number>>({});
  const src = images[active];
  const ratio = ratios[src] ?? (cover ? 4 / 3 : 1);
  const measure = (img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth && img.naturalHeight) {
      const r = img.naturalWidth / img.naturalHeight;
      setRatios((m) => (m[src] === r ? m : { ...m, [src]: r }));
    }
  };

  return (
    <div className="space-y-3">
      <div
        className={`relative mx-auto w-full overflow-hidden rounded-3xl ${cover ? "bg-linen" : "bg-white"}`}
        style={{ aspectRatio: String(ratio), maxHeight: "78vh", maxWidth: `calc(78vh * ${ratio})` }}
      >
        <Image
          key={src}
          src={asset(src)}
          alt={alt}
          fill
          loading="eager"
          sizes="(min-width:1024px) 50vw, 100vw"
          className={cover ? "object-contain" : "object-contain p-[4%]"}
          ref={measure}
          onLoad={(e) => measure(e.currentTarget)}
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((s, i) => (
            <button
              key={s}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`${i + 1}. görsel`}
              aria-current={i === active}
              className={`relative size-20 overflow-hidden rounded-xl bg-white ring-offset-2 transition ${i === active ? "ring-2 ring-ink" : "ring-1 ring-line hover:ring-ink/40"}`}
            >
              <Image src={asset(s)} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
