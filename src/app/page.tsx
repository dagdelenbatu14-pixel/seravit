import Link from "next/link";
import { HeroSlider, type HeroSlide } from "@/components/home/HeroSlider";
import { SwatchStack } from "@/components/home/SwatchStack";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductIllustration } from "@/components/product/ProductIllustration";
import { GroutGrid, Texture } from "@/components/product/TileVisual";
import { Carousel } from "@/components/ui/Carousel";
import { Icon } from "@/components/ui/Icon";
import { ArrowCircle, SectionTitle, TextLink } from "@/components/ui/Section";
import { getCollection, getFacets, getFeaturedProducts } from "@/lib/catalog";
import { lookLabel, lookTexture, usageLabel, usageTexture } from "@/lib/labels";
import type { Usage } from "@/lib/types";

const slides: HeroSlide[] = [
  {
    texture: "hero-nero",
    tone: "dark",
    eyebrow: "Bodrum · Mumcular Showroom",
    title: ["Yüzeylerin ", "zarafeti", ", banyonun sükûneti."],
    text: "Seramik, porselen karo, vitrifiye ve armatür — seçkin koleksiyonlar tek çatı altında.",
    cta: { href: "/urunler/seramik", label: "Koleksiyonları keşfet" },
    cta2: { href: "/showroom#randevu", label: "Showroom randevusu" },
    caption: "Nero Marquina · 60×120 Parlak",
    ink: true,
  },
  {
    texture: "hero-viola",
    tone: "light",
    eyebrow: "Seravit imzası",
    title: ["Calacatta ", "Viola", ""],
    text: "Beyaz zeminde ametist ve altın damarlar. 60×120 parlak ve 80×160 lappato ebatlarında.",
    cta: { href: "/urunler?koleksiyon=calacatta-viola", label: "Koleksiyonu incele" },
    cta2: { href: "/urun/calacatta-viola-60x120-parlak", label: "Fiyat & metraj" },
    caption: "Calacatta Viola · 80×160 Lappato",
  },
  {
    texture: "hero-travertino",
    tone: "light",
    eyebrow: "Toptan & proje tedariği",
    title: ["Villa ve otel projelerine ", "toplu", " tedarik."],
    text: "Metrajınızı gönderin; stok, termin ve şantiyeye teslim dahil proje teklifinizi hazırlayalım.",
    cta: { href: "/toptan", label: "Proje teklifi iste" },
    cta2: { href: "/toptan#basvuru", label: "Bayi başvurusu" },
    caption: "Travertino Beige · 60×120 Mat",
  },
];

const bento: { usage: Usage; text: string; className: string }[] = [
  { usage: "banyo", text: "Duvar, zemin ve duş alanları", className: "md:col-span-2 md:row-span-2" },
  { usage: "mutfak", text: "Tezgâh arası ve zemin", className: "" },
  { usage: "ic-mekan", text: "Salon, antre, ofis", className: "" },
  { usage: "dis-mekan", text: "20 mm kaymaz seriler", className: "" },
  { usage: "havuz", text: "Mozaik ve havuz başı", className: "" },
];

export default async function HomePage() {
  const [featured, facets, viola, travertino] = await Promise.all([
    getFeaturedProducts(8),
    getFacets({ category: "seramik" }),
    getCollection("calacatta-viola"),
    getCollection("travertino"),
  ]);
  const stories = [
    { c: viola, size: "60×120", label: "Mermer koleksiyonu", subtitle: "Detaydaki incelik, bütündeki sükûnet." },
    { c: travertino, size: "60×60", label: "Doğal taş koleksiyonu", subtitle: "Ege'nin taş evlerinden ilham." },
  ];

  return (
    <>
      <HeroSlider slides={slides} />

      {/* İKİ DÜNYA (Bien) */}
      <section className="container-page grid gap-5 py-20 md:grid-cols-2" aria-label="Ürün dünyaları">
        <Link href="/urunler/seramik" className="group relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-2xl p-8 text-paper md:min-h-[420px]">
          <Texture name="statuario-grey" sizes="(min-width:768px) 50vw, 100vw" className="transition-transform duration-1000 group-hover:scale-105" />
          <GroutGrid size="60×120" />
          <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/20 to-transparent" />
          <div className="relative flex items-end justify-between gap-6">
            <div>
              <p className="text-[11px] uppercase tracking-(--tracking-brand) text-gold-soft">Seravit dünyası</p>
              <h2 className="mt-2 text-4xl md:text-5xl">Karolar</h2>
              <p className="mt-2 max-w-sm text-paper/80">Porselen, duvar, dış mekân ve havuz karoları.</p>
            </div>
            <ArrowCircle dark />
          </div>
        </Link>
        <Link href="/urunler?dunya=banyo" className="group relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-2xl bg-linen p-8 md:min-h-[420px]">
          <div className="absolute inset-x-0 top-6 flex items-end justify-center gap-2 text-ink/60 md:top-10">
            <ProductIllustration icon="dus" className="w-32 md:w-44" />
            <ProductIllustration icon="lavabo" className="w-36 transition-transform duration-700 group-hover:-translate-y-2 md:w-52" />
            <ProductIllustration icon="klozet" className="w-28 md:w-36" />
          </div>
          <div className="relative flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-amethyst-700">Seravit dünyası</p>
              <h2 className="mt-2 text-4xl md:text-5xl">Banyo Ürünleri</h2>
              <p className="mt-2 max-w-sm text-ink-soft">Vitrifiye, armatür, mobilya ve aksesuar.</p>
            </div>
            <ArrowCircle />
          </div>
        </Link>
      </section>

      {/* KOLEKSİYONLAR (Güral) */}
      <section className="overflow-hidden bg-linen py-20 md:py-28" aria-labelledby="koleksiyonlar">
        <div className="container-page">
          <SectionTitle id="koleksiyonlar" title="Koleksiyonlar" lead="Mermerden ahşaba, betondan mozaiğe; her görünüm için özenle seçilmiş seriler." />
          <Carousel label="Karo görünümleri" itemClassName="w-[70%] sm:w-[40%] lg:w-[23%]">
            {facets.looks.map((l) => (
              <Link
                key={l.value}
                href={`/urunler/seramik?gorunum=${l.value}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-[28px] shadow-lg shadow-night/10"
              >
                <Texture name={lookTexture[l.value]} sizes="(min-width:1024px) 23vw, 70vw" className="transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-night/75 via-transparent to-transparent" />
                <div className="absolute inset-x-6 bottom-6 flex items-end justify-between text-paper">
                  <div>
                    <p className="font-display text-3xl">{lookLabel[l.value]}</p>
                    <p className="text-sm text-paper/70">{l.count} ürün</p>
                  </div>
                  <ArrowCircle dark className="size-10" />
                </div>
              </Link>
            ))}
          </Carousel>
        </div>
      </section>

      {/* KOLEKSİYON HİKÂYELERİ (Güral) */}
      <section aria-label="Öne çıkan koleksiyonlar" className="container-page space-y-24 py-24 md:space-y-32 md:py-32">
        {stories.map(({ c, size, label, subtitle }, i) =>
          c ? (
            <article key={c.slug} className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <div className={i % 2 ? "lg:order-2" : ""}>
                <SwatchStack texture={c.texture} size={size} flip={i % 2 === 1} label={label} />
              </div>
              <div className="max-w-lg">
                <h2 className="text-5xl uppercase tracking-tight md:text-6xl">{c.name}</h2>
                <span aria-hidden className="mt-5 block h-0.5 w-16 bg-ink" />
                <p className="mt-6 font-display text-2xl italic text-ink-soft md:text-3xl">{subtitle}</p>
                <p className="mt-6 leading-relaxed text-ink-soft">{c.story}</p>
                <div className="mt-8">
                  <TextLink href={`/urunler?koleksiyon=${c.slug}`}>Koleksiyonu incele</TextLink>
                </div>
              </div>
            </article>
          ) : null,
        )}
      </section>

      {/* HAVUZ & TERAS — dikey dev yazı (Güral) */}
      <section className="bg-night py-16 text-paper md:py-24" aria-labelledby="havuz-teras">
        <div className="container-page grid items-center gap-10 lg:grid-cols-[auto_1fr]">
          <p aria-hidden className="hidden rotate-180 self-center font-sans text-[5.5rem] font-semibold uppercase leading-none tracking-[0.12em] text-paper/90 [writing-mode:vertical-rl] lg:block">
            Bodrum
          </p>
          <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-end">
            <Link href="/urunler/dis-mekan-havuz" className="group relative block aspect-[16/10] overflow-hidden shadow-2xl">
              <div className="absolute inset-0 grid grid-cols-[1fr_22%]">
                <div className="relative">
                  <Texture name="bodrum-stone" sizes="(min-width:1024px) 55vw, 100vw" className="transition-transform duration-1000 group-hover:scale-105" />
                  <GroutGrid size="60×60" />
                </div>
                <div className="relative border-l-8 border-[#ddd6c8]">
                  <Texture name="aegean-mozaik" sizes="20vw" />
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-[#0b4f78]/30 mix-blend-overlay" />
                </div>
              </div>
            </Link>
            <div className="space-y-5">
              <p className="text-[11px] uppercase tracking-(--tracking-brand) text-gold-soft">Dış mekân & havuz</p>
              <h2 id="havuz-teras" className="text-4xl md:text-5xl">
                Havuz başından terasa, <em className="text-amethyst-300">tek dil.</em>
              </h2>
              <p className="text-paper/70">
                20 mm kalınlıkta, R11 kaymaz ve dona dayanıklı Bodrum Stone; Ege mavisi cam mozaiklerle birlikte. Yazlık, villa ve
                otel projeleri için stoktan tedarik.
              </p>
              <TextLink href="/urunler/dis-mekan-havuz" dark>
                Dış mekân serileri
              </TextLink>
            </div>
          </div>
        </div>
      </section>

      {/* YAŞAM ALANLARI — bento (Bien) */}
      <section className="container-page py-24" aria-labelledby="alanlar">
        <SectionTitle id="alanlar" eyebrow="Kullanım alanları" title="Yaşam alanlarınızı keşfedin" />
        <div className="grid auto-rows-[220px] gap-4 md:grid-cols-4 md:auto-rows-[240px]">
          {bento.map((b) => (
            <Link key={b.usage} href={`/urunler/seramik?alan=${b.usage}`} className={`group relative overflow-hidden rounded-2xl ${b.className}`}>
              <Texture name={usageTexture[b.usage]} sizes="(min-width:768px) 50vw, 100vw" className="transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-night/10 to-transparent" />
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 text-paper">
                <div>
                  <p className="font-display text-2xl md:text-3xl">{usageLabel[b.usage]} karoları</p>
                  <p className="text-sm text-paper/75">{b.text}</p>
                </div>
                <ArrowCircle dark direction="up-right" className="size-10" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* HİZMET BANDI (VitrA keşif hizmeti) */}
      <section className="container-page pb-24" aria-labelledby="kesif">
        <div className="grid overflow-hidden rounded-3xl bg-mist lg:grid-cols-[1.15fr_1fr]">
          <div className="space-y-8 p-8 md:p-14">
            <h2 id="kesif" className="text-4xl leading-tight md:text-5xl">
              Beğendiğiniz karoyu <em className="text-amethyst-700">almadan önce</em> yerinde görün.
            </h2>
            <ul className="grid gap-6 sm:grid-cols-2">
              <li className="flex gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-paper text-amethyst-700">
                  <Icon name="store" className="size-6" />
                </span>
                <p className="text-sm text-ink-soft">
                  <strong className="block font-medium text-ink">Showroom&apos;da inceleme</strong>
                  Büyük ebatları gerçek ışıkta, yan yana karşılaştırın; numune alın.
                </p>
              </li>
              <li className="flex gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-paper text-amethyst-700">
                  <Icon name="ruler" className="size-6" />
                </span>
                <p className="text-sm text-ink-soft">
                  <strong className="block font-medium text-ink">Ücretsiz keşif & metraj</strong>
                  Uzmanımız mekânınızı ölçer, fireli metraj ve ürün listesini hazırlar.
                </p>
              </li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <Link href="/showroom?tip=kesif#randevu" className="btn-primary">
                Keşif randevusu al
                <Icon name="arrow-right" className="size-4" />
              </Link>
              <Link href="/showroom" className="btn-outline">
                Showroom&apos;u tanıyın
              </Link>
            </div>
          </div>
          <div className="relative min-h-[360px]">
            <Texture name="nero-marquina" sizes="(min-width:1024px) 45vw, 100vw" />
            <GroutGrid size="60×120" dark />
            <div className="absolute bottom-8 left-8 right-8 max-w-sm rounded-2xl bg-paper/95 p-5 shadow-2xl backdrop-blur md:left-auto">
              <p className="eyebrow mb-3">Metraj örneği</p>
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-soft">Banyo duvarı</dt>
                  <dd>18,4 m²</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-soft">+ %10 fire</dt>
                  <dd>20,2 m²</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-line pt-2 font-medium">
                  <dt>Nero Marquina 60×120</dt>
                  <dd>15 kutu · 21,6 m²</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* ÖNE ÇIKANLAR (VitrA çok satanlar) */}
      <section className="border-t border-line bg-paper py-24" aria-labelledby="sevilenler">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-x-6">
            <SectionTitle id="sevilenler" align="left" eyebrow="Seçkiler" title="Showroom'un sevilenleri" />
            <div className="mb-10 md:mb-12">
              <TextLink href="/urunler">Tüm ürünler</TextLink>
            </div>
          </div>
          <Carousel label="Öne çıkan ürünler" itemClassName="w-[70%] sm:w-[40%] lg:w-[23.5%]">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </Carousel>
        </div>
      </section>

      {/* PROFESYONELLER (VitrA "Profesyonellere Özel") */}
      <section className="relative overflow-hidden bg-night text-paper" aria-labelledby="pro">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 lg:block">
          <Texture name="hero-travertino" sizes="50vw" className="opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-night to-transparent" />
        </div>
        <div className="container-page relative grid gap-12 py-20 md:py-28 lg:grid-cols-2">
          <div className="space-y-6">
            <p className="text-[11px] uppercase tracking-(--tracking-brand) text-gold-soft">Profesyonellere özel</p>
            <h2 id="pro" className="text-4xl md:text-5xl">Müteahhit, mimar, otel ve bayiler için toplu tedarik.</h2>
            <p className="max-w-lg text-paper/70">
              Proje bazlı fiyatlandırma, stok rezervasyonu ve termin planıyla; Bodrum yarımadası ve Milas genelinde şantiyeye teslim.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/toptan" className="btn-light">
                Toptan satış
              </Link>
              <Link href="/toptan#basvuru" className="btn-outline-light">
                Bayi / proje hesabı aç
              </Link>
            </div>
          </div>
          {/* TODO: rakamları işletmenin gerçek koşullarıyla doğrulayın */}
          <dl className="grid grid-cols-2 gap-px self-end overflow-hidden rounded-2xl bg-paper/10">
            {[
              ["%15'e varan", "kademeli toptan indirim"],
              ["24 saat", "içinde proje teklifi"],
              ["20+", "ebat ve yüzey seçeneği"],
              ["Şantiyeye", "paletli teslimat"],
            ].map(([k, v]) => (
              <div key={v} className="bg-night/80 p-6 backdrop-blur">
                <dt className="font-display text-3xl text-paper">{k}</dt>
                <dd className="mt-1 text-sm text-paper/60">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
