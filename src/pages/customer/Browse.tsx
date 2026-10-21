import { useMemo, useState } from "react";
import { Icon } from "../../components/icons";
import { EmptyState, PageHeader, ProductCard, inputClass } from "../../components/ui";
import { discountPct, normalize, priceOf } from "../../lib/format";
import { Link, useRouter } from "../../lib/router";
import { useStore } from "../../lib/store";
import type { Product } from "../../types";

export function Categories() {
  const { categories, products } = useStore();
  return (
    <>
      <PageHeader title="Categorías" subtitle="Todo el súper, pasillo por pasillo" />
      <div className="gutter flex flex-col gap-2.5 py-4">
        <Link to="/c/ofertas" className="flex items-center gap-4 rounded-2xl bg-gold-soft p-3">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-gold text-3xl" aria-hidden="true">🏷️</span>
          <div className="min-w-0 flex-1">
            <div className="font-display text-lg font-extrabold">Ofertas</div>
            <div className="text-sm text-muted">{products.filter((p) => discountPct(p) > 0).length} productos con descuento</div>
          </div>
          <Icon name="chevron" className="text-muted" />
        </Link>
        {categories.map((c) => {
          const n = products.filter((p) => p.categoryId === c.id).length;
          return (
            <Link key={c.id} to={`/c/${c.id}`} className="flex items-center gap-4 rounded-2xl border border-line bg-card p-3">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-xl text-3xl" style={{ background: `var(--t-${c.tint})` }} aria-hidden="true">
                {c.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-lg font-extrabold">{c.name}</span>
                  <span lang="zh-CN" className="text-sm text-muted">{c.nameZh}</span>
                </div>
                <div className="text-sm text-muted">{n} productos</div>
              </div>
              <Icon name="chevron" className="text-muted" />
            </Link>
          );
        })}
      </div>
    </>
  );
}

type Sort = "relevance" | "low" | "high";

function sortProducts(list: Product[], sort: Sort) {
  const inStockFirst = (a: Product, b: Product) => Number(b.stock) - Number(a.stock);
  const copy = [...list];
  if (sort === "low") return copy.sort((a, b) => inStockFirst(a, b) || priceOf(a) - priceOf(b));
  if (sort === "high") return copy.sort((a, b) => inStockFirst(a, b) || priceOf(b) - priceOf(a));
  return copy.sort((a, b) => inStockFirst(a, b) || Number(!!b.featured) - Number(!!a.featured));
}

export function CategoryPage({ id }: { id: string }) {
  const { categories, products } = useStore();
  const [sort, setSort] = useState<Sort>("relevance");
  const cat = categories.find((c) => c.id === id);
  const list = id === "ofertas" ? products.filter((p) => discountPct(p) > 0) : products.filter((p) => p.categoryId === id);
  const sorted = sortProducts(list, sort);
  const title = id === "ofertas" ? "Ofertas" : (cat?.name ?? "Categoría");

  return (
    <>
      <PageHeader title={title} subtitle={`${list.length} productos${cat ? ` · ${cat.nameZh}` : ""}`} />
      <div className="no-scrollbar gutter flex gap-2 overflow-x-auto py-3">
        {(
          [
            ["relevance", "Destacados"],
            ["low", "Menor precio"],
            ["high", "Mayor precio"],
          ] as [Sort, string][]
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setSort(k)}
            aria-pressed={sort === k}
            className={`h-9 shrink-0 rounded-full border px-4 text-sm font-semibold ${sort === k ? "border-fg bg-fg text-bg" : "border-line bg-card"}`}
          >
            {label}
          </button>
        ))}
      </div>
      {sorted.length === 0 ? (
        <EmptyState emoji="🧺" title="Nada por acá todavía" text="Estamos reponiendo este pasillo. Volvé en unos días." />
      ) : (
        <div className="gutter grid grid-cols-2 gap-x-3 gap-y-6 pt-1 pb-6">
          {sorted.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  );
}

const popular = ["soja", "dumplings", "arroz", "tofu", "ramen", "wok", "té", "mochi"];

export function SearchPage() {
  const { products, categories } = useStore();
  const { back } = useRouter();
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const n = normalize(q.trim());
    if (!n) return [];
    const words = n.split(/\s+/);
    return sortProducts(
      products.filter((p) => {
        const cat = categories.find((c) => c.id === p.categoryId);
        const hay = normalize(`${p.name} ${p.nameZh ?? ""} ${p.unit} ${cat?.name ?? ""} ${cat?.nameZh ?? ""}`);
        return words.every((w) => hay.includes(w));
      }),
      "relevance",
    );
  }, [q, products, categories]);

  return (
    <>
      <header className="sticky z-20 border-b border-line bg-bg" style={{ top: "env(safe-area-inset-top, 0px)" }}>
        <div className="gutter flex h-16 items-center gap-2">
          <button type="button" onClick={back} aria-label="Volver" className="-ml-2 grid h-10 w-10 shrink-0 place-items-center rounded-full active:bg-surface">
            <Icon name="back" />
          </button>
          <div className="relative flex-1">
            <Icon name="search" size={20} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
            <input
              id="search"
              autoFocus
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Producto, marca o 中文"
              aria-label="Buscar productos"
              className={`${inputClass} rounded-full pl-11`}
            />
          </div>
        </div>
      </header>

      {!q.trim() ? (
        <div className="gutter flex flex-col gap-3 py-5">
          <h2 className="text-sm font-bold tracking-wider text-muted uppercase">Lo más buscado</h2>
          <div className="flex flex-wrap gap-2">
            {popular.map((w) => (
              <button key={w} type="button" onClick={() => setQ(w)} className="h-10 rounded-full border border-line bg-card px-4 font-semibold">
                {w}
              </button>
            ))}
          </div>
        </div>
      ) : results.length === 0 ? (
        <EmptyState emoji="🔍" title={`No encontramos “${q}”`} text="Probá con otra palabra o escribilo en chino. También podés pedirlo por WhatsApp." />
      ) : (
        <div className="gutter flex flex-col gap-4 py-4">
          <p className="text-sm text-muted">
            {results.length} resultado{results.length === 1 ? "" : "s"}
          </p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-6 pb-4">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
