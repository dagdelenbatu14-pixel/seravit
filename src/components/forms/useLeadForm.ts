"use client";

import { startTransition, useActionState } from "react";
import type { FormState } from "@/lib/validation";

type ServerAction = (prev: FormState, fd: FormData) => Promise<FormState>;

/**
 * useActionState + onSubmit sarmalayıcı.
 * `<form action>` React 19'da gönderim sonrası alanları sıfırlar; doğrulama hatasında
 * kullanıcının girdisi kaybolmasın diye gönderimi onSubmit üzerinden yapıyoruz.
 */
export function useLeadForm(serverAction: ServerAction) {
  const [state, dispatch, pending] = useActionState(serverAction, null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => dispatch(fd));
  };

  return { state, onSubmit, pending };
}
