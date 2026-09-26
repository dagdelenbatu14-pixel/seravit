/**
 * Seravit — merkezi site ayarları.
 * "TODO" işaretli alanlar gerçek bilgilerle güncellenmeli.
 */
export const siteConfig = {
  name: "Seravit",
  legalName: "Seravit Seramik Vitrifiye",
  tagline: "Seramik · Vitrifiye · Banyo",
  description:
    "Bodrum Mumcular'da seramik, vitrifiye ve banyo ürünleri showroomu. Perakende satış, proje tedariği ve toptan satış.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://seravit.com.tr", // TODO: gerçek domain
  locale: "tr_TR",
  currency: "TRY",

  contact: {
    phone: "+90 533 674 45 48",
    phoneHref: "tel:+905336744548",
    whatsapp: "905336744548",
    email: "info@seravit.com.tr", // TODO
  },

  address: {
    street: "", // TODO: açık adres
    locality: "Mumcular",
    district: "Bodrum",
    region: "Muğla",
    postalCode: "", // TODO
    country: "TR",
    mapsUrl: "", // TODO: Google Maps paylaşım linki
  },

  /** TODO: gerçek koordinatlar (Google Maps'ten). Harita/JSON-LD için. */
  geo: null as { lat: number; lng: number } | null,

  hours: [
    { label: "Pazartesi – Cumartesi", days: ["Mo", "Tu", "We", "Th", "Fr", "Sa"], opens: "08:30", closes: "18:30" },
    { label: "Pazar", days: ["Su"], opens: null, closes: null },
  ],

  social: {
    instagram: "", // TODO
    facebook: "",
  },

  /** Randevu formunda seçilebilen saat aralıkları */
  appointmentSlots: ["09:00 – 11:00", "11:00 – 13:00", "13:00 – 15:00", "15:00 – 17:00", "17:00 – 18:30"],

  /** Duyuru çubuğu (VitrA tarzı) */
  announcements: [
    "Bodrum geneline şantiye ve adrese teslimat",
    "Ücretsiz keşif & metraj hizmeti",
    "Proje ve bayilere kademeli toptan fiyat",
  ],

  /** Metraj hesabında önerilen fire payı */
  wastePct: 10,
} as const;

export const mainNav = [
  { href: "/urunler/seramik", label: "Karolar", mega: "karo" },
  { href: "/urunler?dunya=banyo", label: "Banyo", mega: "banyo" },
  { href: "/showroom", label: "Showroom" },
  { href: "/toptan", label: "Toptan & Proje" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
] as const;

export function fullAddress() {
  const a = siteConfig.address;
  return [a.street, a.locality, `${a.district} / ${a.region}`].filter(Boolean).join(", ");
}

export function whatsappLink(text?: string) {
  const base = `https://wa.me/${siteConfig.contact.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function hoursSummary() {
  const open = siteConfig.hours.find((h) => h.opens);
  return open ? `Pzt–Cmt ${open.opens}–${open.closes}` : "";
}
