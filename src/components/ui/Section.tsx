import Link from "next/link";
import { Icon } from "./Icon";

/** Güral tarzı: geniş harf aralıklı serif başlık + ince çizgi */
export function SectionTitle({
  eyebrow,
  title,
  lead,
  align = "center",
  tone = "light",
  id,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "center" | "left";
  tone?: "light" | "dark";
  id?: string;
}) {
  const center = align === "center";
  return (
    <div className={`mb-12 ${center ? "mx-auto max-w-2xl text-center" : ""}`}>
      {eyebrow && <p className={`eyebrow mb-4 ${tone === "dark" ? "text-amethyst-300" : ""}`}>{eyebrow}</p>}
      <h2 id={id} className="title-tracked text-3xl md:text-[2.6rem]">
        {title}
      </h2>
      <span aria-hidden className={`mt-5 block h-px w-16 ${center ? "mx-auto" : ""} ${tone === "dark" ? "bg-gold" : "bg-amethyst-500"}`} />
      {lead && <p className={`mt-6 text-lg ${tone === "dark" ? "text-paper/70" : "text-ink-soft"}`}>{lead}</p>}
    </div>
  );
}

/** Daire içinde ok (Güral/Bien) */
export function ArrowCircle({ dark, className = "", direction = "right" }: { dark?: boolean; className?: string; direction?: "right" | "up-right" }) {
  return (
    <span
      aria-hidden
      className={`grid size-12 shrink-0 place-items-center rounded-full border transition-colors ${
        dark
          ? "border-paper/40 text-paper group-hover:border-paper group-hover:bg-paper group-hover:text-ink"
          : "border-ink/30 text-ink group-hover:border-ink group-hover:bg-ink group-hover:text-paper"
      } ${className}`}
    >
      <Icon name={direction === "right" ? "arrow-right" : "arrow-up-right"} className="size-5" />
    </span>
  );
}

export function TextLink({ href, children, dark }: { href: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <Link href={href} className={`group inline-flex items-center gap-3 text-sm font-medium ${dark ? "text-paper" : "text-ink"}`}>
      {children}
      <ArrowCircle dark={dark} className="size-10" />
    </Link>
  );
}
