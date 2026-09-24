"use server";

import { z } from "zod";
import { dispatchLead, type LeadKind } from "@/lib/leads";
import {
  appointmentSchema,
  contactSchema,
  dealerSchema,
  quoteSchema,
  type FormState,
} from "@/lib/validation";

async function handle<T extends z.ZodType>(
  kind: LeadKind,
  schema: T,
  raw: unknown,
  successMessage: string,
): Promise<FormState> {
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Lütfen işaretli alanları kontrol edin.",
      errors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]>,
    };
  }
  try {
    await dispatchLead(kind, parsed.data as Record<string, unknown>);
    return { ok: true, message: successMessage };
  } catch (err) {
    console.error(`[lead:${kind}] gönderilemedi`, err);
    return { ok: false, message: "Talebiniz şu an iletilemedi. Lütfen telefon veya WhatsApp ile ulaşın." };
  }
}

const fields = (fd: FormData) => Object.fromEntries(fd.entries());

export async function submitQuote(_: FormState, fd: FormData) {
  let items: unknown = [];
  try {
    items = JSON.parse(String(fd.get("items") ?? "[]"));
  } catch {}
  return handle(
    "teklif",
    quoteSchema,
    { ...fields(fd), items },
    "Teklif talebiniz alındı. En kısa sürede size dönüş yapacağız.",
  );
}

export async function submitAppointment(_: FormState, fd: FormData) {
  return handle("randevu", appointmentSchema, fields(fd), "Randevu talebiniz alındı. Onay için sizi arayacağız.");
}

export async function submitDealer(_: FormState, fd: FormData) {
  return handle("bayi", dealerSchema, fields(fd), "Başvurunuz alındı. Satış ekibimiz sizinle iletişime geçecek.");
}

export async function submitContact(_: FormState, fd: FormData) {
  return handle("iletisim", contactSchema, fields(fd), "Mesajınız iletildi. Teşekkür ederiz.");
}
