import type { ProductIcon } from "@/lib/types";

/** Fotoğrafı olmayan banyo ürünleri için ince çizgi teknik çizimler (200×200) */
const drawings: Record<ProductIcon, React.ReactNode> = {
  klozet: (
    <>
      <rect x="62" y="30" width="76" height="30" rx="4" />
      <path d="M58 70h84c0 30-14 48-34 52v24H92v-24c-20-4-34-22-34-52Z" />
      <ellipse cx="100" cy="72" rx="36" ry="7" />
      <path d="M80 146h40" />
      <circle cx="100" cy="45" r="5" />
    </>
  ),
  lavabo: (
    <>
      <path d="M40 92h120" />
      <path d="M50 92c0 30 22 48 50 48s50-18 50-48" />
      <ellipse cx="100" cy="92" rx="50" ry="10" />
      <path d="M100 58V40h22v8" />
      <path d="M92 58h16" />
      <circle cx="100" cy="98" r="3" />
    </>
  ),
  batarya: (
    <>
      <path d="M86 150V88c0-22 12-34 34-34h14v14h-12c-10 0-16 6-16 16v66" />
      <path d="M78 150h44" />
      <path d="M96 70l-26-18" />
      <path d="M134 68v8" />
    </>
  ),
  dus: (
    <>
      <path d="M150 170V40c0-10-8-16-18-16H80" />
      <path d="M80 24v18" />
      <ellipse cx="80" cy="46" rx="30" ry="5" />
      <path d="M62 60v6M72 62v8M80 62v10M88 62v8M98 60v6" />
      <rect x="138" y="110" width="24" height="16" rx="3" />
      <circle cx="150" cy="118" r="3" />
    </>
  ),
  dolap: (
    <>
      <rect x="44" y="30" width="112" height="40" rx="4" />
      <path d="M40 80h120" />
      <rect x="44" y="84" width="112" height="62" rx="3" />
      <path d="M44 115h112M86 99h28M86 130h28" />
      <path d="M100 68V56h14" />
    </>
  ),
  aksesuar: (
    <>
      <path d="M36 60h60M40 60v-8M92 60v-8" />
      <path d="M44 60v48h44V60" opacity=".5" />
      <circle cx="136" cy="64" r="14" />
      <path d="M122 64h-8M150 64h8" />
      <path d="M130 120h12v40h-12z" />
      <path d="M126 120h20" />
      <path d="M60 140h28M74 132v16" />
    </>
  ),
  torba: (
    <>
      <path d="M58 40h84l8 16-4 94H54l-4-94 8-16Z" />
      <path d="M50 56h100" />
      <path d="M72 88h56M72 104h56M72 120h36" />
    </>
  ),
};

export function ProductIllustration({ icon, className = "" }: { icon: ProductIcon; className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {drawings[icon]}
    </svg>
  );
}
