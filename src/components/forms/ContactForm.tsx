"use client";

import { submitContact } from "@/app/actions";
import { Consent, Field, FormStatus } from "./Field";
import { useLeadForm } from "./useLeadForm";

export function ContactForm() {
  const { state, onSubmit, pending } = useLeadForm(submitContact);

  if (state?.ok) return <FormStatus state={state} />;

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="name" label="Ad soyad" state={state} required autoComplete="name" />
        <Field name="phone" label="Telefon" state={state} required type="tel" autoComplete="tel" />
        <Field name="email" label="E-posta" state={state} type="email" autoComplete="email" />
        <Field name="subject" label="Konu" state={state} />
      </div>
      <Field name="message" label="Mesajınız" state={state} required>
        <textarea id="f-message" name="message" rows={5} className="field" />
      </Field>
      <Consent state={state} />
      <FormStatus state={state} />
      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={pending}>
        {pending ? "Gönderiliyor…" : "Gönder"}
      </button>
    </form>
  );
}
