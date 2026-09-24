import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { CatalogView } from "@/components/product/CatalogView";

export const metadata: Metadata = {
  title: "Ürünler",
  description: "Seramik, porselen karo, vitrifiye, banyo mobilyası ve armatür ürünleri. Perakende ve toptan satış.",
  alternates: { canonical: "/urunler" },
};

export default async function ProductsPage({ searchParams }: PageProps<"/urunler">) {
  const sp = await searchParams;
  const bath = sp.dunya === "banyo";
  return (
    <>
      <PageHeader
        eyebrow="Katalog"
        title={bath ? "Banyo Ürünleri" : "Tüm Ürünler"}
        lead={
          bath
            ? "Vitrifiye, armatür, banyo mobilyası ve aksesuarlar."
            : "Showroom'umuzda sergilenen ve tedarik ettiğimiz tüm ürün grupları."
        }
        crumbs={[{ label: "Ürünler" }]}
        texture={bath ? undefined : "hero-viola"}
      />
      <CatalogView searchParams={sp} />
    </>
  );
}
