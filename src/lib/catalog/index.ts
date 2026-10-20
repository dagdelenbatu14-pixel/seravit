import "server-only";
import type { Category, Collection, Product, ProductQuery, World } from "@/lib/types";
import { categories, collections as sampleCollections, products as sampleProducts } from "./data";
import { importedCollections, importedProducts } from "./imports";
import { categoryTree, computeFacets, filterProducts, sortProducts, type Facets } from "./query";

/** Örnek (Seravit) ürünleri + marka içe aktarımları */
const products = [...sampleProducts, ...importedProducts];
const collections = [...sampleCollections, ...importedCollections];

/**
 * Katalog erişim katmanı. Sayfalar yalnızca bu fonksiyonları kullanır;
 * veri kaynağı (CMS, veritabanı, ERP) değiştiğinde sadece burası güncellenir.
 */

export type { Facets };

/**
 * Katalog sayfaları (istemci tarafı filtre) için hafif veri: açıklama, teknik tablo
 * ve ek görseller çıkarılır — yüzlerce ürünle sayfa boyutu küçük kalsın.
 */
export async function getCatalog(): Promise<{ products: Product[]; categories: Category[]; collections: Collection[] }> {
  const slim = products.map((p) => ({ ...p, summary: "", description: "", specs: {}, features: [], images: p.images.slice(0, 1), sourceUrl: undefined }));
  const slimCollections = collections.map((c) => ({ ...c, roomImage: undefined }));
  return { products: slim, categories: categoriesWithImages, collections: slimCollections };
}

/** Kategori görseli yoksa o kategorideki ilk fotoğraflı (içe aktarılan) üründen alınır */
const categoriesWithImages: Category[] = categories.map((c) => {
  if (c.image || c.texture) return c;
  const tree = categoryTree(categories, c.slug);
  const hit = importedProducts.find((p) => tree.includes(p.category) && p.images.length);
  return hit ? { ...c, image: hit.images[0] } : c;
});

export async function getCategories(): Promise<Category[]> {
  return [...categoriesWithImages].sort((a, b) => a.order - b.order);
}

export async function getRootCategories(world?: World): Promise<Category[]> {
  return (await getCategories()).filter((c) => !c.parent && (!world || c.world === world));
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  return categoriesWithImages.find((c) => c.slug === slug);
}

export async function getChildCategories(parent: string): Promise<Category[]> {
  return (await getCategories()).filter((c) => c.parent === parent);
}

/** Koleksiyonlar: mekân fotoğrafı olan ve çok seçenekli karo serileri önde */
export async function getCollections(): Promise<Collection[]> {
  const score = (c: Collection) => (c.roomImage ? 100 : 0) + (c.look ? 50 : 0) + (c.count ?? 0);
  return [...collections].sort((a, b) => score(b) - score(a));
}

/** Belirli görünümde (mermer, doğal taş…) öne çıkan koleksiyon; `exclude` markası hariç tutulabilir */
export async function getFeaturedCollection(look: string, excludeBrand?: string): Promise<Collection | undefined> {
  return (await getCollections()).find((c) => c.look === look && c.roomImage && c.brand !== excludeBrand);
}

export async function getCollection(slug: string): Promise<Collection | undefined> {
  return collections.find((c) => c.slug === slug);
}

export async function getProducts(query: ProductQuery = {}): Promise<Product[]> {
  return sortProducts(filterProducts(products, categories, query), query.sort);
}

export async function getFacets(query: ProductQuery): Promise<Facets> {
  return computeFacets(products, categories, query);
}

/** Öne çıkanlar: her markadan sırayla, karo ve banyo karışık */
export async function getFeaturedProducts(limit = 12): Promise<Product[]> {
  const byBrand = new Map<string, Product[]>();
  for (const p of products) byBrand.set(p.brand, [...(byBrand.get(p.brand) ?? []), p]);
  const lists = [...byBrand.values()];
  const out: Product[] = [];
  for (let round = 0; out.length < limit && lists.some((l) => l[round]); round++) {
    for (const l of lists) if (l[round] && out.length < limit) out.push(l[round]);
  }
  return out;
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
  const pool = categoryTree(categories, parent ?? product.category);
  return products
    .filter((p) => p.slug !== product.slug && p.collection !== product.collection && pool.includes(p.category))
    .sort((a, b) => Number(b.look === product.look) - Number(a.look === product.look))
    .slice(0, limit);
}

export async function getAllProductSlugs(): Promise<string[]> {
  return products.map((p) => p.slug);
}
