import type { Category, Look, Product, ProductQuery, Surface, Usage, World } from "@/lib/types";

/**
 * Saf katalog sorgu fonksiyonları — hem derleme anında (sunucu) hem tarayıcıda
 * (statik sitede URL filtreleri) kullanılır.
 */

const normalize = (s: string) => s.toLocaleLowerCase("tr-TR").normalize("NFKD");

export function categoryTree(categories: Category[], slug: string): string[] {
  return [slug, ...categories.filter((c) => c.parent === slug).map((c) => c.slug)];
}

export function filterProducts(products: Product[], categories: Category[], query: ProductQuery, skip?: keyof ProductQuery) {
  const has = <T,>(values: T[] | undefined, v: T | undefined) => !values?.length || (v !== undefined && values.includes(v));
  const tree = query.category ? categoryTree(categories, query.category) : null;
  return products.filter((p) => {
    if (tree && skip !== "category" && !tree.includes(p.category)) return false;
    if (query.world && categories.find((c) => c.slug === p.category)?.world !== query.world) return false;
    if (query.showroom && skip !== "showroom" && !p.inShowroom) return false;
    if (query.collection && skip !== "collection" && p.collection !== query.collection) return false;
    if (skip !== "looks" && !has(query.looks, p.look)) return false;
    if (skip !== "surfaces" && !has(query.surfaces, p.surface)) return false;
    if (skip !== "sizes" && !has(query.sizes, p.size)) return false;
    if (skip !== "usages" && query.usages?.length && !query.usages.some((u) => p.usage.includes(u))) return false;
    if (query.q) {
      const q = normalize(query.q.trim());
      const hay = normalize([p.name, p.sku, p.brand, p.collection ?? "", p.colorName ?? "", ...p.tags].join(" "));
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function sortProducts(list: Product[], sort: ProductQuery["sort"]) {
  const out = [...list];
  switch (sort) {
    case "fiyat-artan":
      return out.sort((a, b) => (a.retailPrice ?? Infinity) - (b.retailPrice ?? Infinity));
    case "fiyat-azalan":
      return out.sort((a, b) => (b.retailPrice ?? -1) - (a.retailPrice ?? -1));
    case "isim":
      return out.sort((a, b) => a.name.localeCompare(b.name, "tr"));
    default:
      return out.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));
  }
}

export type FacetOption<T extends string = string> = { value: T; count: number };
export type Facets = {
  looks: FacetOption<Look>[];
  surfaces: FacetOption<Surface>[];
  sizes: FacetOption[];
  usages: FacetOption<Usage>[];
};

/** Her filtre grubu için, o grup hariç diğer filtreler uygulanmış sayımlar */
export function computeFacets(products: Product[], categories: Category[], query: ProductQuery): Facets {
  const count = <T extends string>(skip: keyof ProductQuery, pick: (p: Product) => (T | undefined)[]) => {
    const map = new Map<T, number>();
    for (const p of filterProducts(products, categories, query, skip)) {
      for (const v of pick(p)) if (v) map.set(v, (map.get(v) ?? 0) + 1);
    }
    return [...map.entries()].map(([value, count]) => ({ value, count }));
  };
  const sizeKey = (s: string) => s.split("×").reduce((a, b) => a * (parseFloat(b.replace(",", ".")) || 1), 1);
  return {
    looks: count<Look>("looks", (p) => [p.look]),
    surfaces: count<Surface>("surfaces", (p) => [p.surface]),
    sizes: count<string>("sizes", (p) => [p.size]).sort((a, b) => sizeKey(a.value) - sizeKey(b.value)),
    usages: count<Usage>("usages", (p) => p.usage),
  };
}

/* ——— URL parametreleri (Türkçe) ↔ sorgu ——— */

export type SearchParams = Record<string, string | string[] | undefined>;
export const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
export const many = (v: string | string[] | undefined) => (v === undefined ? [] : Array.isArray(v) ? v : [v]).filter(Boolean);

export const sortOptions: { value: NonNullable<ProductQuery["sort"]>; label: string }[] = [
  { value: "onerilen", label: "Önerilen" },
  { value: "fiyat-artan", label: "Fiyat (artan)" },
  { value: "fiyat-azalan", label: "Fiyat (azalan)" },
  { value: "isim", label: "İsim (A–Z)" },
];

export function parseCatalogParams(sp: SearchParams): Omit<ProductQuery, "category"> {
  const sort = one(sp.sirala) as ProductQuery["sort"];
  const world = one(sp.dunya) as World | undefined;
  return {
    q: one(sp.q) || undefined,
    showroom: one(sp.showroom) === "1",
    looks: many(sp.gorunum) as Look[],
    surfaces: many(sp.yuzey) as Surface[],
    sizes: many(sp.ebat),
    usages: many(sp.alan) as Usage[],
    collection: one(sp.koleksiyon) || undefined,
    world: world && ["karo", "banyo", "yapi"].includes(world) ? world : undefined,
    sort: sortOptions.some((s) => s.value === sort) ? sort : "onerilen",
  };
}

/** URLSearchParams → düz nesne (tekrarlanan anahtarlar dizi olur) */
export function searchParamsToObject(params: URLSearchParams): SearchParams {
  const out: SearchParams = {};
  for (const key of new Set(params.keys())) {
    const all = params.getAll(key);
    out[key] = all.length > 1 ? all : all[0];
  }
  return out;
}
