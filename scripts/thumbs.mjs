/**
 * Ürün görsellerinin küçük kopyaları: public/urunler/** → public/urunler-kucuk/** (640 px, webp).
 * Kartlar ve küçük resimler bunları yükler (src/lib/image-loader.ts); ürün sayfası orijinali kullanır.
 * Yalnızca eksik ya da kaynağı daha yeni olan dosyaları üretir.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = path.join(process.cwd(), "public", "urunler");
const OUT = path.join(process.cwd(), "public", "urunler-kucuk");
const WIDTH = 640;

const files = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p);
    else if (/\.(webp|jpe?g|png)$/i.test(f.name)) files.push(p);
  }
})(SRC);

let made = 0;
const queue = [...files];
await Promise.all(
  Array.from({ length: 8 }, async () => {
    for (let src; (src = queue.shift()); ) {
      const out = path.join(OUT, path.relative(SRC, src));
      if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs) continue;
      fs.mkdirSync(path.dirname(out), { recursive: true });
      await sharp(src).resize({ width: WIDTH, withoutEnlargement: true }).webp({ quality: 72 }).toFile(out);
      made++;
    }
  }),
);
console.log(`[thumbs] ${files.length} görsel, ${made} yeni küçük kopya`);
