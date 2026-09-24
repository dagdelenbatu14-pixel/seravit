import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { PageHeader } from "@/components/layout/PageHeader";
import { GroutGrid, Texture } from "@/components/product/TileVisual";
import { SectionTitle } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Seravit Seramik Vitrifiye — Bodrum Mumcular'da showroom, perakende ve toptan satış.",
  alternates: { canonical: "/hakkimizda" },
};

const values = [
  ["Seçkinlik", "Her koleksiyonu dayanım, ton tutarlılığı ve Ege iklimine uygunluğuyla seçiyoruz."],
  ["Yakınlık", "Mumcular'daki showroomumuzda ürünü görmeden karar vermenizi istemiyoruz."],
  ["Güven", "Aynı partiden stok, doğru metraj ve zamanında teslim; projeniz aksamasın."],
];

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="Seravit" title="Hakkımızda" texture="calacatta-viola" grid="60×120" crumbs={[{ label: "Hakkımızda" }]} />

      {/* TODO: firma hikâyesi, kuruluş yılı, ekip, çalışılan markalar, referans projeler */}
      <section className="container-page grid items-center gap-14 py-24 lg:grid-cols-2">
        <div className="space-y-6 text-lg leading-relaxed text-ink-soft">
          <p className="font-display text-3xl leading-snug text-ink md:text-4xl">
            Seravit; seramiğin dayanımını, vitrifiyenin zarafetini ve Ege&apos;nin sükûnetini bir araya getirir.
          </p>
          <p>
            Bodrum Mumcular&apos;daki showroomumuzda seramik, porselen karo, vitrifiye, banyo mobilyası ve armatür
            koleksiyonlarını bir araya getiriyoruz.
          </p>
          <p>
            Ev sahiplerine perakende satış ve danışmanlık; müteahhit, mimar, otel ve bayilere ise toptan satış ve proje
            bazlı tedarik hizmeti sunuyoruz.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/showroom" className="btn-primary">
              Showroom&apos;u ziyaret edin
            </Link>
            <Link href="/toptan" className="btn-outline">
              Toptan & proje
            </Link>
          </div>
        </div>
        <div className="relative grid aspect-square place-items-center overflow-hidden rounded-3xl bg-linen">
          <Texture name="statuario-grey" sizes="50vw" className="opacity-60" />
          <GroutGrid size="60×60" />
          <Logo className="relative w-3/4" />
        </div>
      </section>

      <section className="bg-night py-20 text-paper" aria-labelledby="degerler">
        <div className="container-page">
          <SectionTitle id="degerler" tone="dark" title="Değerlerimiz" />
          <ul className="grid gap-10 md:grid-cols-3">
            {values.map(([t, d], i) => (
              <li key={t} className="space-y-3 border-t border-paper/15 pt-6">
                <span className="font-display text-sm text-gold-soft">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-3xl">{t}</h3>
                <p className="text-paper/65">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
