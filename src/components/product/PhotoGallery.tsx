"use client";

import { useState } from "react";
import Image from "next/image";
import { asset } from "@/lib/asset";

/** Fotoğraflı ürünler için büyük görsel + küçük resimler */
export function PhotoGallery({ images, alt, cover = false }: { images: string[]; alt: string; cover?: boolean }) {
  const [active, setActive] = useState(0);
  return (
    <div className="space-y-3">
      <div className={`relative overflow-hidden rounded-3xl ${cover ? "aspect-[4/3] bg-linen" : "aspect-square bg-white"}`}>
        <Image
          src={asset(images[active])}
          alt={alt}
          fill
          loading="eager"
          sizes="(min-width:1024px) 50vw, 100vw"
          className={cover ? "object-cover" : "object-contain p-[4%]"}
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`${i + 1}. görsel`}
              aria-current={i === active}
              className={`relative size-20 overflow-hidden rounded-xl bg-white ring-offset-2 transition ${i === active ? "ring-2 ring-ink" : "ring-1 ring-line hover:ring-ink/40"}`}
            >
              <Image src={asset(src)} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
