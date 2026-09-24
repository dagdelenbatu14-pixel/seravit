import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { CatalogView } from "@/components/product/CatalogView";
import { getCatalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Ürünler",
  description: "Seramik, porselen karo, vitrifiye, banyo mobilyası ve armatür ürünleri. Perakende ve toptan satış.",
  alternates: { canonical: "/urunler" },
};

export default async function ProductsPage() {
  const data = await getCatalog();
  return (
    <>
      <PageHeader
        eyebrow="Katalog"
        title="Ürünler"
        lead="Showroom'umuzda sergilenen ve tedarik ettiğimiz tüm ürün grupları."
        crumbs={[{ label: "Ürünler" }]}
        texture="hero-viola"
      />
      <CatalogView data={data} />
    </>
  );
}
