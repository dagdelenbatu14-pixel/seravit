import "server-only";

export type LeadKind = "teklif" | "randevu" | "bayi" | "iletisim";

export type Lead = {
  kind: LeadKind;
  createdAt: string;
  data: Record<string, unknown>;
};

/**
 * Form talepleri (teklif, randevu, bayi başvurusu, iletişim) buradan dağıtılır.
 *
 * LEAD_WEBHOOK_URL tanımlıysa talep JSON olarak oraya POST edilir
 * (Make / Zapier / n8n → e-posta, WhatsApp, Google Sheets, CRM).
 * Tanımlı değilse sunucu loguna yazılır (geliştirme ortamı).
 */
export async function dispatchLead(kind: LeadKind, data: Record<string, unknown>) {
  const lead: Lead = { kind, createdAt: new Date().toISOString(), data };
  const webhook = process.env.LEAD_WEBHOOK_URL;

  if (!webhook) {
    console.info(`[lead:${kind}]`, JSON.stringify(lead, null, 2));
    return;
  }

  const res = await fetch(webhook, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(lead),
  });
  if (!res.ok) throw new Error(`Lead webhook ${res.status}`);
}
