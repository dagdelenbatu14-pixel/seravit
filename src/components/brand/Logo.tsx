import { INK_RECT, LOGO_VIEWBOX, TAGLINE_PATHS, WORDMARK_PATHS } from "./logo-paths";

type LogoProps = {
  className?: string;
  /** "SERAMİK VİTRİFİYE" alt yazısı */
  tagline?: boolean;
  /** Mor mürekkep lekesi */
  ink?: boolean;
  title?: string;
};

/**
 * Orijinal logodan (seravit-logo.pdf) çıkarılmış vektör wordmark.
 * Yazı rengi `currentColor` — koyu zeminde `text-white` ile kullanılabilir.
 */
export function Logo({ className, tagline = true, ink = true, title = "Seravit Seramik Vitrifiye" }: LogoProps) {
  const viewBox = tagline ? LOGO_VIEWBOX : "130 310 815 430";
  return (
    <svg viewBox={viewBox} className={className} role="img" aria-label={title} fill="currentColor">
      {ink && (
        <image
          href="/brand/ink.webp"
          x={INK_RECT.x}
          y={INK_RECT.y}
          width={INK_RECT.width}
          height={INK_RECT.height}
          preserveAspectRatio="none"
        />
      )}
      {WORDMARK_PATHS.map((d, i) => (
        <path key={i} d={d} />
      ))}
      {tagline && TAGLINE_PATHS.map((d, i) => <path key={`t${i}`} d={d} />)}
    </svg>
  );
}
