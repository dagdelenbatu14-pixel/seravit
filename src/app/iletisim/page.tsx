import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { fullAddress, siteConfig, whatsappLink } from "@/config/site";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Seravit Seramik Vitrifiye — Bodrum Mumcular showroom adresi, telefon ve iletişim formu.",
  alternates: { canonical: "/iletisim" },
};

export default function ContactPage() {
  const { contact } = siteConfig;
  return (
    <>
      <PageHeader eyebrow="Seravit" title="İletişim" lead="Showroom, teklif ve proje talepleriniz için bize ulaşın." texture="nero-marquina" crumbs={[{ label: "İletişim" }]} />
      <div className="container-page grid gap-16 py-16 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-8 text-sm">
          <div>
            <h2 className="eyebrow mb-2 font-sans">Adres</h2>
            <address className="not-italic">{fullAddress()}</address>
          </div>
          <div>
            <h2 className="eyebrow mb-2 font-sans">Telefon & e-posta</h2>
            <p>
              <a href={contact.phoneHref} className="hover:text-amethyst-700">
                {contact.phone}
              </a>
              <br />
              <a href={`mailto:${contact.email}`} className="hover:text-amethyst-700">
                {contact.email}
              </a>
            </p>
          </div>
          <div>
            <h2 className="eyebrow mb-2 font-sans">Çalışma saatleri</h2>
            <ul>
              {siteConfig.hours.map((h) => (
                <li key={h.label}>
                  {h.label}: {h.opens ? `${h.opens} – ${h.closes}` : "Kapalı"}
                </li>
              ))}
            </ul>
          </div>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-outline">
            WhatsApp ile yazın
          </a>
          {/* TODO: Google Maps embed (siteConfig.geo doldurulunca) */}
        </div>

        <section aria-labelledby="form" className="rounded-3xl border border-line bg-white p-6 md:p-10">
          <h2 id="form" className="mb-8 text-3xl">
            Bize yazın
          </h2>
          <ContactForm />
        </section>
      </div>
    </>
  );
}
