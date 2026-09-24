"use client";

import { useState } from "react";
import { submitAppointment } from "@/app/actions";
import { Icon } from "@/components/ui/Icon";
import { siteConfig } from "@/config/site";
import { visitTypes } from "@/lib/validation";
import { Consent, Field, FormStatus } from "./Field";
import { useLeadForm } from "./useLeadForm";

type VisitType = keyof typeof visitTypes;

export function AppointmentForm({ defaultType = "showroom" }: { defaultType?: VisitType }) {
  const { state, onSubmit, pending } = useLeadForm(submitAppointment);
  const [type, setType] = useState<VisitType>(defaultType);
  const today = new Date().toISOString().slice(0, 10);

  if (state?.ok) return <FormStatus state={state} />;

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <fieldset>
        <legend className="label">Randevu tipi</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {(Object.keys(visitTypes) as VisitType[]).map((t) => (
            <label key={t} className="cursor-pointer">
              <input
                type="radio"
                name="visitType"
                value={t}
                checked={type === t}
                onChange={() => setType(t)}
                className="peer sr-only"
              />
              <span className="flex items-start gap-3 rounded-xl border border-line bg-white p-4 transition-colors peer-checked:border-amethyst-700 peer-checked:bg-mist peer-focus-visible:outline-2 peer-focus-visible:outline-amethyst-700">
                <Icon name={t === "kesif" ? "ruler" : "store"} className="mt-0.5 size-5 shrink-0 text-amethyst-700" />
                <span className="text-sm">
                  <strong className="block font-medium">{visitTypes[t]}</strong>
                  <span className="text-ink-soft">
                    {t === "kesif" ? "Uzmanımız mekânınızı ölçer, metraj çıkarır." : "Mumcular showroomunda danışmanla gezin."}
                  </span>
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="name" label="Ad soyad" state={state} required autoComplete="name" />
        <Field name="phone" label="Telefon" state={state} required type="tel" autoComplete="tel" />
        <Field name="date" label="Tarih" state={state} required type="date" min={today} />
        <Field name="slot" label="Saat aralığı" state={state} required>
          <select id="f-slot" name="slot" className="field" defaultValue="">
            <option value="" disabled>
              Seçin
            </option>
            {siteConfig.appointmentSlots.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
      </div>
      {type === "kesif" && (
        <Field name="address" label="Keşif adresi / bölge" state={state} required placeholder="ör. Yalıkavak, Gündoğan…" autoComplete="street-address" />
      )}
      <Field name="interest" label="İlgilendiğiniz ürünler" state={state} placeholder="ör. banyo yenileme, havuz karosu" />
      <Field name="note" label="Not" state={state}>
        <textarea id="f-note" name="note" rows={3} className="field" />
      </Field>
      <Consent state={state} />
      <FormStatus state={state} />
      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={pending}>
        {pending ? "Gönderiliyor…" : type === "kesif" ? "Keşif talep et" : "Randevu talep et"}
      </button>
    </form>
  );
}
