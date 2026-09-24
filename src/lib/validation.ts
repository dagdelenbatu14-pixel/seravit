import { z } from "zod";

const phone = z
  .string()
  .trim()
  .min(10, "Geçerli bir telefon numarası girin")
  .max(20, "Geçerli bir telefon numarası girin")
  .regex(/^[+\d\s()-]+$/, "Geçerli bir telefon numarası girin");

const optionalEmail = z
  .string()
  .trim()
  .email("Geçerli bir e-posta girin")
  .or(z.literal(""))
  .optional();

const name = z.string().trim().min(2, "Adınızı girin").max(80);
const note = z.string().trim().max(2000).optional();
const consent = z.literal("on", { message: "KVKK aydınlatma metnini onaylamanız gerekiyor" });

export const customerTypes = {
  bireysel: "Bireysel / Ev sahibi",
  proje: "Müteahhit / Proje / Mimar",
  bayi: "Bayi / Perakendeci",
  isletme: "Otel / Restoran / İşletme",
} as const;

export const quoteItemSchema = z.object({
  slug: z.string(),
  name: z.string(),
  sku: z.string(),
  unit: z.enum(["m2", "adet", "takim", "paket", "kg"]),
  qty: z.number().positive().max(1_000_000),
});

export const quoteSchema = z.object({
  name,
  company: z.string().trim().max(120).optional(),
  phone,
  email: optionalEmail,
  customerType: z.enum(["bireysel", "proje", "bayi", "isletme"]),
  location: z.string().trim().max(120).optional(),
  delivery: z.enum(["teslimat", "magazadan"]),
  note,
  items: z.array(quoteItemSchema).max(200),
  consent,
}).refine((d) => d.items.length > 0 || (d.note?.length ?? 0) >= 10, {
  message: "Listeye ürün ekleyin veya ihtiyacınızı not alanına yazın",
  path: ["items"],
});

export const visitTypes = {
  showroom: "Showroom ziyareti",
  kesif: "Yerinde keşif & metraj",
} as const;

export const appointmentSchema = z
  .object({
    visitType: z.enum(["showroom", "kesif"]),
    name,
    phone,
    email: optionalEmail,
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Tarih seçin")
      .refine((d) => new Date(d) >= new Date(new Date().toDateString()), "Geçmiş bir tarih seçilemez"),
    slot: z.string().min(1, "Saat aralığı seçin"),
    address: z.string().trim().max(200).optional(),
    interest: z.string().trim().max(200).optional(),
    note,
    consent,
  })
  .refine((d) => d.visitType !== "kesif" || (d.address?.length ?? 0) >= 5, {
    message: "Keşif için adres / bölge girin",
    path: ["address"],
  });

export const dealerSchema = z.object({
  company: z.string().trim().min(2, "Firma adını girin").max(120),
  taxOffice: z.string().trim().max(80).optional(),
  taxNumber: z.string().trim().max(20).optional(),
  name,
  phone,
  email: z.string().trim().email("Geçerli bir e-posta girin"),
  city: z.string().trim().min(2, "İl / ilçe girin").max(80),
  businessType: z.enum(["bayi", "proje", "isletme"]),
  volume: z.string().trim().max(120).optional(),
  note,
  consent,
});

export const contactSchema = z.object({
  name,
  phone,
  email: optionalEmail,
  subject: z.string().trim().max(120).optional(),
  message: z.string().trim().min(10, "Mesajınız en az 10 karakter olmalı").max(2000),
  consent,
});

export type FormState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
} | null;
