import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Icon, type IconName } from "@/components/ui/Icon";
import { fullAddress, siteConfig, whatsappLink } from "@/config/site";
import { getFacets, getRootCategories } from "@/lib/catalog";
import { lookLabel, usageLabel } from "@/lib/labels";

const usps: { icon: IconName; title: string; text: string }[] = [
  { icon: "store", title: "Showroom'da görün", text: "Karoları gerçek ışıkta, yan yana inceleyin." },
  { icon: "ruler", title: "Ücretsiz keşif & metraj", text: "Yerinde ölçüm, fireli metraj hesabı." },
  { icon: "percent", title: "Toptan kademeli fiyat", text: "Proje, otel ve bayilere özel koşullar." },
  { icon: "truck", title: "Şantiyeye teslimat", text: "Bodrum yarımadası ve Milas geneli." },
];

export async function Footer() {
  const [facets, bath] = await Promise.all([getFacets({ category: "seramik" }), getRootCategories("banyo")]);

  return (
    <footer className="mt-auto">
      {/* Güven / hizmet satırı (VitrA) */}
      <section aria-label="Hizmetlerimiz" className="border-t border-line bg-linen">
        <ul className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {usps.map((u) => (
            <li key={u.title} className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-amethyst-100 text-amethyst-700">
                <Icon name={u.icon} className="size-6" />
              </span>
              <div>
                <p className="font-medium">{u.title}</p>
                <p className="text-sm text-ink-soft">{u.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="bg-night text-paper/75">
        <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.3fr]">
          <div className="space-y-5">
            <Logo className="h-20 w-auto text-paper" />
            <p className="max-w-xs text-sm">{siteConfig.description}</p>
          </div>

          <FooterCol title="Karolar">
            {facets.looks.map((l) => (
              <FooterLink key={l.value} href={`/urunler/seramik?gorunum=${l.value}`}>
                {lookLabel[l.value]}
              </FooterLink>
            ))}
            {facets.usages.slice(0, 3).map((u) => (
              <FooterLink key={u.value} href={`/urunler/seramik?alan=${u.value}`}>
                {usageLabel[u.value]} karoları
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Banyo">
            {bath.map((c) => (
              <FooterLink key={c.slug} href={`/urunler/${c.slug}`}>
                {c.name}
              </FooterLink>
            ))}
            <FooterLink href="/urunler/yapi-kimyasallari">Yapı Kimyasalları</FooterLink>
          </FooterCol>

          <FooterCol title="Hizmetler">
            <FooterLink href="/showroom#randevu">Showroom randevusu</FooterLink>
            <FooterLink href="/showroom?tip=kesif#randevu">Keşif & metraj</FooterLink>
            <FooterLink href="/toptan">Toptan satış</FooterLink>
            <FooterLink href="/toptan#basvuru">Bayi / proje başvurusu</FooterLink>
            <FooterLink href="/teklif">Teklif iste</FooterLink>
            <FooterLink href="/hakkimizda">Hakkımızda</FooterLink>
          </FooterCol>

          <div className="space-y-4 text-sm">
            <p className="font-medium text-paper">İletişim</p>
            <a href={siteConfig.contact.phoneHref} className="block whitespace-nowrap font-display text-2xl text-paper hover:text-gold-soft">
              {siteConfig.contact.phone}
            </a>
            <address className="not-italic">{fullAddress()}</address>
            <ul className="space-y-1">
              {siteConfig.hours.map((h) => (
                <li key={h.label}>
                  {h.label}: {h.opens ? `${h.opens} – ${h.closes}` : "Kapalı"}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2 pt-2">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-outline-light min-h-10 px-5">
                WhatsApp
              </a>
              <a href={`mailto:${siteConfig.contact.email}`} className="btn-outline-light min-h-10 px-5">
                E-posta
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-paper/10">
          <div className="container-page flex flex-col gap-3 py-6 text-xs text-paper/50 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {siteConfig.legalName}. Tüm hakları saklıdır.
            </p>
            <ul className="flex gap-5">
              <li>
                <Link href="/kvkk" className="hover:text-paper">
                  KVKK Aydınlatma Metni
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="hover:text-paper">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-4 border-b border-paper/15 pb-3 text-sm font-medium text-paper">{title}</p>
      <ul className="space-y-2 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="hover:text-paper">
        {children}
      </Link>
    </li>
  );
}
