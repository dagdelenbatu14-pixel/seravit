import "server-only";
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import type { Collection, Product } from "@/lib/types";

/**
 * Marka ürünleri — data/imports/<marka>.json (format: data/imports/SPEC.md).
 * Derleme anında okunur; hatalı kayıt derlemeyi durdurmaz, uyarıyla atlanır.
 */

const DIR = path.join(process.cwd(), "data", "imports");

const categorySlugs = [
  "porselen-karo",
  "duvar-karosu",
  "dis-mekan-havuz",
  "klozet",
  "lavabo",
  "rezervuar",
  "kuvet-dus-teknesi",
  "banyo-mobilyasi",
  "armatur",
  "aksesuar",
  "yapi-kimyasallari",
] as const;

const item = z.object({
  brand: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  sku: z.string().min(1),
  name: z.string().min(1),
  category: z.enum(categorySlugs),
  collection: z.string().optional(),
  summary: z.string().default(""),
  description: z.string().default(""),
  specs: z.record(z.string(), z.coerce.string()).default({}),
  images: z.array(z.string().startsWith("/urunler/")).min(1),
  sourceUrl: z.string().url().optional(),
  unit: z.enum(["m2", "adet", "takim", "paket", "kg"]).default("adet"),
  size: z.string().optional(),
  surface: z.enum(["parlak", "mat", "lappato", "kaymaz", "sirli"]).optional(),
  look: z.enum(["mermer", "dogal-tas", "beton", "ahsap", "duz", "dekor", "mozaik"]).optional(),
  colorName: z.string().optional(),
  thickness: z.string().optional(),
  usage: z.array(z.enum(["banyo", "mutfak", "ic-mekan", "dis-mekan", "havuz"])).default([]),
});

const slugify = (s: string) =>
  s
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
    .normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function load(): Product[] {
  if (!fs.existsSync(DIR)) return [];
  const out: Product[] = [];
  const seen = new Set<string>();
  for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith(".json")).sort()) {
    let raw: unknown;
    try {
      raw = JSON.parse(fs.readFileSync(path.join(DIR, file), "utf8"));
    } catch (e) {
      console.warn(`[imports] ${file} okunamadı:`, e);
      continue;
    }
    for (const [i, entry] of (Array.isArray(raw) ? raw : []).entries()) {
      const r = item.safeParse(entry);
      if (!r.success) {
        console.warn(`[imports] ${file}#${i} atlandı:`, r.error.issues[0]?.path.join("."), r.error.issues[0]?.message);
        continue;
      }
      const d = r.data;
      if (seen.has(d.slug)) continue;
      const images = d.images.filter((src) => fs.existsSync(path.join(process.cwd(), "public", src)));
      if (!images.length) continue;
      seen.add(d.slug);
      const specs = {
        ...(d.size && { Ebat: `${d.size} cm` }),
        ...(d.thickness && { Kalınlık: d.thickness }),
        ...(d.colorName && { Renk: d.colorName }),
        ...(d.collection && { Seri: d.collection }),
        ...d.specs,
        "Ürün kodu": d.sku,
      };
      out.push({
        slug: d.slug,
        sku: d.sku,
        name: d.name,
        brand: d.brand,
        category: d.category,
        collection: d.collection ? `${slugify(d.brand)}-${slugify(d.collection)}` : undefined,
        summary: d.summary || d.description.split(". ")[0],
        description: d.description || d.summary,
        images,
        unit: d.unit,
        look: d.look,
        surface: d.surface,
        size: d.size,
        colorName: d.colorName,
        thickness: d.thickness,
        usage: d.usage,
        features: [],
        stock: "siparis",
        inShowroom: false,
        specs,
        tags: [d.brand, d.collection ?? ""].filter(Boolean),
        sourceUrl: d.sourceUrl,
      });
    }
  }
  return out;
}

export const importedProducts: Product[] = load();

/** İçe aktarılan ürünlerden türetilen koleksiyonlar (marka + seri) */
export const importedCollections: Collection[] = (() => {
  const groups = new Map<string, Product[]>();
  for (const p of importedProducts) if (p.collection) groups.set(p.collection, [...(groups.get(p.collection) ?? []), p]);
  return [...groups.entries()].map(([slug, items]) => {
    const first = items[0];
    const name = first.specs.Seri ?? slug;
    const isTile = first.unit === "m2";
    const sizes = [...new Set(items.map((i) => i.size).filter(Boolean))];
    const room = items.find((i) => i.images.length > 1)?.images[1];
    return {
      slug,
      name,
      brand: first.brand,
      look: first.look,
      tagline: `${first.brand} ${name} serisi`,
      story: isTile
        ? `${first.brand} ${name} serisi; ${sizes.length ? sizes.join(", ") + " cm ebatlarında" : "farklı ebatlarda"}, ${items.length} seçenekle Seravit'te.`
        : `${first.brand} ${name} serisinden ${items.length} ürün Seravit'te.`,
      image: first.images[0],
      roomImage: room,
      count: items.length,
    };
  });
})();
