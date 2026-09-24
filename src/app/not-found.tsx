import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[50vh] flex-col items-start justify-center gap-6 py-24">
      <p className="eyebrow">404</p>
      <h1 className="text-5xl">Sayfa bulunamadı</h1>
      <p className="text-ink-soft">Aradığınız sayfa taşınmış veya kaldırılmış olabilir.</p>
      <div className="flex gap-3">
        <Link href="/" className="btn-primary">
          Ana sayfa
        </Link>
        <Link href="/urunler" className="btn-outline">
          Ürünler
        </Link>
      </div>
    </div>
  );
}
