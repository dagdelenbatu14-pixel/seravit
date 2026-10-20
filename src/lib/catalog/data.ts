import type { Category, Collection, Product } from "@/lib/types";

/**
 * Kategoriler ve (varsa) Seravit'e özel ürünler.
 * Marka ürünleri data/imports/<marka>.json içinden gelir (lib/catalog/imports.ts).
 */

export const categories: Category[] = [
  { slug: "seramik", name: "Seramik & Porselen", world: "karo", description: "Yer ve duvar karoları, büyük ebat porselenler, dış mekân ve havuz serileri.", order: 1, texture: "calacatta-oro" },
  { slug: "porselen-karo", name: "Porselen Karo", world: "karo", description: "Yüksek dayanımlı, rektifiyeli yer ve duvar porselenleri.", parent: "seramik", order: 1, texture: "statuario-grey" },
  { slug: "duvar-karosu", name: "Duvar Karosu", world: "karo", description: "Banyo ve mutfak duvarları için sırlı karolar.", parent: "seramik", order: 2, texture: "zellige-blanc" },
  { slug: "dis-mekan-havuz", name: "Dış Mekân & Havuz", world: "karo", description: "Kaymaz, dona dayanıklı teras, bahçe ve havuz karoları.", parent: "seramik", order: 3, texture: "bodrum-stone" },

  { slug: "vitrifiye", name: "Vitrifiye", world: "banyo", description: "Klozet, lavabo, pisuvar ve rezervuarlar.", order: 2, icon: "klozet" },
  { slug: "klozet", name: "Klozet", world: "banyo", description: "Asma ve yere oturan klozetler.", parent: "vitrifiye", order: 1, icon: "klozet" },
  { slug: "lavabo", name: "Lavabo", world: "banyo", description: "Tezgâh üstü, etajerli ve asma lavabolar.", parent: "vitrifiye", order: 2, icon: "lavabo" },
  { slug: "rezervuar", name: "Rezervuar & Kumanda", world: "banyo", description: "Gömme rezervuarlar ve kumanda panelleri.", parent: "vitrifiye", order: 3, icon: "klozet" },
  { slug: "kuvet-dus-teknesi", name: "Küvet & Duş Teknesi", world: "banyo", description: "Küvetler, duş tekneleri ve duş kabinleri.", parent: "vitrifiye", order: 4, icon: "dus" },

  { slug: "banyo-mobilyasi", name: "Banyo Mobilyası", world: "banyo", description: "Lavabo dolapları, boy dolapları ve aynalar.", order: 3, icon: "dolap" },
  { slug: "armatur", name: "Armatür & Duş", world: "banyo", description: "Bataryalar, duş sistemleri ve ankastre çözümler.", order: 4, icon: "dus" },
  { slug: "aksesuar", name: "Banyo Aksesuarları", world: "banyo", description: "Havluluk, askı, kâğıtlık ve tamamlayıcı ürünler.", order: 5, icon: "aksesuar" },
  { slug: "yapi-kimyasallari", name: "Yapı Kimyasalları", world: "yapi", description: "Seramik yapıştırıcı, derz dolgu ve su yalıtımı.", order: 6, icon: "torba" },
];

/** Seravit'e özel koleksiyonlar (şimdilik yok — koleksiyonlar marka içe aktarımlarından türetilir) */
export const collections: Collection[] = [];

/** Seravit'e özel ürünler (marka dışı). Marka ürünleri: data/imports/ */
export const products: Product[] = [];
