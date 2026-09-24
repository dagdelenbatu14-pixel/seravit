import type { StockStatus, Unit, WholesaleTier } from "@/lib/types";

const tryFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

export const formatPrice = (value: number) => tryFormatter.format(value);

export const unitLabel: Record<Unit, string> = {
  m2: "m²",
  adet: "adet",
  takim: "takım",
  paket: "paket",
  kg: "kg",
};

export const stockLabel: Record<StockStatus, string> = {
  stokta: "Stokta",
  sinirli: "Sınırlı stok",
  siparis: "Siparişle temin",
  tukendi: "Tükendi",
};

/** Verilen miktar için uygulanacak kademe indirimi (yoksa 0) */
export function tierDiscount(tiers: WholesaleTier[] | undefined, qty: number): number {
  if (!tiers?.length) return 0;
  return tiers.filter((t) => qty >= t.minQty).reduce((max, t) => Math.max(max, t.discountPct), 0);
}

export function discountedPrice(price: number, discountPct: number) {
  return Math.round(price * (1 - discountPct / 100));
}
