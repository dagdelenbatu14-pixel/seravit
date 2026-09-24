import { siteConfig } from "@/config/site";
import type { Product } from "@/lib/types";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function storeJsonLd() {
  const a = siteConfig.address;
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: siteConfig.legalName,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/brand/seravit-logo.png`,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: a.street || undefined,
      addressLocality: `${a.locality}, ${a.district}`,
      addressRegion: a.region,
      postalCode: a.postalCode || undefined,
      addressCountry: a.country,
    },
    ...(siteConfig.geo && {
      geo: { "@type": "GeoCoordinates", latitude: siteConfig.geo.lat, longitude: siteConfig.geo.lng },
    }),
    openingHoursSpecification: siteConfig.hours
      .filter((h) => h.opens)
      .map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: h.days, opens: h.opens, closes: h.closes })),
    areaServed: ["Bodrum", "Milas", "Muğla"],
  };
}

export function productJsonLd(p: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.sku,
    description: p.description,
    brand: { "@type": "Brand", name: p.brand },
    image: p.images.map((src) => (src.startsWith("http") ? src : `${siteConfig.url}${src}`)),
    ...(p.retailPrice && {
      offers: {
        "@type": "Offer",
        price: p.retailPrice,
        priceCurrency: siteConfig.currency,
        availability:
          p.stock === "tukendi" ? "https://schema.org/OutOfStock" : p.stock === "siparis" ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
        url: `${siteConfig.url}/urun/${p.slug}`,
      },
    }),
  };
}
