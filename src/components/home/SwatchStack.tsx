import { GroutGrid, Texture } from "@/components/product/TileVisual";

/**
 * Güral tarzı kompozisyon: büyük "döşenmiş" yüzey + üstüne binen iki karo numunesi.
 */
export function SwatchStack({
  texture,
  size = "60×120",
  flip,
  label,
}: {
  texture: string;
  size?: string;
  flip?: boolean;
  label?: string;
}) {
  return (
    <div className={`relative mx-auto aspect-[5/6] w-full max-w-lg ${flip ? "lg:ml-auto" : ""}`}>
      <div className={`absolute top-0 h-[82%] w-[78%] overflow-hidden rounded-sm shadow-2xl shadow-night/20 ${flip ? "left-0" : "right-0"}`}>
        <Texture name={texture} sizes="(min-width:1024px) 40vw, 80vw" />
        <GroutGrid size={size} />
      </div>
      <div className={`absolute bottom-[6%] h-[42%] w-[30%] overflow-hidden shadow-xl shadow-night/25 ${flip ? "right-[6%]" : "left-0"}`}>
        <Texture name={texture} sizes="200px" className="scale-[2.2] object-[30%_60%]" />
      </div>
      <div className={`absolute bottom-0 h-[26%] w-[40%] overflow-hidden shadow-xl shadow-night/25 ${flip ? "right-[26%]" : "left-[18%]"}`}>
        <Texture name={texture} sizes="220px" className="scale-[1.8] object-[70%_20%]" />
      </div>
      {label && (
        <span className={`absolute top-6 rounded-full bg-paper/90 px-3 py-1 text-[11px] uppercase tracking-(--tracking-brand) backdrop-blur ${flip ? "left-[calc(78%-1.5rem)] -translate-x-full" : "right-6"}`}>
          {label}
        </span>
      )}
    </div>
  );
}
