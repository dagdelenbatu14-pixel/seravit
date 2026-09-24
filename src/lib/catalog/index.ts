import "server-only";
import type { Category, Collection, Look, Product, ProductQuery, Surface, Usage, World } from "@/lib/types";
import { categories, collections, products } from "./data";

/**
 * Katalog erişim katmanı. Sayfalar yalnızca bu fonksiyonları kullanır;
 * veri kaynağı (CMS, veritabanı, ERP) değiştiğinde sadece burası güncellenir.
 */

const normalize = (s: string) => s.toLocaleLowerCase("tr-TR").normalize("NFKD");

export async function getCategories(): Promise<Category[]> {
  return [...categories].sort((a, b) => a.order - b.order);
}

export async function getRootCategories(world?: World): Promise<Category[]> {
  return (await getCategories()).filter((c) => !c.parent && (!world || c.world === world));
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  return categories.find((c) => c.slug === slug);
}

export async function getChildCategories(parent: string): Promise<Category[]> {
  return (await getCategories()).filter((c) => c.parent === parent);
}

export async function getCollections(): Promise<Collection[]> {
  return collections;
}

export async function getCollection(slug: string): Promise<Collection | undefined> {
  return collections.find((c) => c.slug === slug);
}

/** Kategori + tüm alt kategorilerinin slug listesi */
function categoryTree(slug: string): string[] {
  return [slug, ...categories.filter((c) => c.parent === slug).map((c) => c.slug)];
}

function applyFilters(list: Product[], query: ProductQuery, skip?: keyof ProductQuery) {
  const has = <T,>(values: T[] | undefined, v: T | undefined) => !values?.length || (v !== undefined && values.includes(v));
  return list.filter((p) => {
    if (query.category && skip !== "category" && !categoryTree(query.category).includes(p.category)) return false;
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

export async function getProducts(query: ProductQuery = {}): Promise<Product[]> {
  const list = applyFilters(products, query);
  switch (query.sort) {
    case "fiyat-artan":
      return list.sort((a, b) => (a.retailPrice ?? Infinity) - (b.retailPrice ?? Infinity));
    case "fiyat-azalan":
      return list.sort((a, b) => (b.retailPrice ?? -1) - (a.retailPrice ?? -1));
    case "isim":
      return list.sort((a, b) => a.name.localeCompare(b.name, "tr"));
    default:
      return list.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));
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
export async function getFacets(query: ProductQuery): Promise<Facets> {
  const count = <T extends string>(skip: keyof ProductQuery, pick: (p: Product) => (T | undefined)[]) => {
    const map = new Map<T, number>();
    for (const p of applyFilters(products, query, skip)) {
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

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  return products.filter((p) => p.featured).slice(0, limit);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return products.find((p) => p.slug === slug);
}

/** Aynı koleksiyondaki diğer ebat / renk / yüzey varyantları (kendisi dahil) */
export async function getCollectionProducts(collection: string): Promise<Product[]> {
  return products.filter((p) => p.collection === collection);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const parent = categories.find((c) => c.slug === product.category)?.parent;
  const pool = categoryTree(parent ?? product.category);
  return products
    .filter((p) => p.slug !== product.slug && p.collection !== product.collection && pool.includes(p.category))
    .sort((a, b) => Number(b.look === product.look) - Number(a.look === product.look))
    .slice(0, limit);
}

export async function getAllProductSlugs(): Promise<string[]> {
  return products.map((p) => p.slug);
}
