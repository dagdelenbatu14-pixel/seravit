"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import type { QuoteItem } from "@/lib/types";

const STORAGE_KEY = "seravit:teklif";
const EMPTY: QuoteItem[] = [];

/* Teklif listesi deposu — localStorage'da saklanır, sekmeler arası senkron. */
const listeners = new Set<() => void>();
let cache: QuoteItem[] | null = null;

function read(): QuoteItem[] {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as QuoteItem[];
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function write(update: (prev: QuoteItem[]) => QuoteItem[]) {
  cache = update(read());
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    cache = null;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const noopSubscribe = () => () => {};

type QuoteContextValue = {
  items: QuoteItem[];
  count: number;
  /** İstemcide localStorage okundu mu (hydration sonrası true) */
  ready: boolean;
  add: (item: QuoteItem) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const QuoteContext = createContext<QuoteContextValue | null>(null);

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, read, () => EMPTY);
  const ready = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const add = useCallback((item: QuoteItem) => {
    write((prev) =>
      prev.some((i) => i.slug === item.slug)
        ? prev.map((i) => (i.slug === item.slug ? { ...i, qty: i.qty + item.qty } : i))
        : [...prev, item],
    );
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    write((prev) => prev.map((i) => (i.slug === slug ? { ...i, qty: Math.max(1, qty) } : i)));
  }, []);

  const remove = useCallback((slug: string) => write((prev) => prev.filter((i) => i.slug !== slug)), []);
  const clear = useCallback(() => write(() => EMPTY), []);

  const value = useMemo(
    () => ({ items, count: items.length, ready, add, setQty, remove, clear }),
    [items, ready, add, setQty, remove, clear],
  );

  return <QuoteContext value={value}>{children}</QuoteContext>;
}

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote, QuoteProvider içinde kullanılmalı");
  return ctx;
}
