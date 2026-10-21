/**
 * Görsellerin küçük kopyaları (640 px, webp): public/urunler/** → public/urunler-kucuk/**,
 * public/textures/** → public/textures-kucuk/**.
 * Kartlar ve küçük resimler bunları yükler (src/lib/image-loader.ts); ürün sayfası orijinali kullanır.
 * Yalnızca eksik ya da kaynağı daha yeni olan dosyaları üretir.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const PUBLIC = path.join(process.cwd(), "public");
const DIRS = ["urunler", "textures"];
const WIDTH = 640;

const files = [];
function walk(dir, out) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p, path.join(out, f.name));
    else if (/\.(webp|jpe?g|png)$/i.test(f.name)) files.push([p, path.join(out, f.name)]);
  }
}
for (const d of DIRS) walk(path.join(PUBLIC, d), path.join(PUBLIC, `${d}-kucuk`));

let made = 0;
const queue = [...files];
await Promise.all(
  Array.from({ length: 8 }, async () => {
    for (let job; (job = queue.shift()); ) {
      const [src, out] = job;
      if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs) continue;
      fs.mkdirSync(path.dirname(out), { recursive: true });
      await sharp(src).resize({ width: WIDTH, withoutEnlargement: true }).webp({ quality: 72 }).toFile(out);
      made++;
    }
  }),
);
console.log(`[thumbs] ${files.length} görsel, ${made} yeni küçük kopya`);
