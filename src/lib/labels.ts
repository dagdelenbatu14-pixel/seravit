import type { Feature, Look, Surface, Usage } from "@/lib/types";

export const lookLabel: Record<Look, string> = {
  mermer: "Mermer",
  "dogal-tas": "Doğal Taş",
  beton: "Beton",
  ahsap: "Ahşap",
  duz: "Düz Renk",
  dekor: "Dekor",
  mozaik: "Mozaik",
};

export const surfaceLabel: Record<Surface, string> = {
  parlak: "Parlak",
  mat: "Mat",
  lappato: "Lappato",
  kaymaz: "Kaymaz",
  sirli: "Sırlı",
};

export const usageLabel: Record<Usage, string> = {
  banyo: "Banyo",
  mutfak: "Mutfak",
  "ic-mekan": "İç Mekân",
  "dis-mekan": "Teras & Bahçe",
  havuz: "Havuz",
};

export const featureLabel: Record<Feature, string> = {
  rektifiye: "Rektifiyeli",
  porselen: "Porselen",
  yer: "Yer",
  duvar: "Duvar",
  "ic-mekan": "İç Mekân",
  "dis-mekan": "Dış Mekân",
  don: "Dona Dayanıklı",
  kaymaz: "Kaymaz",
  rimless: "Rimless",
  "soft-close": "Yavaş Kapanır",
  termostatik: "Termostatik",
  pvd: "PVD Kaplama",
};

/** Görünüm başına katalog / vitrin dokusu */
export const lookTexture: Record<Look, string> = {
  mermer: "calacatta-oro",
  "dogal-tas": "travertino-beige",
  beton: "beton-grey",
  ahsap: "mese-dogal",
  duz: "mat-beyaz",
  dekor: "terrazzo-krem",
  mozaik: "aegean-mozaik",
};

export const usageTexture: Record<Usage, string> = {
  banyo: "calacatta-viola",
  mutfak: "zellige-blanc",
  "ic-mekan": "statuario-grey",
  "dis-mekan": "bodrum-stone",
  havuz: "aegean-mozaik",
};
