import "server-only";
import type { Category, Collection, Product, ProductQuery, World } from "@/lib/types";
import { categories, collections, products } from "./data";
import { categoryTree, computeFacets, filterProducts, sortProducts, type Facets } from "./query";

/**
 * Katalog erişim katmanı. Sayfalar yalnızca bu fonksiyonları kullanır;
 * veri kaynağı (CMS, veritabanı, ERP) değiştiğinde sadece burası güncellenir.
 */

export type { Facets };

export async function getCatalog(): Promise<{ products: Product[]; categories: Category[]; collections: Collection[] }> {
  return { products, categories, collections };
}

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

export async function getProducts(query: ProductQuery = {}): Promise<Product[]> {
  return sortProducts(filterProducts(products, categories, query), query.sort);
}

export async function getFacets(query: ProductQuery): Promise<Facets> {
  return computeFacets(products, categories, query);
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
  const pool = categoryTree(categories, parent ?? product.category);
  return products
    .filter((p) => p.slug !== product.slug && p.collection !== product.collection && pool.includes(p.category))
    .sort((a, b) => Number(b.look === product.look) - Number(a.look === product.look))
    .slice(0, limit);
}

export async function getAllProductSlugs(): Promise<string[]> {
  return products.map((p) => p.slug);
}
