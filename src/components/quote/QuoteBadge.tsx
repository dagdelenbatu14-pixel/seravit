"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { useQuote } from "./QuoteProvider";

export function QuoteBadge() {
  const { count, ready } = useQuote();
  return (
    <Link
      href="/teklif"
      className="relative inline-flex h-11 items-center gap-2 rounded-full border border-ink/15 px-3 text-sm transition-colors hover:border-ink sm:px-4"
      aria-label={`Teklif listesi, ${count} ürün`}
    >
      <Icon name="file" className="size-5" />
      <span className="hidden sm:inline">Teklif listesi</span>
      {ready && count > 0 && (
        <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-amethyst-700 text-[11px] font-semibold text-white sm:static">
          {count}
        </span>
      )}
    </Link>
  );
}
