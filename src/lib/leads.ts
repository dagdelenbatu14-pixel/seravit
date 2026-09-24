import { siteConfig, whatsappLink } from "@/config/site";
import { unitLabel } from "@/lib/pricing";
import type { QuoteItem } from "@/lib/types";
import { customerTypes, visitTypes } from "@/lib/validation";

export type LeadKind = "teklif" | "randevu" | "bayi" | "iletisim";

const kindTitle: Record<LeadKind, string> = {
  teklif: "Teklif talebi",
  randevu: "Randevu talebi",
  bayi: "Bayi / proje başvurusu",
  iletisim: "İletişim mesajı",
};

const fieldLabel: Record<string, string> = {
  name: "Ad soyad",
  company: "Firma",
  phone: "Telefon",
  email: "E-posta",
  customerType: "Müşteri tipi",
  location: "Yer",
  delivery: "Teslimat",
  visitType: "Randevu tipi",
  date: "Tarih",
  slot: "Saat",
  address: "Adres",
  interest: "İlgi",
  taxOffice: "Vergi dairesi",
  taxNumber: "Vergi no",
  city: "İl / ilçe",
  businessType: "Faaliyet",
  volume: "Hacim",
  subject: "Konu",
  message: "Mesaj",
  note: "Not",
};

const valueLabel: Record<string, string> = {
  ...customerTypes,
  ...visitTypes,
  teslimat: "Adrese teslim",
  magazadan: "Mağazadan teslim",
};

/** Talebi okunur bir WhatsApp mesajına çevirir */
export function formatLead(kind: LeadKind, data: Record<string, unknown>) {
  const lines = [`*${siteConfig.name} — ${kindTitle[kind]}*`, ""];
  for (const [key, value] of Object.entries(data)) {
    if (key === "consent" || key === "items" || value === "" || value == null) continue;
    lines.push(`${fieldLabel[key] ?? key}: ${valueLabel[String(value)] ?? value}`);
  }
  const items = data.items as QuoteItem[] | undefined;
  if (items?.length) {
    lines.push("", "*Ürünler*");
    for (const i of items) lines.push(`• ${i.name} (${i.sku}) — ${i.qty.toLocaleString("tr-TR")} ${unitLabel[i.unit]}`);
  }
  return lines.join("\n");
}

/**
 * Form talebini iletir. Site statik yayınlandığı için sunucu yoktur:
 * - NEXT_PUBLIC_LEAD_ENDPOINT tanımlıysa (Formspree, Make, n8n, Google Apps Script…) JSON POST edilir.
 * - Tanımlı değilse talep, doldurulmuş bir WhatsApp mesajı olarak açılır.
 */
export async function sendLead(kind: LeadKind, data: Record<string, unknown>): Promise<"endpoint" | "whatsapp"> {
  const endpoint = process.env.NEXT_PUBLIC_LEAD_ENDPOINT;
  if (endpoint) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ kind, createdAt: new Date().toISOString(), data }),
    });
    if (!res.ok) throw new Error(`Lead endpoint ${res.status}`);
    return "endpoint";
  }
  window.open(whatsappLink(formatLead(kind, data)), "_blank", "noopener,noreferrer");
  return "whatsapp";
}
