import Link from "next/link";
import { lookLabel, surfaceLabel } from "@/lib/labels";
import { discountedPrice, formatPrice, stockLabel, unitLabel } from "@/lib/pricing";
import type { Product } from "@/lib/types";
import { TileVisual } from "./TileVisual";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const bestTier = product.wholesaleTiers?.at(-1);
  const meta = [product.look && lookLabel[product.look], product.size, product.surface && surfaceLabel[product.surface]].filter(Boolean);

  return (
    <article className="group relative flex flex-col">
      <div className="relative">
        <TileVisual product={product} hoverLaid priority={priority} className="aspect-[4/5] rounded-xl" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.inShowroom && (
            <span className="rounded-full bg-paper/90 px-2.5 py-1 text-[11px] font-medium backdrop-blur">Showroom&apos;da</span>
          )}
          {product.stock !== "stokta" && (
            <span className="rounded-full bg-night/80 px-2.5 py-1 text-[11px] font-medium text-paper backdrop-blur">
              {stockLabel[product.stock]}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-1">
        {meta.length > 0 && <p className="eyebrow text-[10px]">{meta.join(" · ")}</p>}
        <h3 className="font-sans text-[15px] font-medium leading-snug">
          <Link href={`/urun/${product.slug}`} className="after:absolute after:inset-0">
            {product.name}
          </Link>
        </h3>
        <p className="text-xs text-ink-soft">Ürün kodu: {product.sku}</p>
        <div className="mt-auto flex flex-wrap items-baseline gap-x-3 gap-y-1 pt-2 text-sm">
          {product.retailPrice ? (
            <>
              <span className="font-medium">
                {formatPrice(product.retailPrice)}
                <span className="font-normal text-ink-soft"> / {unitLabel[product.unit]}</span>
              </span>
              {bestTier && (
                <span className="border-l border-line pl-3 text-xs text-amethyst-700">
                  {bestTier.minQty}+ {unitLabel[product.unit]}: {formatPrice(discountedPrice(product.retailPrice, bestTier.discountPct))}
                </span>
              )}
            </>
          ) : (
            <span className="text-ink-soft">Fiyat için teklif alın</span>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products, cols = 4 }: { products: Product[]; cols?: 3 | 4 }) {
  if (!products.length) {
    return (
      <div className="rounded-2xl border border-dashed border-line py-20 text-center">
        <p className="font-display text-2xl">Sonuç bulunamadı</p>
        <p className="mt-2 text-sm text-ink-soft">Filtreleri azaltmayı deneyin ya da ihtiyacınızı bize yazın.</p>
      </div>
    );
  }
  return (
    <div className={`grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 ${cols === 4 ? "xl:grid-cols-4" : ""}`}>
      {products.map((p, i) => (
        <ProductCard key={p.slug} product={p} priority={i < 4} />
      ))}
    </div>
  );
}
