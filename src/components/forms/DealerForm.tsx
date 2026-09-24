"use client";

import { submitDealer } from "@/app/actions";
import { customerTypes } from "@/lib/validation";
import { Consent, Field, FormStatus } from "./Field";
import { useLeadForm } from "./useLeadForm";

const businessTypes = ["bayi", "proje", "isletme"] as const;

export function DealerForm() {
  const { state, onSubmit, pending } = useLeadForm(submitDealer);

  if (state?.ok) return <FormStatus state={state} />;

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="company" label="Firma ünvanı" state={state} required autoComplete="organization" className="sm:col-span-2" />
        <Field name="taxOffice" label="Vergi dairesi" state={state} />
        <Field name="taxNumber" label="Vergi no" state={state} inputMode="numeric" />
        <Field name="name" label="Yetkili ad soyad" state={state} required autoComplete="name" />
        <Field name="phone" label="Telefon" state={state} required type="tel" autoComplete="tel" />
        <Field name="email" label="E-posta" state={state} required type="email" autoComplete="email" />
        <Field name="city" label="İl / ilçe" state={state} required />
        <Field name="businessType" label="Faaliyet" state={state} required>
          <select id="f-businessType" name="businessType" className="field" defaultValue="proje">
            {businessTypes.map((v) => (
              <option key={v} value={v}>
                {customerTypes[v]}
              </option>
            ))}
          </select>
        </Field>
        <Field name="volume" label="Tahmini aylık / proje hacmi" state={state} placeholder="ör. 2.000 m², 40 banyo" />
      </div>
      <Field name="note" label="Not" state={state}>
        <textarea id="f-note" name="note" rows={3} className="field" />
      </Field>
      <Consent state={state} />
      <FormStatus state={state} />
      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={pending}>
        {pending ? "Gönderiliyor…" : "Başvuruyu gönder"}
      </button>
    </form>
  );
}
