import Image from "next/image";
import { GroutGrid, Texture } from "@/components/product/TileVisual";
import { asset } from "@/lib/asset";

/**
 * Güral tarzı kompozisyon: büyük mekân/döşeme görseli + üstüne binen iki karo numunesi.
 * `room` (mekân fotoğrafı) ve `swatch` (karo yüzeyi) verilirse fotoğraflar, yoksa `texture` kullanılır.
 */
export function SwatchStack({
  texture,
  room,
  swatch,
  size = "60×120",
  flip,
  label,
}: {
  texture?: string;
  room?: string;
  swatch?: string;
  size?: string;
  flip?: boolean;
  label?: string;
}) {
  const pic = (src: string | undefined, sizes: string, className = "") =>
    src ? (
      <Image src={asset(src)} alt="" fill sizes={sizes} className={`object-cover ${className}`} />
    ) : texture ? (
      <Texture name={texture} sizes={sizes} className={className} />
    ) : null;
  const tile = swatch ?? room;
  return (
    <div className={`relative mx-auto aspect-[5/6] w-full max-w-lg ${flip ? "lg:ml-auto" : ""}`}>
      <div className={`absolute top-0 h-[82%] w-[78%] overflow-hidden rounded-sm bg-linen shadow-2xl shadow-night/20 ${flip ? "left-0" : "right-0"}`}>
        {pic(room ?? swatch, "(min-width:1024px) 40vw, 80vw")}
        {!room && <GroutGrid size={size} />}
      </div>
      <div className={`absolute bottom-[6%] h-[42%] w-[30%] overflow-hidden bg-linen shadow-xl shadow-night/25 ${flip ? "right-[6%]" : "left-0"}`}>
        {pic(tile, "200px", "scale-[2.2] object-[30%_60%]")}
      </div>
      <div className={`absolute bottom-0 h-[26%] w-[40%] overflow-hidden bg-linen shadow-xl shadow-night/25 ${flip ? "right-[26%]" : "left-[18%]"}`}>
        {pic(tile, "220px", "scale-[2] object-[70%_40%]")}
      </div>
      {label && (
        <span className={`absolute top-6 rounded-full bg-paper/90 px-3 py-1 text-[11px] uppercase tracking-(--tracking-brand) backdrop-blur ${flip ? "left-[calc(78%-1.5rem)] -translate-x-full" : "right-6"}`}>
          {label}
        </span>
      )}
    </div>
  );
}
