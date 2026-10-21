/**
 * next/image yükleyicisi (statik yayın, optimize edici yok).
 * Ürün görselleri ve dokularda küçük genişlikler için scripts/thumbs.mjs'in ürettiği 640 px kopya,
 * büyükler için orijinal dosya döner; diğer görseller olduğu gibi sunulur.
 */
export default function imageLoader({ src, width }: { src: string; width: number }) {
  if (width <= 640) {
    const small = src.replace(/\/(urunler|textures)\//, "/$1-kucuk/");
    if (small !== src) return `${small}?w=${width}`;
  }
  return `${src}?w=${width}`;
}
