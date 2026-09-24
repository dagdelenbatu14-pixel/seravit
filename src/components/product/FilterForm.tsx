"use client";

import { useRef } from "react";
import Form from "next/form";

/** Filtre formu: seçim değişince otomatik gönderir (JS yoksa "Uygula" düğmesi çalışır). */
export function FilterForm({ action, children, className }: { action: string; children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLFormElement>(null);
  return (
    <Form
      ref={ref}
      action={action}
      className={className}
      onChange={(e) => {
        const t = e.target as unknown as HTMLInputElement;
        if (t.type === "checkbox" || t.tagName === "SELECT") ref.current?.requestSubmit();
      }}
    >
      {children}
    </Form>
  );
}
