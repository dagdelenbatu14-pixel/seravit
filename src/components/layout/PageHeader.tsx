import Link from "next/link";
import { GroutGrid, Texture } from "@/components/product/TileVisual";

type Crumb = { href?: string; label: string };

export function Breadcrumbs({ crumbs, dark }: { crumbs: Crumb[]; dark?: boolean }) {
  return (
    <nav aria-label="Konum" className={`text-xs ${dark ? "text-paper/70" : "text-ink-soft"}`}>
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className={dark ? "hover:text-paper" : "hover:text-ink"}>
            Ana sayfa
          </Link>
        </li>
        {crumbs.map((c) => (
          <li key={c.label} className="flex items-center gap-2">
            <span aria-hidden>/</span>
            {c.href ? (
              <Link href={c.href} className={dark ? "hover:text-paper" : "hover:text-ink"}>
                {c.label}
              </Link>
            ) : (
              <span aria-current="page">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Sayfa başlığı. `texture` verilirse koyu, görselli bant (Güral kategori başlıkları);
 * yoksa açık zeminli sade başlık.
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
  crumbs,
  texture,
  grid,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  crumbs?: Crumb[];
  texture?: string;
  grid?: string;
  children?: React.ReactNode;
}) {
  const dark = !!texture;
  return (
    <div className={`relative isolate overflow-hidden ${dark ? "bg-night text-paper" : "border-b border-line bg-linen"}`}>
      {texture && (
        <>
          <Texture name={texture} priority sizes="100vw" className="-z-10" />
          {grid && (
            <div className="absolute inset-0 -z-10">
              <GroutGrid size={grid} />
            </div>
          )}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-night/85 via-night/55 to-night/20" />
        </>
      )}
      <div className={`container-page ${dark ? "py-16 md:py-24" : "py-12 md:py-16"}`}>
        {crumbs && (
          <div className="mb-8">
            <Breadcrumbs crumbs={crumbs} dark={dark} />
          </div>
        )}
        {eyebrow && (
          <p className={`mb-4 text-[11px] font-medium uppercase tracking-(--tracking-brand) ${dark ? "text-gold-soft" : "text-amethyst-700"}`}>{eyebrow}</p>
        )}
        <h1 className="text-4xl md:text-6xl">{title}</h1>
        {lead && <p className={`mt-5 max-w-2xl text-lg ${dark ? "text-paper/75" : "text-ink-soft"}`}>{lead}</p>}
        {children}
      </div>
    </div>
  );
}
