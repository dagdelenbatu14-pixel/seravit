import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { CatalogView } from "@/components/product/CatalogView";
import { getCategories, getCategory } from "@/lib/catalog";

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ kategori: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/urunler/[kategori]">): Promise<Metadata> {
  const category = await getCategory((await params).kategori);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/urunler/${category.slug}` },
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps<"/urunler/[kategori]">) {
  const category = await getCategory((await params).kategori);
  if (!category) notFound();
  const parent = category.parent ? await getCategory(category.parent) : undefined;

  return (
    <>
      <PageHeader
        eyebrow={parent?.name ?? (category.world === "karo" ? "Karolar" : category.world === "banyo" ? "Banyo" : "Yapı")}
        title={category.name}
        lead={category.description}
        texture={category.texture}
        grid={category.texture ? "60×120" : undefined}
        crumbs={[
          { href: "/urunler", label: "Ürünler" },
          ...(parent ? [{ href: `/urunler/${parent.slug}`, label: parent.name }] : []),
          { label: category.name },
        ]}
      />
      <CatalogView category={category.slug} searchParams={await searchParams} />
    </>
  );
}
