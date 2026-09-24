export type Unit = "m2" | "adet" | "takim" | "paket" | "kg";

export type StockStatus = "stokta" | "siparis" | "sinirli" | "tukendi";

/** Karo görünümü (Güral / Qua kategorilemesi) */
export type Look = "mermer" | "dogal-tas" | "beton" | "ahsap" | "duz" | "dekor" | "mozaik";

export type Surface = "parlak" | "mat" | "lappato" | "kaymaz" | "sirli";

export type Usage = "banyo" | "mutfak" | "ic-mekan" | "dis-mekan" | "havuz";

export type World = "karo" | "banyo" | "yapi";

export type Feature =
  | "rektifiye"
  | "porselen"
  | "yer"
  | "duvar"
  | "ic-mekan"
  | "dis-mekan"
  | "don"
  | "kaymaz"
  | "rimless"
  | "soft-close"
  | "termostatik"
  | "pvd";

/** Vitrifiye / armatür ürünleri için çizim ikonu */
export type ProductIcon = "klozet" | "lavabo" | "batarya" | "dus" | "dolap" | "aksesuar" | "torba";

/** Toptan kademe: minQty ve üzeri alımlarda uygulanacak indirim. */
export type WholesaleTier = {
  minQty: number;
  discountPct: number;
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  world: World;
  /** Üst kategori (alt kategori ise) */
  parent?: string;
  order: number;
  /** Kart görseli: /textures/<texture>.webp */
  texture?: string;
  icon?: ProductIcon;
};

export type Collection = {
  slug: string;
  name: string;
  look: Look;
  tagline: string;
  story: string;
  texture: string;
};

export type Product = {
  slug: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  /** Koleksiyon slug'ı — aynı koleksiyondaki ürünler ebat/renk varyantı olarak listelenir */
  collection?: string;
  summary: string;
  description: string;
  images: string[];
  /** Fotoğraf yoksa kullanılan prosedürel doku (public/textures) */
  texture?: string;
  icon?: ProductIcon;
  unit: Unit;
  /** KDV dahil perakende birim fiyatı (TRY). Yoksa "fiyat sorunuz". */
  retailPrice?: number;
  wholesaleTiers?: WholesaleTier[];
  /** Tek seferde minimum sipariş */
  minOrder?: number;

  /* Karo alanları */
  look?: Look;
  surface?: Surface;
  /** "60×120" biçiminde (cm) */
  size?: string;
  colorName?: string;
  colorHex?: string;
  /** 1 kutunun m² karşılığı */
  packSize?: number;
  packPieces?: number;
  palletM2?: number;
  thickness?: string;

  usage: Usage[];
  features: Feature[];
  stock: StockStatus;
  /** Showroom'da sergileniyor mu */
  inShowroom: boolean;
  featured?: boolean;
  specs: Record<string, string>;
  tags: string[];
};

export type ProductQuery = {
  category?: string;
  world?: World;
  q?: string;
  showroom?: boolean;
  looks?: Look[];
  surfaces?: Surface[];
  sizes?: string[];
  usages?: Usage[];
  collection?: string;
  sort?: "onerilen" | "fiyat-artan" | "fiyat-azalan" | "isim";
};

export type QuoteItem = {
  slug: string;
  name: string;
  sku: string;
  unit: Unit;
  qty: number;
};

export type CustomerType = "bireysel" | "proje" | "bayi" | "isletme";
