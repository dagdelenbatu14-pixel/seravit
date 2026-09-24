"use client";

import { Suspense } from "react";
import Form from "next/form";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  computeFacets,
  filterProducts,
  many,
  parseCatalogParams,
  searchParamsToObject,
  sortOptions as sorts,
  sortProducts,
  type SearchParams,
} from "@/lib/catalog/query";
import { lookLabel, lookTexture, surfaceLabel, usageLabel } from "@/lib/labels";
import type { Category, Collection, Product, ProductQuery } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";
import { FilterForm } from "./FilterForm";
import { ProductGrid } from "./ProductCard";
import { Texture } from "./TileVisual";

export type CatalogData = { products: Product[]; categories: Category[]; collections: Collection[] };

/**
 * Ürün listesi + filtreler. Statik yayında filtreler URL parametrelerinden
 * tarayıcıda okunur (useSearchParams); ilk HTML filtresiz listeyle gelir.
 */
export function CatalogView({ data, category }: { data: CatalogData; category?: string }) {
  return (
    <Suspense fallback={<CatalogBody data={data} category={category} searchParams={{}} />}>
      <CatalogFromUrl data={data} category={category} />
    </Suspense>
  );
}

function CatalogFromUrl({ data, category }: { data: CatalogData; category?: string }) {
  const params = useSearchParams();
  return <CatalogBody data={data} category={category} searchParams={searchParamsToObject(params)} />;
}

function without(basePath: string, sp: SearchParams, key: string, value?: string) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    for (const val of many(v)) if (!(k === key && (value === undefined || val === value))) params.append(k, val);
  }
  const s = params.toString();
  return s ? `${basePath}?${s}` : basePath;
}

function CatalogBody({ data, category, searchParams }: { data: CatalogData; category?: string; searchParams: SearchParams }) {
  const query: ProductQuery = { ...parseCatalogParams(searchParams), category };
  const products = sortProducts(filterProducts(data.products, data.categories, query), query.sort);
  const facets = computeFacets(data.products, data.categories, query);
  const sortedCats = [...data.categories].sort((a, b) => a.order - b.order);
  const roots = sortedCats.filter((c) => !c.parent);
  const children = category ? sortedCats.filter((c) => c.parent === category) : [];
  const collection = query.collection ? data.collections.find((c) => c.slug === query.collection) : undefined;
  const basePath = category ? `/urunler/${category}` : "/urunler";
  // URL değişince kontrolsüz form alanlarını yeniden kur (filtre çipinden kaldırma vb.)
  const stateKey = JSON.stringify(searchParams);

  const active: { label: string; href: string }[] = [
    ...(query.q ? [{ label: `“${query.q}”`, href: without(basePath, searchParams, "q") }] : []),
    ...(collection ? [{ label: collection.name, href: without(basePath, searchParams, "koleksiyon") }] : []),
    ...(query.world ? [{ label: query.world === "banyo" ? "Banyo ürünleri" : query.world === "karo" ? "Karolar" : "Yapı", href: without(basePath, searchParams, "dunya") }] : []),
    ...(query.looks ?? []).map((v) => ({ label: lookLabel[v] ?? v, href: without(basePath, searchParams, "gorunum", v) })),
    ...(query.surfaces ?? []).map((v) => ({ label: surfaceLabel[v] ?? v, href: without(basePath, searchParams, "yuzey", v) })),
    ...(query.sizes ?? []).map((v) => ({ label: `${v} cm`, href: without(basePath, searchParams, "ebat", v) })),
    ...(query.usages ?? []).map((v) => ({ label: usageLabel[v] ?? v, href: without(basePath, searchParams, "alan", v) })),
    ...(query.showroom ? [{ label: "Showroom'da", href: without(basePath, searchParams, "showroom") }] : []),
  ];

  const hasTileFacets = facets.looks.length + facets.surfaces.length + facets.sizes.length > 0;

  const filters = (
    <>
      {/* korunan parametreler */}
      {query.q && <input type="hidden" name="q" value={query.q} />}
      {query.collection && <input type="hidden" name="koleksiyon" value={query.collection} />}
      {query.world && <input type="hidden" name="dunya" value={query.world} />}
      {query.sort !== "onerilen" && <input type="hidden" name="sirala" value={query.sort} />}

      <FilterGroup title="Kategori" open>
        <ul className="space-y-2 text-sm">
          <li>
            <Link href="/urunler" className={!category ? "font-medium text-amethyst-700" : "hover:text-amethyst-700"}>
              Tüm ürünler
            </Link>
          </li>
          {roots.map((c) => (
            <li key={c.slug}>
              <Link href={`/urunler/${c.slug}`} className={category === c.slug ? "font-medium text-amethyst-700" : "hover:text-amethyst-700"}>
                {c.name}
              </Link>
              {category === c.slug && children.length > 0 && (
                <ul className="mt-2 space-y-1.5 border-l border-line pl-3">
                  {children.map((ch) => (
                    <li key={ch.slug}>
                      <Link href={`/urunler/${ch.slug}`} className="text-ink-soft hover:text-amethyst-700">
                        {ch.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </FilterGroup>

      {facets.looks.length > 0 && (
        <FilterGroup title="Görünüm" open>
          <div className="grid grid-cols-2 gap-2">
            {facets.looks.map((f) => (
              <label key={f.value} className="group relative cursor-pointer">
                <input type="checkbox" name="gorunum" value={f.value} defaultChecked={query.looks?.includes(f.value)} className="peer sr-only" />
                <span className="flex items-center gap-2 rounded-lg border border-line bg-white p-1.5 pr-2 text-xs transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-amethyst-700">
                  <span className="relative size-7 shrink-0 overflow-hidden rounded-md">
                    <Texture name={lookTexture[f.value]} sizes="28px" className="scale-150" />
                  </span>
                  <span className="truncate">{lookLabel[f.value]}</span>
                  <span className="ml-auto opacity-50">{f.count}</span>
                </span>
              </label>
            ))}
          </div>
        </FilterGroup>
      )}

      {facets.sizes.length > 0 && (
        <FilterGroup title="Ebat (cm)" open>
          <ChipOptions name="ebat" options={facets.sizes.map((f) => ({ value: f.value, label: f.value, count: f.count }))} selected={query.sizes} />
        </FilterGroup>
      )}

      {facets.surfaces.length > 0 && (
        <FilterGroup title="Yüzey" open={!!query.surfaces?.length}>
          <ChipOptions name="yuzey" options={facets.surfaces.map((f) => ({ value: f.value, label: surfaceLabel[f.value], count: f.count }))} selected={query.surfaces} />
        </FilterGroup>
      )}

      {facets.usages.length > 0 && (
        <FilterGroup title="Kullanım alanı" open={!hasTileFacets || !!query.usages?.length}>
          <ChipOptions name="alan" options={facets.usages.map((f) => ({ value: f.value, label: usageLabel[f.value], count: f.count }))} selected={query.usages} />
        </FilterGroup>
      )}

      <div className="border-b border-line py-5">
        <label className="flex cursor-pointer items-center justify-between gap-3 text-sm">
          <span className="flex items-center gap-2">
            <Icon name="store" className="size-4" /> Yalnız showroom&apos;dakiler
          </span>
          <input type="checkbox" name="showroom" value="1" defaultChecked={query.showroom} className="peer sr-only" />
          <span aria-hidden className="relative h-6 w-11 rounded-full bg-line transition-colors after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-amethyst-700 peer-checked:after:translate-x-5" />
        </label>
      </div>

      <noscript>
        <button type="submit" className="btn-primary mt-5 w-full">
          Uygula
        </button>
      </noscript>
    </>
  );

  return (
    <div className="container-page grid gap-10 py-10 lg:grid-cols-[280px_1fr] lg:py-14">
      {/* Masaüstü filtre */}
      <aside className="hidden lg:block" aria-label="Filtreler">
        <FilterForm key={stateKey} action={basePath} className="sticky top-32">
          {filters}
        </FilterForm>
      </aside>

      <div>
        {/* Üst çubuk */}
        <div className="mb-6 flex flex-wrap items-center gap-3 border-b border-line pb-5">
          <details className="group relative lg:hidden">
            <summary className="chip cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <Icon name="layers" className="size-4" /> Filtreler {active.length > 0 && <span className="text-amethyst-700">({active.length})</span>}
            </summary>
            <div className="absolute left-0 top-12 z-30 max-h-[75vh] w-[min(92vw,420px)] overflow-y-auto rounded-2xl border border-line bg-paper p-5 shadow-2xl">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-display text-2xl">Filtreler</p>
                <Link href={basePath} className="text-sm text-ink-soft underline">
                  Temizle
                </Link>
              </div>
              <FilterForm key={stateKey} action={basePath}>
                {filters}
                <button type="submit" className="btn-primary sticky bottom-0 mt-6 w-full">
                  {products.length} ürünü göster
                </button>
              </FilterForm>
            </div>
          </details>

          <p className="text-sm text-ink-soft">
            <strong className="font-medium text-ink">{products.length}</strong> ürün
          </p>

          <Form action={basePath} role="search" className="relative ml-auto min-w-0 flex-1 sm:max-w-xs">
            {Object.entries(searchParams).flatMap(([k, v]) =>
              k === "q" ? [] : many(v).map((val) => <input key={`${k}-${val}`} type="hidden" name={k} value={val} />),
            )}
            <label htmlFor="catalog-q" className="sr-only">
              Katalogda ara
            </label>
            <input key={query.q} id="catalog-q" name="q" type="search" defaultValue={query.q} placeholder="Ara…" className="field rounded-full pl-10" />
            <Icon name="search" className="pointer-events-none absolute left-3.5 top-2.5 size-5 text-ink-soft" />
          </Form>

          <FilterForm key={stateKey} action={basePath} className="flex items-center gap-2">
            {Object.entries(searchParams).flatMap(([k, v]) =>
              k === "sirala" ? [] : many(v).map((val) => <input key={`${k}-${val}`} type="hidden" name={k} value={val} />),
            )}
            <label htmlFor="sirala" className="sr-only">
              Sırala
            </label>
            <select id="sirala" name="sirala" defaultValue={query.sort} className="field w-auto rounded-full">
              {sorts.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <noscript>
              <button className="chip">Sırala</button>
            </noscript>
          </FilterForm>
        </div>

        {active.length > 0 && (
          <ul className="mb-8 flex flex-wrap items-center gap-2" aria-label="Aktif filtreler">
            {active.map((a) => (
              <li key={a.href + a.label}>
                <Link href={a.href} className="chip bg-mist" aria-label={`${a.label} filtresini kaldır`}>
                  {a.label}
                  <Icon name="close" className="size-3.5" />
                </Link>
              </li>
            ))}
            <li>
              <Link href={basePath} className="ml-2 text-sm text-ink-soft underline underline-offset-4 hover:text-ink">
                Tümünü temizle
              </Link>
            </li>
          </ul>
        )}

        {collection && (
          <div className="relative mb-10 overflow-hidden rounded-2xl bg-night p-8 text-paper">
            <Texture name={collection.texture} sizes="60vw" className="opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-r from-night via-night/70 to-transparent" />
            <div className="relative max-w-lg">
              <p className="text-[11px] uppercase tracking-(--tracking-brand) text-gold-soft">{lookLabel[collection.look]} koleksiyonu</p>
              <h2 className="mt-2 text-4xl">{collection.name}</h2>
              <p className="mt-3 text-paper/75">{collection.story}</p>
            </div>
          </div>
        )}

        <ProductGrid products={products} cols={3} />
      </div>
    </div>
  );
}

function FilterGroup({ title, children, open }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details open={open} className="group border-b border-line py-5 first:pt-0">
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium [&::-webkit-details-marker]:hidden">
        {title}
        <Icon name="chevron-down" className="size-4 transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

function ChipOptions({
  name,
  options,
  selected = [],
}: {
  name: string;
  options: { value: string; label: string; count: number }[];
  selected?: string[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <label key={o.value} className="cursor-pointer">
          <input type="checkbox" name={name} value={o.value} defaultChecked={selected.includes(o.value)} className="peer sr-only" />
          <span className="chip peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-amethyst-700">
            {o.label} <span className="text-xs opacity-50">{o.count}</span>
          </span>
        </label>
      ))}
    </div>
  );
}
