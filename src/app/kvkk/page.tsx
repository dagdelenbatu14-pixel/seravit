import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  alternates: { canonical: "/kvkk" },
};

export default function KvkkPage() {
  return (
    <>
      <PageHeader title="KVKK Aydınlatma Metni" crumbs={[{ label: "KVKK" }]} />
      <div className="container-page max-w-3xl space-y-4 py-16 text-ink-soft">
        {/* TODO: Hukuki danışmanla hazırlanmış nihai metin eklenmeli. */}
        <p>
          {siteConfig.legalName} olarak, web sitemizdeki formlar aracılığıyla paylaştığınız ad, telefon, e-posta ve
          talep bilgilerinizi yalnızca talebinizi yanıtlamak, teklif hazırlamak ve randevu planlamak amacıyla işleriz.
        </p>
        <p className="rounded-lg bg-mist p-4 text-sm">Bu metin taslaktır; yayına almadan önce güncellenmelidir.</p>
      </div>
    </>
  );
}
