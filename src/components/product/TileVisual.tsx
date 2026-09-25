import Image from "next/image";
import type { Product } from "@/lib/types";
import { ProductIllustration } from "./ProductIllustration";
import { asset } from "@/lib/asset";

/** Fotoğrafında zaten derz / parke birleşimi olan dokular — üstüne ızgara çizilmez */
const JOINTED = new Set(["mese-dogal", "zellige-blanc", "aegean-mozaik"]);

/** "60×120" → derz ızgarası (240×240 cm'lik bir pencere varsayımıyla) */
function gridFor(size?: string) {
  if (!size) return null;
  const [a, b] = size.split("×").map((v) => parseFloat(v.replace(",", ".")));
  if (!a || !b || Math.min(a, b) < 15) return null; // mozaik/zellige dokusu zaten ızgaralı
  const window = Math.max(a, b) >= 120 ? 240 : 180;
  return { cols: Math.max(1, Math.round(window / a)), rows: Math.max(1, Math.round(window / b)) };
}

export function Texture({
  name,
  alt = "",
  sizes = "100vw",
  priority,
  className = "",
}: {
  name: string;
  alt?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  return <Image src={asset(`/textures/${name}.webp`)} alt={alt} fill sizes={sizes} loading={priority ? "eager" : undefined} className={`object-cover ${className}`} />;
}

/** Karo derz çizgileri (üstte katman) */
export function GroutGrid({ size, dark, texture }: { size?: string; dark?: boolean; texture?: string }) {
  const g = texture && JOINTED.has(texture) ? null : gridFor(size);
  if (!g) return null;
  const line = dark ? "rgba(0,0,0,.55)" : "rgba(255,255,255,.75)";
  const shade = dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.08)";
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: `linear-gradient(90deg, ${line} 1.5px, ${shade} 1.5px, transparent 3px), linear-gradient(180deg, ${line} 1.5px, ${shade} 1.5px, transparent 3px)`,
        backgroundSize: `${100 / g.cols}% ${100 / g.rows}%`,
      }}
    />
  );
}

type Visualizable = Pick<Product, "name" | "images" | "texture" | "icon" | "size" | "colorHex">;

/**
 * Ürün görseli. Öncelik: fotoğraf → prosedürel doku → teknik çizim.
 * `hoverLaid`: üzerine gelince derzli döşeme görünümüne geçer.
 */
export function TileVisual({
  product,
  mode = "closeup",
  hoverLaid,
  priority,
  sizes = "(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 80vw",
  className = "",
}: {
  product: Visualizable;
  mode?: "closeup" | "laid";
  hoverLaid?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const photo = product.images[0];
  const dark = product.colorHex ? parseInt(product.colorHex.slice(1, 3), 16) < 90 : false;

  return (
    <div className={`relative overflow-hidden bg-linen ${className}`}>
      {photo ? (
        <Image src={asset(photo)} alt={product.name} fill sizes={sizes} loading={priority ? "eager" : undefined} className="object-cover" />
      ) : product.texture ? (
        <>
          <div className={`absolute inset-0 transition-transform duration-700 ${mode === "closeup" ? "scale-150" : ""} ${hoverLaid ? "group-hover:scale-100" : ""}`}>
            <Texture name={product.texture} alt={product.name} sizes={sizes} priority={priority} />
          </div>
          <div className={`absolute inset-0 transition-opacity duration-500 ${mode === "laid" ? "opacity-100" : "opacity-0"} ${hoverLaid ? "group-hover:opacity-100" : ""}`}>
            <GroutGrid size={product.size} dark={dark} texture={product.texture} />
          </div>
        </>
      ) : product.icon ? (
        <div className="absolute inset-0 grid place-items-center bg-gradient-to-b from-white to-linen">
          <ProductIllustration icon={product.icon} className="w-1/2 text-ink/70 transition-transform duration-500 group-hover:scale-105" />
        </div>
      ) : null}
    </div>
  );
}
