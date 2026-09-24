import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllProductSlugs, getCategories } from "@/lib/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const [categories, slugs] = await Promise.all([getCategories(), getAllProductSlugs()]);
  const staticRoutes = ["", "/urunler", "/showroom", "/toptan", "/hakkimizda", "/iletisim"];

  return [
    ...staticRoutes.map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.8 })),
    ...categories.map((c) => ({ url: `${base}/urunler/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...slugs.map((s) => ({ url: `${base}/urun/${s}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
