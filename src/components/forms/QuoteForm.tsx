"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useQuote } from "@/components/quote/QuoteProvider";
import { unitLabel } from "@/lib/pricing";
import { customerTypes, quoteSchema } from "@/lib/validation";
import { Consent, Field, FormStatus } from "./Field";
import { useLeadForm } from "./useLeadForm";

export function QuoteForm() {
  const { items, ready, setQty, remove, clear } = useQuote();
  const { state, onSubmit, pending } = useLeadForm("teklif", quoteSchema, "Teklif talebiniz hazır; en kısa sürede dönüş yapacağız.", (raw) => {
    let parsedItems: unknown = [];
    try {
      parsedItems = JSON.parse(String(raw.items ?? "[]"));
    } catch {}
    return { ...raw, items: parsedItems };
  });

  useEffect(() => {
    if (state?.ok) clear();
  }, [state, clear]);

  if (!ready) return <p className="text-ink-soft">Yükleniyor…</p>;

  if (state?.ok) {
    return (
      <div className="space-y-6">
        <FormStatus state={state} />
        <Link href="/urunler" className="btn-outline">
          Ürünlere dön
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
      <section aria-labelledby="liste">
        <h2 id="liste" className="mb-4 text-2xl">
          Teklif listesi
        </h2>
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line p-8 text-center text-ink-soft">
            Listeniz boş.{" "}
            <Link href="/urunler" className="text-amethyst-700 underline underline-offset-4">
              Ürünlere göz atın
            </Link>{" "}
            veya aşağıdaki not alanına ihtiyacınızı yazın.
          </div>
        ) : (
          <ul className="divide-y divide-line rounded-2xl border border-line bg-white">
            {items.map((item) => (
              <li key={item.slug} className="flex flex-wrap items-center gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <Link href={`/urun/${item.slug}`} className="font-medium hover:underline">
                    {item.name}
                  </Link>
                  <p className="text-xs text-ink-soft">{item.sku}</p>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <span className="sr-only">Miktar</span>
                  <input
                    type="number"
                    min={1}
                    value={item.qty}
                    onChange={(e) => setQty(item.slug, Number(e.target.value) || 1)}
                    className="field w-24 text-center"
                  />
                  {unitLabel[item.unit]}
                </label>
                <button
                  type="button"
                  onClick={() => remove(item.slug)}
                  className="text-sm text-ink-soft underline-offset-4 hover:text-red-700 hover:underline"
                >
                  Kaldır
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 text-sm text-ink-soft">
          Toptan alımlarda miktara göre kademeli fiyat uygulanır. Teklifiniz; stok, nakliye ve güncel fiyatlarla
          birlikte hazırlanır.
        </p>
      </section>

      <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-line bg-white p-6" noValidate>
        <h2 className="text-2xl">İletişim bilgileri</h2>
        <input type="hidden" name="items" value={JSON.stringify(items)} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="name" label="Ad soyad" state={state} required autoComplete="name" />
          <Field name="company" label="Firma (varsa)" state={state} autoComplete="organization" />
          <Field name="phone" label="Telefon" state={state} required type="tel" autoComplete="tel" />
          <Field name="email" label="E-posta" state={state} type="email" autoComplete="email" />
        </div>
        <Field name="customerType" label="Müşteri tipi" state={state} required>
          <select id="f-customerType" name="customerType" className="field" defaultValue="bireysel">
            {Object.entries(customerTypes).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="location" label="Proje / teslimat yeri" state={state} placeholder="ör. Yalıkavak, Bodrum" />
          <Field name="delivery" label="Teslimat" state={state} required>
            <select id="f-delivery" name="delivery" className="field" defaultValue="teslimat">
              <option value="teslimat">Adrese teslim</option>
              <option value="magazadan">Mağazadan teslim alacağım</option>
            </select>
          </Field>
        </div>
        <Field name="note" label="Not" state={state}>
          <textarea id="f-note" name="note" rows={4} className="field" placeholder="Metraj, renk tercihi, tarih…" />
        </Field>
        {state?.errors?.items && <p className="text-sm text-red-700">{state.errors.items[0]}</p>}
        <Consent state={state} />
        <FormStatus state={state} />
        <button type="submit" className="btn-primary w-full" disabled={pending}>
          {pending ? "Gönderiliyor…" : "Teklif iste"}
        </button>
      </form>
    </div>
  );
}
