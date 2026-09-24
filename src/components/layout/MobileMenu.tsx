"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { mainNav, siteConfig } from "@/config/site";
import Form from "next/form";

export type MobileSection = { label: string; links: { href: string; label: string }[] };

export function MobileMenu({ sections }: { sections: MobileSection[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Sayfa değişince kapat
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const plainLinks = mainNav.filter((n) => !("mega" in n));

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="grid size-11 place-items-center rounded-full hover:bg-linen lg:hidden"
        aria-label="Menüyü aç"
        aria-expanded={open}
      >
        <Icon name="menu" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menü">
          <div className="absolute inset-0 bg-night/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 right-0 flex w-[min(24rem,100%)] flex-col bg-paper animate-fade-up">
            <div className="flex h-16 items-center justify-between border-b border-line px-5">
              <span className="eyebrow">Menü</span>
              <button type="button" onClick={() => setOpen(false)} className="grid size-11 place-items-center" aria-label="Menüyü kapat">
                <Icon name="close" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <Form action="/urunler" role="search" className="relative mb-4">
                <input name="q" type="search" placeholder="Ürün ara…" className="field pl-10" aria-label="Ürün ara" />
                <Icon name="search" className="pointer-events-none absolute left-3 top-2.5 size-5 text-ink-soft" />
              </Form>
              {sections.map((s) => (
                <details key={s.label} className="group border-b border-line">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-display text-2xl [&::-webkit-details-marker]:hidden">
                    {s.label}
                    <Icon name="plus" className="size-5 group-open:hidden" />
                    <Icon name="minus" className="hidden size-5 group-open:block" />
                  </summary>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 pb-5 text-sm">
                    {s.links.map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} className="text-ink-soft hover:text-ink">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
              <ul>
                {[...plainLinks, { href: "/teklif", label: "Teklif listesi" }].map((l) => (
                  <li key={l.href} className="border-b border-line">
                    <Link href={l.href} className="block py-4 font-display text-2xl">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2 border-t border-line p-5 text-sm">
              <a href={siteConfig.contact.phoneHref} className="flex items-center gap-2">
                <Icon name="phone" className="size-4" /> {siteConfig.contact.phone}
              </a>
              <Link href="/showroom#randevu" className="btn-primary w-full">
                Showroom randevusu
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
