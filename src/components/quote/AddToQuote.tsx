"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { discountedPrice, formatPrice, tierDiscount, unitLabel } from "@/lib/pricing";
import type { QuoteItem, WholesaleTier } from "@/lib/types";
import { useQuote } from "./QuoteProvider";

type Props = Omit<QuoteItem, "qty"> & {
  retailPrice?: number;
  tiers?: WholesaleTier[];
  /** m² ürünlerde kutu m² karşılığı → metraj hesaplayıcı açılır */
  packSize?: number;
  wastePct?: number;
};

const parse = (v: string) => Number(v.replace(",", ".")) || 0;
const fmt = (n: number) => n.toLocaleString("tr-TR", { maximumFractionDigits: 2 });

/**
 * Teklife ekleme. m² ürünlerde metraj hesaplayıcı (alan + fire → kutu),
 * diğerlerinde adet seçici. Miktara göre toptan kademe fiyatını canlı gösterir.
 */
export function AddToQuote({ retailPrice, tiers, packSize, wastePct = 10, ...product }: Props) {
  const { add, items } = useQuote();
  const isArea = product.unit === "m2" && !!packSize;

  const [area, setArea] = useState("");
  const [waste, setWaste] = useState(wastePct);
  const [count, setCount] = useState(1);
  const [added, setAdded] = useState(false);

  const hasArea = parse(area) > 0;
  const boxes = isArea && hasArea ? Math.ceil((parse(area) * (1 + waste / 100)) / packSize) : 0;
  const qty = isArea ? +(boxes * packSize).toFixed(2) : count;
  const discount = tierDiscount(tiers, qty);
  const unitPrice = retailPrice ? discountedPrice(retailPrice, discount) : undefined;
  const nextTier = tiers?.find((t) => t.minQty > qty);
  const inList = items.some((i) => i.slug === product.slug);

  return (
    <div className="space-y-4 rounded-2xl border border-line bg-white p-5">
      {isArea ? (
        <>
          <div className="flex items-center gap-2 text-sm font-medium">
            <Icon name="ruler" className="size-4 text-amethyst-700" /> Metraj hesaplayıcı
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm">
              <span className="mb-1.5 block text-ink-soft">Alan (m²)</span>
              <input
                inputMode="decimal"
                placeholder="ör. 18,5"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="field"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block text-ink-soft">Fire payı</span>
              <select value={waste} onChange={(e) => setWaste(Number(e.target.value))} className="field">
                {[5, 10, 15].map((w) => (
                  <option key={w} value={w}>
                    %{w}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <dl className="grid grid-cols-3 gap-2 rounded-xl bg-linen p-3 text-center text-sm">
            <div>
              <dt className="text-xs text-ink-soft">Kutu</dt>
              <dd className="font-display text-2xl">{hasArea ? boxes : "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-soft">Toplam</dt>
              <dd className="font-display text-2xl">{hasArea ? `${fmt(qty)} m²` : "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-soft">Tahmini tutar</dt>
              <dd className="font-display text-2xl">{unitPrice && hasArea ? formatPrice(unitPrice * qty) : "—"}</dd>
            </div>
          </dl>
          <p className="text-xs text-ink-soft">1 kutu = {fmt(packSize)} m². Metraj yuvarlanarak tam kutuya tamamlanır.</p>
        </>
      ) : (
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium">Miktar</span>
          <div className="flex items-center rounded-full border border-line">
            <button type="button" onClick={() => setCount((c) => Math.max(1, c - 1))} className="grid size-11 place-items-center" aria-label="Azalt">
              <Icon name="minus" className="size-4" />
            </button>
            <input
              aria-label={`Miktar (${unitLabel[product.unit]})`}
              inputMode="numeric"
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.floor(parse(e.target.value)) || 1))}
              className="w-12 bg-transparent text-center text-sm focus:outline-none"
            />
            <button type="button" onClick={() => setCount((c) => c + 1)} className="grid size-11 place-items-center" aria-label="Artır">
              <Icon name="plus" className="size-4" />
            </button>
          </div>
        </div>
      )}

      {retailPrice && discount > 0 && (
        <p className="flex items-center gap-2 text-sm text-amethyst-700">
          <Icon name="percent" className="size-4" /> Bu miktarda %{discount} toptan indirim: {formatPrice(unitPrice!)} / {unitLabel[product.unit]}
        </p>
      )}
      {retailPrice && nextTier && (!isArea || hasArea) && (
        <p className="text-xs text-ink-soft">
          {nextTier.minQty} {unitLabel[product.unit]} ve üzerinde %{nextTier.discountPct} indirim.
        </p>
      )}

      <button
        type="button"
        className="btn-primary w-full"
        disabled={isArea && !hasArea}
        onClick={() => {
          add({ ...product, qty });
          setAdded(true);
        }}
      >
        <Icon name="file" className="size-4" />
        {isArea ? (hasArea ? `${fmt(qty)} m² teklif listesine ekle` : "Alan girin") : "Teklif listesine ekle"}
      </button>
      {(added || inList) && (
        <p className="flex items-center gap-2 text-sm text-amethyst-700" role="status">
          <Icon name="check" className="size-4" /> Listede.
          <Link href="/teklif" className="underline underline-offset-4">
            Teklif listesine git
          </Link>
        </p>
      )}
    </div>
  );
}
