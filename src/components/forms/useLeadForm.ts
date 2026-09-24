"use client";

import { useState } from "react";
import { z } from "zod";
import { sendLead, type LeadKind } from "@/lib/leads";
import type { FormState } from "@/lib/validation";

/**
 * Tarayıcıda zod doğrulaması + talep gönderimi (statik site; sunucu yok).
 * Doğrulama hatasında alanlar korunur.
 */
export function useLeadForm(
  kind: LeadKind,
  schema: z.ZodType,
  success: string,
  prepare?: (raw: Record<string, unknown>) => Record<string, unknown>,
) {
  const [state, setState] = useState<FormState>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const raw = Object.fromEntries(new FormData(e.currentTarget).entries());
    const parsed = schema.safeParse(prepare ? prepare(raw) : raw);
    if (!parsed.success) {
      setState({
        ok: false,
        message: "Lütfen işaretli alanları kontrol edin.",
        errors: z.flattenError(parsed.error).fieldErrors as Record<string, string[]>,
      });
      return;
    }
    setPending(true);
    try {
      const via = await sendLead(kind, parsed.data as Record<string, unknown>);
      setState({
        ok: true,
        message: via === "whatsapp" ? `${success} Açılan WhatsApp penceresinden mesajı göndermeniz yeterli.` : success,
      });
    } catch {
      setState({ ok: false, message: "Talebiniz şu an iletilemedi. Lütfen telefon veya WhatsApp ile ulaşın." });
    } finally {
      setPending(false);
    }
  };

  return { state, onSubmit, pending };
}
