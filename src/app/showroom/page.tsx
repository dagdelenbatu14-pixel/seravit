import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AppointmentForm, AppointmentFormFromUrl } from "@/components/forms/AppointmentForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { GroutGrid, Texture } from "@/components/product/TileVisual";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ArrowCircle, SectionTitle } from "@/components/ui/Section";
import { fullAddress, siteConfig } from "@/config/site";
import { getFacets, getRootCategories } from "@/lib/catalog";
import { lookLabel, lookTexture } from "@/lib/labels";

export const metadata: Metadata = {
  title: "Showroom — Bodrum Mumcular",
  description:
    "Bodrum Mumcular'daki Seravit showroomunda seramik, vitrifiye ve banyo ürünlerini yerinde inceleyin. Showroom randevusu veya ücretsiz keşif & metraj talep edin.",
  alternates: { canonical: "/showroom" },
};

const steps: { icon: IconName; title: string; text: string }[] = [
  { icon: "calendar", title: "Randevu alın", text: "Size uygun gün ve saat aralığını seçin; onay için arayalım." },
  { icon: "store", title: "Birlikte seçelim", text: "Büyük ebatları gerçek ışıkta görün, numune alın, kombinleri deneyin." },
  { icon: "ruler", title: "Metraj & teklif", text: "Ölçülerinize göre fireli metraj ve kalem kalem teklif hazırlanır." },
  { icon: "truck", title: "Teslimat", text: "Adrese veya şantiyeye paletli teslim; uygulama ekibi önerisi." },
];

export default async function ShowroomPage() {
  const [facets, bath] = await Promise.all([getFacets({ category: "seramik", showroom: true }), getRootCategories("banyo")]);
  const { address } = siteConfig;

  return (
    <>
      <PageHeader
        eyebrow={`${address.locality} · ${address.district}`}
        title="Showroom"
        lead="Karoları, vitrifiyeyi ve armatürleri yerinde inceleyin. Randevulu ziyaretlerde size özel bir danışman eşlik eder."
        texture="hero-nero"
        crumbs={[{ label: "Showroom" }]}
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <a href="#randevu" className="btn-light">
            <Icon name="calendar" className="size-4" /> Randevu al
          </a>
          {address.mapsUrl && (
            <a href={address.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-outline-light">
              <Icon name="pin" className="size-4" /> Yol tarifi
            </a>
          )}
        </div>
      </PageHeader>

      {/* Bilgi şeridi */}
      <div className="border-b border-line bg-paper">
        <dl className="container-page grid gap-6 py-8 text-sm sm:grid-cols-3">
          <div className="flex items-start gap-3">
            <Icon name="pin" className="mt-0.5 size-5 text-amethyst-700" />
            <div>
              <dt className="font-medium">Adres</dt>
              <dd className="text-ink-soft">{fullAddress()}</dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Icon name="clock" className="mt-0.5 size-5 text-amethyst-700" />
            <div>
              <dt className="font-medium">Çalışma saatleri</dt>
              {siteConfig.hours.map((h) => (
                <dd key={h.label} className="text-ink-soft">
                  {h.label}: {h.opens ? `${h.opens} – ${h.closes}` : "Kapalı"}
                </dd>
              ))}
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Icon name="phone" className="mt-0.5 size-5 text-amethyst-700" />
            <div>
              <dt className="font-medium">Telefon</dt>
              <dd>
                <a href={siteConfig.contact.phoneHref} className="text-ink-soft hover:text-ink">
                  {siteConfig.contact.phone}
                </a>
              </dd>
            </div>
          </div>
        </dl>
      </div>

      {/* Showroom'da neler var */}
      <section className="container-page py-20" aria-labelledby="sergi">
        <SectionTitle id="sergi" eyebrow="Showroom'da sergilenenler" title="Dokunun, karşılaştırın" />
        {/* TODO: gerçek showroom fotoğrafları / sanal tur */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {facets.looks.map((l) => (
            <Link key={l.value} href={`/urunler/seramik?gorunum=${l.value}&showroom=1`} className="group relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Texture name={lookTexture[l.value]} sizes="(min-width:1024px) 25vw, 50vw" className="transition-transform duration-700 group-hover:scale-105" />
              <GroutGrid size="60×60" />
              <div className="absolute inset-0 bg-gradient-to-t from-night/70 to-transparent" />
              <div className="absolute inset-x-5 bottom-4 flex items-end justify-between text-paper">
                <p className="font-display text-2xl">
                  {lookLabel[l.value]} <span className="font-sans text-sm text-paper/70">· {l.count}</span>
                </p>
                <ArrowCircle dark direction="up-right" className="size-9" />
              </div>
            </Link>
          ))}
          {bath.map((c) => (
            <Link key={c.slug} href={`/urunler/${c.slug}?showroom=1`} className="group flex items-center justify-between rounded-2xl bg-linen p-5 hover:bg-mist">
              <span className="font-display text-xl">{c.name}</span>
              <ArrowCircle direction="up-right" className="size-9" />
            </Link>
          ))}
        </div>
      </section>

      {/* Süreç */}
      <section className="bg-night py-20 text-paper" aria-labelledby="surec">
        <div className="container-page">
          <SectionTitle id="surec" tone="dark" eyebrow="Nasıl çalışıyoruz" title="Ziyaretten teslimata" />
          <ol className="grid gap-10 md:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="grid size-14 place-items-center rounded-full border border-paper/25 text-gold-soft">
                    <Icon name={s.icon} className="size-6" />
                  </span>
                  <span className="font-display text-4xl text-paper/25">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="text-2xl">{s.title}</h3>
                <p className="text-sm text-paper/65">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Randevu */}
      <section id="randevu" className="container-page scroll-mt-32 py-20" aria-labelledby="randevu-baslik">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-6">
            <p className="eyebrow">Randevu</p>
            <h2 id="randevu-baslik" className="text-4xl md:text-5xl">
              Showroom ziyareti ya da <em className="text-amethyst-700">yerinde keşif</em>
            </h2>
            <p className="text-ink-soft">
              Showroom ziyaretlerinde danışmanımız ürünleri birlikte seçmenize yardım eder. Keşif randevusunda uzmanımız
              mekânınızı ölçer, fireli metraj ve ürün listesini çıkarır; keşif ücretsizdir.
            </p>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Texture name="calacatta-viola" sizes="40vw" />
              <GroutGrid size="60×120" />
            </div>
          </div>
          <div className="rounded-3xl border border-line bg-white p-6 md:p-10">
            <Suspense fallback={<AppointmentForm />}>
              <AppointmentFormFromUrl />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
