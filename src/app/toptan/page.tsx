import type { Metadata } from "next";
import Link from "next/link";
import { DealerForm } from "@/components/forms/DealerForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { GroutGrid, Texture } from "@/components/product/TileVisual";
import { Icon, type IconName } from "@/components/ui/Icon";
import { SectionTitle } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Toptan Satış & Proje Tedariği",
  description:
    "Müteahhit, mimar, otel ve bayiler için toptan seramik ve vitrifiye. Kademeli fiyat, proje bazlı tedarik ve Bodrum geneline sevkiyat.",
  alternates: { canonical: "/toptan" },
};

const audiences: { icon: IconName; title: string; text: string }[] = [
  { icon: "layers", title: "Müteahhit & Proje", text: "Konut, villa ve site projeleri için metraja göre fiyat, termin planı ve şantiyeye sevkiyat." },
  { icon: "ruler", title: "Mimar & İç Mimar", text: "Numune, teknik doküman ve müşterinize özel ürün seçkisi; showroom'da sunum imkânı." },
  { icon: "store", title: "Otel & İşletme", text: "Sezon öncesi yenileme, havuz ve peyzaj projeleri için hızlı stok tedariği." },
  { icon: "box", title: "Bayi & Perakendeci", text: "Bayi fiyat listesi, düzenli stok, cari hesap ve kampanya desteği." },
];

const benefits: { icon: IconName; title: string; text: string }[] = [
  { icon: "percent", title: "Kademeli fiyat", text: "Metraj arttıkça birim fiyat düşer; proje bazında ek iskonto." },
  { icon: "box", title: "Stok rezervasyonu", text: "Aynı parti (kalibre/ton) ürün projeniz için ayrılır." },
  { icon: "truck", title: "Şantiyeye teslim", text: "Bodrum yarımadası ve Milas'a paletli, planlı sevkiyat." },
  { icon: "file", title: "Tek teklif", text: "Karo, vitrifiye, armatür ve yapı kimyasalı tek listede." },
];

const steps = [
  ["Metraj / liste", "Proje metrajınızı veya ürün listenizi gönderin."],
  ["Teklif", "Stok, termin ve kademeli fiyatla teklifinizi hazırlayalım."],
  ["Onay & rezerv", "Onay sonrası ürünler aynı partiden ayrılır."],
  ["Sevkiyat", "Şantiye takvimine göre paletli teslimat."],
];

export default function WholesalePage() {
  return (
    <>
      <PageHeader
        eyebrow="Profesyonellere özel"
        title="Toptan Satış & Proje Tedariği"
        lead="Bodrum ve çevresindeki villa, otel ve konut projelerine seramik, vitrifiye ve banyo ürünlerinde toplu tedarik."
        texture="hero-travertino"
        grid="60×120"
        crumbs={[{ label: "Toptan & Proje" }]}
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/teklif" className="btn-light">
            <Icon name="file" className="size-4" /> Ürün listesiyle teklif iste
          </Link>
          <a href="#basvuru" className="btn-outline-light">
            Bayi / proje hesabı aç
          </a>
        </div>
      </PageHeader>

      <section className="container-page py-20" aria-labelledby="kimler">
        <SectionTitle id="kimler" eyebrow="İş ortaklarımız" title="Kimlerle çalışıyoruz" />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((a) => (
            <li key={a.title} className="group rounded-2xl border border-line bg-white p-7 transition-colors hover:border-amethyst-300">
              <span className="mb-6 grid size-14 place-items-center rounded-full bg-mist text-amethyst-700 transition-colors group-hover:bg-amethyst-700 group-hover:text-white">
                <Icon name={a.icon} className="size-6" />
              </span>
              <h3 className="mb-2 text-2xl">{a.title}</h3>
              <p className="text-sm text-ink-soft">{a.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-linen py-20" aria-labelledby="avantaj">
        <div className="container-page grid items-center gap-14 lg:grid-cols-2">
          <div className="relative aspect-[5/4] overflow-hidden rounded-3xl">
            <Texture name="bodrum-stone" sizes="(min-width:1024px) 50vw, 100vw" />
            <GroutGrid size="60×60" />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-paper/95 p-5 shadow-xl backdrop-blur sm:right-auto sm:w-80">
              <p className="eyebrow mb-3">Örnek kademe · Bodrum Stone</p>
              <table className="w-full text-sm">
                <tbody>
                  {[
                    ["0 – 99 m²", "Perakende"],
                    ["100 – 499 m²", "%8 indirim"],
                    ["500 m² +", "%15 indirim"],
                  ].map(([q, d]) => (
                    <tr key={q} className="border-t border-line first:border-0">
                      <td className="py-1.5">{q}</td>
                      <td className="py-1.5 text-right text-amethyst-700">{d}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <SectionTitle id="avantaj" align="left" eyebrow="Avantajlar" title="Neden Seravit?" />
            <ul className="grid gap-8 sm:grid-cols-2">
              {benefits.map((b) => (
                <li key={b.title} className="space-y-2">
                  <Icon name={b.icon} className="size-7 text-amethyst-700" />
                  <h3 className="font-sans text-base font-medium">{b.title}</h3>
                  <p className="text-sm text-ink-soft">{b.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-night py-20 text-paper" aria-labelledby="surec">
        <div className="container-page">
          <SectionTitle id="surec" tone="dark" eyebrow="Süreç" title="Metrajdan şantiyeye" />
          <ol className="grid gap-px overflow-hidden rounded-2xl bg-paper/10 md:grid-cols-4">
            {steps.map(([t, d], i) => (
              <li key={t} className="space-y-3 bg-night p-8">
                <span className="font-display text-5xl text-amethyst-300">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-2xl">{t}</h3>
                <p className="text-sm text-paper/65">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="basvuru" className="container-page scroll-mt-32 py-20" aria-labelledby="basvuru-baslik">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <div className="space-y-5">
            <p className="eyebrow">Başvuru</p>
            <h2 id="basvuru-baslik" className="text-4xl md:text-5xl">
              Bayi / proje hesabı açın
            </h2>
            <p className="text-ink-soft">
              Onaylanan hesaplara özel fiyat listesi, cari çalışma koşulları ve proje bazlı iskonto iletilir. Tek seferlik
              alımlar için hesap gerekmez;{" "}
              <Link href="/teklif" className="text-amethyst-700 underline underline-offset-4">
                teklif listesi
              </Link>{" "}
              yeterlidir.
            </p>
          </div>
          <div className="rounded-3xl border border-line bg-white p-6 md:p-10">
            <DealerForm />
          </div>
        </div>
      </section>
    </>
  );
}
