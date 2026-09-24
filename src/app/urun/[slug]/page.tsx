import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/PageHeader";
import { ProductCard, ProductGrid } from "@/components/product/ProductCard";
import { TileVisual } from "@/components/product/TileVisual";
import { AddToQuote } from "@/components/quote/AddToQuote";
import { JsonLd, productJsonLd } from "@/components/seo/JsonLd";
import { Carousel } from "@/components/ui/Carousel";
import { Icon, type IconName } from "@/components/ui/Icon";
import { siteConfig, whatsappLink } from "@/config/site";
import {
  getAllProductSlugs,
  getCategory,
  getCollection,
  getCollectionProducts,
  getProduct,
  getRelatedProducts,
} from "@/lib/catalog";
import { featureLabel, lookLabel, surfaceLabel, usageLabel } from "@/lib/labels";
import { discountedPrice, formatPrice, stockLabel, unitLabel } from "@/lib/pricing";
import type { Product } from "@/lib/types";

export async function generateStaticParams() {
  return (await getAllProductSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/urun/[slug]">): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.summary,
    alternates: { canonical: `/urun/${product.slug}` },
    openGraph: product.images[0] ? { images: [product.images[0]] } : undefined,
  };
}

/** Varyant seçenekleri: belirli bir alanda farklı olan, diğer alanlarda en yakın eşleşen kardeş ürün */
function variantOptions(product: Product, siblings: Product[], key: "size" | "surface" | "colorName") {
  const values = [...new Set(siblings.map((s) => s[key]).filter(Boolean))] as string[];
  if (values.length < 2) return [];
  const others = (["size", "surface", "colorName"] as const).filter((k) => k !== key);
  return values.map((value) => {
    const candidates = siblings.filter((s) => s[key] === value);
    const best = candidates.sort(
      (a, b) => others.filter((k) => b[k] === product[k]).length - others.filter((k) => a[k] === product[k]).length,
    )[0];
    return { value, slug: best.slug, active: product[key] === value, hex: best.colorHex };
  });
}

const stockTone: Record<Product["stock"], string> = {
  stokta: "bg-emerald-500",
  sinirli: "bg-amber-500",
  siparis: "bg-sky-500",
  tukendi: "bg-red-500",
};

export default async function ProductPage({ params }: PageProps<"/urun/[slug]">) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();

  const [category, related, collection, siblings] = await Promise.all([
    getCategory(product.category),
    getRelatedProducts(product),
    product.collection ? getCollection(product.collection) : Promise.resolve(undefined),
    product.collection ? getCollectionProducts(product.collection) : Promise.resolve([] as Product[]),
  ]);
  const parent = category?.parent ? await getCategory(category.parent) : undefined;
  const unit = unitLabel[product.unit];

  const sizes = variantOptions(product, siblings, "size");
  const surfaces = variantOptions(product, siblings, "surface");
  const colors = variantOptions(product, siblings, "colorName");
  const collectionOthers = siblings.filter((s) => s.slug !== product.slug);

  return (
    <>
      <JsonLd data={productJsonLd(product)} />

      <div className="container-page pt-8">
        <Breadcrumbs
          crumbs={[
            { href: "/urunler", label: "Ürünler" },
            ...(parent ? [{ href: `/urunler/${parent.slug}`, label: parent.name }] : []),
            ...(category ? [{ href: `/urunler/${category.slug}`, label: category.name }] : []),
            { label: product.name },
          ]}
        />
      </div>

      <div className="container-page grid gap-10 py-8 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        {/* Galeri (Güral mozaik) */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          {product.texture ? (
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <TileVisual product={product} mode="laid" priority sizes="(min-width:1024px) 45vw, 100vw" className="col-span-3 row-span-2 aspect-[4/3] rounded-2xl sm:col-span-2 sm:aspect-auto" />
              <TileVisual product={product} mode="closeup" sizes="20vw" className="hidden aspect-square rounded-2xl sm:block" />
              <SizeDiagram size={product.size} />
              {collection && (
                <div className="col-span-3 flex items-center justify-between gap-4 rounded-2xl bg-night px-6 py-5 text-paper">
                  <div>
                    <p className="text-[11px] uppercase tracking-(--tracking-brand) text-gold-soft">{lookLabel[collection.look]} koleksiyonu</p>
                    <p className="font-display text-2xl">{collection.name}</p>
                  </div>
                  <p className="hidden max-w-xs text-sm text-paper/70 md:block">{collection.tagline}</p>
                </div>
              )}
            </div>
          ) : (
            <TileVisual product={product} priority sizes="(min-width:1024px) 50vw, 100vw" className="aspect-square rounded-3xl" />
          )}
          <p className="mt-3 text-xs text-ink-soft">
            Görseller temsilidir; gerçek renk ve dokuyu showroom&apos;da numune üzerinde inceleyebilirsiniz.
          </p>
        </div>

        {/* Bilgi */}
        <div className="space-y-8">
          <header className="space-y-3">
            <p className="eyebrow">
              {[product.look && lookLabel[product.look], product.brand].filter(Boolean).join(" · ")}
            </p>
            <h1 className="text-4xl leading-tight md:text-5xl">{product.name}</h1>
            <p className="text-sm text-ink-soft">Ürün kodu: {product.sku}</p>
            <p className="text-lg text-ink-soft">{product.summary}</p>
          </header>

          <div className="flex flex-wrap items-end justify-between gap-4 border-y border-line py-6">
            <div>
              {product.retailPrice ? (
                <p className="font-display text-4xl">
                  {formatPrice(product.retailPrice)}
                  <span className="font-sans text-base text-ink-soft"> / {unit}</span>
                </p>
              ) : (
                <p className="font-display text-3xl">Fiyat için teklif alın</p>
              )}
              <p className="mt-1 text-xs text-ink-soft">KDV dahil perakende fiyat · Toptan fiyatlar miktara göre</p>
            </div>
            <div className="flex flex-col items-end gap-1 text-sm">
              <span className="flex items-center gap-2">
                <span className={`size-2 rounded-full ${stockTone[product.stock]}`} aria-hidden />
                {stockLabel[product.stock]}
              </span>
              {product.inShowroom && (
                <Link href="/showroom" className="flex items-center gap-1.5 text-amethyst-700 hover:underline">
                  <Icon name="store" className="size-4" /> Showroom&apos;da sergileniyor
                </Link>
              )}
            </div>
          </div>

          {/* Varyantlar */}
          {(sizes.length > 0 || surfaces.length > 0 || colors.length > 0) && (
            <div className="space-y-5">
              {colors.length > 0 && (
                <VariantGroup label="Renk" current={product.colorName}>
                  {colors.map((c) => (
                    <Link
                      key={c.value}
                      href={`/urun/${c.slug}`}
                      aria-current={c.active}
                      title={c.value}
                      className={`size-10 rounded-full ring-offset-2 transition ${c.active ? "ring-2 ring-ink" : "ring-1 ring-line hover:ring-ink/40"}`}
                      style={{ background: c.hex }}
                    >
                      <span className="sr-only">{c.value}</span>
                    </Link>
                  ))}
                </VariantGroup>
              )}
              {sizes.length > 0 && (
                <VariantGroup label="Ebat" current={product.size && `${product.size} cm`}>
                  {sizes.map((s) => (
                    <VariantChip key={s.value} href={`/urun/${s.slug}`} active={s.active}>
                      {s.value}
                    </VariantChip>
                  ))}
                </VariantGroup>
              )}
              {surfaces.length > 0 && (
                <VariantGroup label="Yüzey" current={product.surface && surfaceLabel[product.surface]}>
                  {surfaces.map((s) => (
                    <VariantChip key={s.value} href={`/urun/${s.slug}`} active={s.active}>
                      {surfaceLabel[s.value as keyof typeof surfaceLabel] ?? s.value}
                    </VariantChip>
                  ))}
                </VariantGroup>
              )}
            </div>
          )}

          <AddToQuote
            slug={product.slug}
            name={product.name}
            sku={product.sku}
            unit={product.unit}
            retailPrice={product.retailPrice}
            tiers={product.wholesaleTiers}
            packSize={product.packSize}
            wastePct={siteConfig.wastePct}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href={whatsappLink(`Merhaba, ${product.name} (${product.sku}) hakkında bilgi almak istiyorum.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              <Icon name="chat" className="size-4" /> WhatsApp ile sor
            </a>
            <Link href="/showroom?tip=kesif#randevu" className="btn-outline">
              <Icon name="ruler" className="size-4" /> Keşif & metraj iste
            </Link>
          </div>

          {/* Özellik ikonları (Güral) */}
          {product.features.length > 0 && (
            <section aria-labelledby="ozellikler">
              <h2 id="ozellikler" className="eyebrow mb-4 font-sans">
                Özellikler
              </h2>
              <ul className="grid grid-cols-4 gap-3 sm:grid-cols-6">
                {product.features.map((f) => (
                  <li key={f} className="flex flex-col items-center gap-2 text-center text-[11px] leading-tight text-ink-soft">
                    <span className="grid size-12 place-items-center rounded-xl border border-ink/80 text-ink">
                      <Icon name={f as IconName} className="size-6" />
                    </span>
                    {featureLabel[f]}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Toptan kademe */}
          {product.wholesaleTiers?.length ? (
            <section aria-labelledby="toptan" className="rounded-2xl bg-mist p-5">
              <h2 id="toptan" className="mb-3 flex items-center gap-2 font-sans text-sm font-semibold">
                <Icon name="percent" className="size-4 text-amethyst-700" /> Toptan & proje fiyatı
              </h2>
              <table className="w-full text-sm">
                <thead className="text-left text-ink-soft">
                  <tr>
                    <th className="pb-2 font-normal">Miktar</th>
                    <th className="pb-2 font-normal">İndirim</th>
                    {product.retailPrice && <th className="pb-2 text-right font-normal">Birim fiyat</th>}
                  </tr>
                </thead>
                <tbody>
                  {product.wholesaleTiers.map((t) => (
                    <tr key={t.minQty} className="border-t border-amethyst-100">
                      <td className="py-2">
                        {t.minQty}+ {unit}
                      </td>
                      <td className="py-2">%{t.discountPct}</td>
                      {product.retailPrice && <td className="py-2 text-right">{formatPrice(discountedPrice(product.retailPrice, t.discountPct))}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-xs text-ink-soft">
                Daha yüksek hacimler ve bayi fiyatları için{" "}
                <Link href="/toptan" className="underline underline-offset-4">
                  toptan satış
                </Link>
                .
              </p>
            </section>
          ) : null}

          {/* Teknik özellikler (Güral) */}
          <section aria-labelledby="teknik" className="space-y-4">
            <h2 id="teknik" className="text-2xl">
              Teknik özellikler
            </h2>
            <p className="text-ink-soft">{product.description}</p>
            <dl className="divide-y divide-dashed divide-line border-y border-line text-sm">
              {Object.entries(product.specs).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-2.5">
                  <dt className="font-medium">{k}</dt>
                  <dd className="text-right text-ink-soft">{v}</dd>
                </div>
              ))}
              {product.usage.length > 0 && (
                <div className="flex justify-between gap-4 py-2.5">
                  <dt className="font-medium">Kullanım alanı</dt>
                  <dd className="text-right text-ink-soft">{product.usage.map((u) => usageLabel[u]).join(", ")}</dd>
                </div>
              )}
            </dl>
          </section>

          <ul className="grid gap-3 text-sm sm:grid-cols-2">
            {(
              [
                ["truck", "Bodrum geneline teslimat", "Şantiye ve adrese paletli teslim."],
                ["store", "Numune & inceleme", "Showroom'da gerçek ışıkta görün."],
              ] as [IconName, string, string][]
            ).map(([icon, t, d]) => (
              <li key={t} className="flex gap-3 rounded-xl bg-linen p-4">
                <Icon name={icon} className="size-5 shrink-0 text-amethyst-700" />
                <span>
                  <strong className="block font-medium">{t}</strong>
                  <span className="text-ink-soft">{d}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {collectionOthers.length > 0 && collection && (
        <section className="bg-linen py-20" aria-labelledby="koleksiyon">
          <div className="container-page">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow mb-3">Aynı koleksiyondan</p>
                <h2 id="koleksiyon" className="title-tracked text-3xl">
                  {collection.name}
                </h2>
              </div>
              <Link href={`/urunler?koleksiyon=${collection.slug}`} className="text-sm underline underline-offset-4">
                Tüm koleksiyon →
              </Link>
            </div>
            <ProductGrid products={collectionOthers} />
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="container-page py-20" aria-labelledby="benzer">
          <p className="eyebrow mb-3">Bunlar da ilginizi çekebilir</p>
          <h2 id="benzer" className="title-tracked mb-10 text-3xl">
            Benzer ürünler
          </h2>
          <Carousel label="Benzer ürünler" itemClassName="w-[70%] sm:w-[40%] lg:w-[23.5%]">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </Carousel>
        </section>
      )}
    </>
  );
}

function VariantGroup({ label, current, children }: { label: string; current?: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2.5 text-sm">
        <span className="font-medium">{label}</span>
        {current && <span className="text-ink-soft">: {current}</span>}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function VariantChip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active}
      className={`inline-flex min-h-10 items-center rounded-lg border px-4 text-sm transition-colors ${
        active ? "border-ink bg-ink text-paper" : "border-line bg-white hover:border-ink/50"
      }`}
    >
      {children}
    </Link>
  );
}

/** Ebat şeması: karonun oranını ve ölçüsünü gösterir */
function SizeDiagram({ size }: { size?: string }) {
  const [a, b] = (size ?? "").split("×").map((v) => parseFloat(v.replace(",", ".")));
  if (!a || !b) return <div className="hidden aspect-square rounded-2xl bg-linen sm:block" />;
  const max = Math.max(a, b);
  const w = (a / max) * 70;
  const h = (b / max) * 70;
  return (
    <div className="hidden aspect-square flex-col items-center justify-center gap-3 rounded-2xl bg-linen sm:flex">
      <div className="relative border-2 border-ink/80 bg-white" style={{ width: `${w}%`, height: `${h}%` }}>
        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-ink-soft">{a} cm</span>
        <span className="absolute -right-1 top-1/2 translate-x-full -translate-y-1/2 pl-1 text-[10px] text-ink-soft">{b} cm</span>
      </div>
      <p className="eyebrow text-[10px]">Ebat</p>
    </div>
  );
}
