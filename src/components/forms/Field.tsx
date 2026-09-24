import type { FormState } from "@/lib/validation";
import Link from "next/link";

type FieldProps = {
  name: string;
  label: string;
  state: FormState;
  required?: boolean;
  className?: string;
  hint?: string;
  children?: React.ReactNode;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name">;

/** Etiket + input + hata mesajı. `children` verilirse input yerine o render edilir (select/textarea). */
export function Field({ name, label, state, required, className, hint, children, ...input }: FieldProps) {
  const error = state?.errors?.[name]?.[0];
  const id = `f-${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="label">
        {label}
        {required && <span className="text-amethyst-700"> *</span>}
      </label>
      {children ?? (
        <input
          id={id}
          name={name}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className="field"
          {...input}
        />
      )}
      {hint && !error && <p className="mt-1 text-xs text-ink-soft">{hint}</p>}
      {error && (
        <p id={`${id}-err`} className="mt-1 text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export function Consent({ state }: { state: FormState }) {
  const error = state?.errors?.consent?.[0];
  return (
    <div>
      <label className="flex items-start gap-3 text-sm text-ink-soft">
        <input type="checkbox" name="consent" required className="mt-1 size-4 accent-amethyst-700" />
        <span>
          Kişisel verilerimin talebimin yanıtlanması amacıyla işlenmesine ilişkin{" "}
          <Link href="/kvkk" className="underline underline-offset-4">
            KVKK aydınlatma metnini
          </Link>{" "}
          okudum.
        </span>
      </label>
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
    </div>
  );
}

export function FormStatus({ state }: { state: FormState }) {
  if (!state) return null;
  return (
    <p
      role={state.ok ? "status" : "alert"}
      className={`rounded-lg px-4 py-3 text-sm ${state.ok ? "bg-amethyst-100 text-amethyst-900" : "bg-red-50 text-red-800"}`}
    >
      {state.message}
    </p>
  );
}
