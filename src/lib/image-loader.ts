/**
 * next/image yükleyicisi (statik yayın, optimize edici yok).
 * Ürün görsellerinde küçük genişlikler için scripts/thumbs.mjs'in ürettiği 640 px kopya,
 * büyükler için orijinal dosya döner; diğer görseller olduğu gibi sunulur.
 */
export default function imageLoader({ src, width }: { src: string; width: number }) {
  if (width <= 640 && src.includes("/urunler/")) return `${src.replace("/urunler/", "/urunler-kucuk/")}?w=${width}`;
  return `${src}?w=${width}`;
}
