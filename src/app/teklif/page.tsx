import type { Metadata } from "next";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Teklif Listesi",
  description: "Seçtiğiniz ürünler için perakende veya toptan fiyat teklifi isteyin.",
  robots: { index: false },
};

export default function QuotePage() {
  return (
    <>
      <PageHeader
        eyebrow="Teklif"
        title="Teklif iste"
        lead="Listenizdeki ürünler ve miktarlar için stok, fiyat ve teslimat bilgisini içeren teklifinizi hazırlayalım."
        crumbs={[{ label: "Teklif listesi" }]}
        texture="zellige-blanc"
      />
      <div className="container-page py-12">
        <QuoteForm />
      </div>
    </>
  );
}
