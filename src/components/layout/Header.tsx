import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { ProductIllustration } from "@/components/product/ProductIllustration";
import { Texture } from "@/components/product/TileVisual";
import { QuoteBadge } from "@/components/quote/QuoteBadge";
import { Icon } from "@/components/ui/Icon";
import { hoursSummary, mainNav, siteConfig } from "@/config/site";
import { getCollections, getFacets, getRootCategories } from "@/lib/catalog";
import { lookLabel, lookTexture, surfaceLabel, usageLabel } from "@/lib/labels";
import { MobileMenu, type MobileSection } from "./MobileMenu";
import Form from "next/form";

export async function Header() {
  const [facets, bathCats, collections] = await Promise.all([
    getFacets({ category: "seramik" }),
    getRootCategories("banyo"),
    getCollections(),
  ]);
  const signature = collections[0];

  const mobileSections: MobileSection[] = [
    {
      label: "Karolar",
      links: [
        { href: "/urunler/seramik", label: "Tüm karolar" },
        ...facets.looks.map((l) => ({ href: `/urunler/seramik?gorunum=${l.value}`, label: lookLabel[l.value] })),
        ...facets.usages.map((u) => ({ href: `/urunler/seramik?alan=${u.value}`, label: `${usageLabel[u.value]} karoları` })),
      ],
    },
    {
      label: "Banyo",
      links: [...bathCats.map((c) => ({ href: `/urunler/${c.slug}`, label: c.name })), { href: "/urunler/yapi-kimyasallari", label: "Yapı Kimyasalları" }],
    },
  ];

  return (
    <header className="sticky top-0 z-40">
      {/* Duyuru çubuğu — geniş ekranda tek satır, dar ekranda aynı içerik kayan şerit olarak */}
      <div className="bg-night text-xs text-paper/80">
        <div className="container-page hidden min-h-9 items-center justify-between gap-6 xl:flex">
          <p className="flex items-center gap-2">
            <Icon name="pin" className="size-3.5" />
            {siteConfig.address.locality}, {siteConfig.address.district}
            <span className="text-paper/30">|</span>
            <Icon name="clock" className="size-3.5" />
            {hoursSummary()}
          </p>
          <ul className="flex items-center gap-6">
            {siteConfig.announcements.map((a) => (
              <li key={a} className="flex items-center gap-2 whitespace-nowrap">
                <span className="size-1 rounded-full bg-gold" aria-hidden />
                {a}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-5">
            <Link href="/toptan#basvuru" className="hover:text-paper">
              Bayi / Proje Başvurusu
            </Link>
            <a href={siteConfig.contact.phoneHref} className="flex items-center gap-1.5 hover:text-paper">
              <Icon name="phone" className="size-3.5" />
              {siteConfig.contact.phone}
            </a>
          </div>
        </div>

        <div className="overflow-hidden motion-reduce:overflow-x-auto xl:hidden">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1} className="flex min-h-9 shrink-0 items-center gap-7 pr-7 whitespace-nowrap">
                <li className="flex items-center gap-1.5">
                  <Icon name="pin" className="size-3.5" />
                  {siteConfig.address.locality}, {siteConfig.address.district}
                </li>
                <li className="flex items-center gap-1.5">
                  <Icon name="clock" className="size-3.5" />
                  {hoursSummary()}
                </li>
                {siteConfig.announcements.map((a) => (
                  <li key={a} className="flex items-center gap-2">
                    <span className="size-1 rounded-full bg-gold" aria-hidden />
                    {a}
                  </li>
                ))}
                <li>
                  <Link href="/toptan#basvuru" tabIndex={copy === 1 ? -1 : undefined} className="underline-offset-4 hover:underline">
                    Bayi / Proje Başvurusu
                  </Link>
                </li>
                <li>
                  <a href={siteConfig.contact.phoneHref} tabIndex={copy === 1 ? -1 : undefined} className="flex items-center gap-1.5">
                    <Icon name="phone" className="size-3.5" />
                    {siteConfig.contact.phone}
                  </a>
                </li>
              </ul>
            ))}
          </div>
        </div>
      </div>

      {/* Ana çubuk */}
      <div className="relative border-b border-line bg-paper/95 backdrop-blur">
        <div className="container-page flex h-[76px] items-center gap-6">
          <Link href="/" className="shrink-0" aria-label="Seravit ana sayfa">
            <Logo className="h-12 w-auto md:h-14" tagline={false} />
          </Link>

          <nav aria-label="Ana menü" className="mx-auto hidden h-full lg:block">
            <ul className="flex h-full items-center gap-1">
              {mainNav.map((item) => (
                <li key={item.href} className="group h-full">
                  <Link
                    href={item.href}
                    className="relative flex h-full items-center gap-1 px-3.5 text-[15px] after:absolute after:inset-x-3.5 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-amethyst-700 after:transition-transform hover:text-amethyst-700 group-hover:after:scale-x-100"
                  >
                    {item.label}
                    {"mega" in item && <Icon name="chevron-down" className="size-3.5 opacity-60" />}
                  </Link>

                  {"mega" in item && item.mega === "karo" && (
                    <MegaPanel>
                      <div className="grid grid-cols-[1.3fr_1fr_1fr_1fr_1.2fr] gap-10">
                        <MegaColumn title="Görünüm">
                          <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
                            {facets.looks.map((l) => (
                              <li key={l.value}>
                                <Link href={`/urunler/seramik?gorunum=${l.value}`} className="flex items-center gap-3 text-sm hover:text-amethyst-700">
                                  <span className="relative size-9 shrink-0 overflow-hidden rounded-full ring-1 ring-line">
                                    <Texture name={lookTexture[l.value]} sizes="36px" className="scale-150" />
                                  </span>
                                  {lookLabel[l.value]}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </MegaColumn>
                        <MegaColumn title="Yüzey">
                          <MegaLinks links={facets.surfaces.map((s) => ({ href: `/urunler/seramik?yuzey=${s.value}`, label: surfaceLabel[s.value] }))} />
                        </MegaColumn>
                        <MegaColumn title="Ebat (cm)">
                          <MegaLinks links={facets.sizes.map((s) => ({ href: `/urunler/seramik?ebat=${encodeURIComponent(s.value)}`, label: s.value }))} />
                        </MegaColumn>
                        <MegaColumn title="Kullanım alanı">
                          <MegaLinks links={facets.usages.map((u) => ({ href: `/urunler/seramik?alan=${u.value}`, label: usageLabel[u.value] }))} />
                        </MegaColumn>
                        {signature && (
                          <Link href={`/urunler?koleksiyon=${signature.slug}`} className="group/card relative block min-h-56 overflow-hidden rounded-2xl">
                            <Texture name={signature.texture} sizes="300px" className="transition-transform duration-700 group-hover/card:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/10 to-transparent" />
                            <div className="absolute inset-x-5 bottom-5 text-paper">
                              <p className="text-[11px] uppercase tracking-(--tracking-brand) text-gold-soft">Seravit imzası</p>
                              <p className="font-display text-2xl">{signature.name}</p>
                            </div>
                          </Link>
                        )}
                      </div>
                    </MegaPanel>
                  )}

                  {"mega" in item && item.mega === "banyo" && (
                    <MegaPanel>
                      <div className="grid grid-cols-[3fr_1.2fr] gap-10">
                        <ul className="grid grid-cols-4 gap-4">
                          {bathCats.map((c) => (
                            <li key={c.slug}>
                              <Link href={`/urunler/${c.slug}`} className="group/c flex flex-col items-center gap-3 rounded-2xl bg-linen p-5 text-center text-sm hover:bg-mist">
                                {c.icon && <ProductIllustration icon={c.icon} className="size-20 text-ink/70 transition-transform group-hover/c:scale-105" />}
                                {c.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <Link href="/showroom?tip=kesif#randevu" className="group/card flex flex-col justify-between rounded-2xl bg-night p-6 text-paper">
                          <Icon name="ruler" className="size-8 text-gold-soft" />
                          <div>
                            <p className="font-display text-2xl">Ücretsiz keşif & metraj</p>
                            <p className="mt-2 text-sm text-paper/70">Banyonuzu yerinde ölçelim, ürün ve metraj listenizi hazırlayalım.</p>
                          </div>
                          <span className="text-sm text-gold-soft">Randevu al →</span>
                        </Link>
                      </div>
                    </MegaPanel>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Form action="/urunler" role="search" className="relative hidden xl:block">
              <label htmlFor="header-q" className="sr-only">
                Ürün ara
              </label>
              <input
                id="header-q"
                name="q"
                type="search"
                placeholder="Ürün, koleksiyon, kod…"
                className="h-11 w-56 rounded-full border border-line bg-white pl-10 pr-4 text-sm placeholder:text-ink-soft/60 focus:border-amethyst-500 focus:outline-none"
              />
              <Icon name="search" className="pointer-events-none absolute left-3.5 top-3 size-5 text-ink-soft" />
            </Form>
            <Link href="/urunler" aria-label="Ürün ara" className="grid size-11 place-items-center rounded-full hover:bg-linen xl:hidden">
              <Icon name="search" />
            </Link>
            <QuoteBadge />
            <MobileMenu sections={mobileSections} />
          </div>
        </div>
      </div>
    </header>
  );
}

function MegaPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="invisible absolute inset-x-0 top-full border-y border-line bg-paper opacity-0 shadow-[0_30px_60px_-30px_rgba(20,17,21,.35)] transition-[opacity,visibility] delay-100 duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
      <div className="container-page py-10">{children}</div>
    </div>
  );
}

function MegaColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow mb-4 border-b border-line pb-3">{title}</p>
      {children}
    </div>
  );
}

function MegaLinks({ links }: { links: { href: string; label: string }[] }) {
  return (
    <ul className="space-y-2.5 text-sm">
      {links.map((l) => (
        <li key={l.href}>
          <Link href={l.href} className="hover:text-amethyst-700">
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
