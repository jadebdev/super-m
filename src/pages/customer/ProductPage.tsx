import { Icon } from "../../components/icons";
import { EmptyState, PageHeader, Price, ProductCard, ProductImage, QtyStepper, useToast } from "../../components/ui";
import { ars, discountPct, priceOf } from "../../lib/format";
import { Link, useRouter } from "../../lib/router";
import { tintOf, useStore } from "../../lib/store";

export function ProductPage({ id }: { id: string }) {
  const { products, categories, cart, addToCart, setQty, totals } = useStore();
  const { navigate } = useRouter();
  const toast = useToast();
  const product = products.find((p) => p.id === id);
  if (!product) {
    return (
      <>
        <PageHeader title="Producto" />
        <EmptyState emoji="📦" title="Este producto ya no está" text="Puede que lo hayamos sacado del catálogo." />
      </>
    );
  }
  const cat = categories.find((c) => c.id === product.categoryId);
  const qty = cart[product.id] ?? 0;
  const pct = discountPct(product);
  const related = products.filter((p) => p.categoryId === product.categoryId && p.id !== product.id && p.stock).slice(0, 8);

  return (
    <>
      <PageHeader
        title={product.name}
        subtitle={cat?.name}
        right={
          <Link to="/carrito" ariaLabel="Ir al carrito" className="relative grid h-10 w-10 place-items-center rounded-full active:bg-surface">
            <Icon name="cart" />
            {totals.count > 0 && (
              <span className="num absolute top-0.5 right-0 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-red px-1 text-[11px] font-bold text-on-red">
                {totals.count}
              </span>
            )}
          </Link>
        }
      />
      <div className="flex flex-col gap-5 pb-32">
        <div className="relative">
          <ProductImage emoji={product.emoji} image={product.image} tint={tintOf(product.categoryId)} size="lg" className="aspect-[4/3] w-full" />
          {pct > 0 && (
            <span className="num absolute top-4 left-4 rounded-lg bg-gold px-2.5 py-1 font-display text-lg font-extrabold text-[#3d2600]">-{pct}%</span>
          )}
        </div>

        <div className="gutter flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted">
            {cat && (
              <Link to={`/c/${cat.id}`} className="font-semibold text-red">
                {cat.name}
              </Link>
            )}
            <span aria-hidden="true">·</span>
            <span>{product.unit}</span>
          </div>
          <h1 className="font-display text-[28px] leading-[1.1] font-extrabold tracking-tight">{product.name}</h1>
          {product.nameZh && (
            <p lang="zh-CN" className="text-lg text-muted">
              {product.nameZh}
            </p>
          )}
          <Price product={product} big />
          {pct > 0 && <p className="num text-sm font-semibold text-green">Ahorrás {ars(product.price - priceOf(product))}</p>}
        </div>

        {product.description && (
          <p className="gutter max-w-[65ch] leading-relaxed">{product.description}</p>
        )}

        <div className="gutter grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 rounded-xl bg-surface p-3">
            <Icon name="truck" size={20} className="shrink-0 text-red" />
            Envío en el día en CABA
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-surface p-3">
            <Icon name="store" size={20} className="shrink-0 text-red" />
            Precio de súper chino
          </div>
        </div>

        {related.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="gutter font-display text-xl font-extrabold">Del mismo pasillo</h2>
            <div className="no-scrollbar gutter flex snap-x gap-3 overflow-x-auto scroll-px-4 pb-1">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} wide />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky buy bar */}
      <div className="pb-safe fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[480px] border-t border-line bg-bg">
        <div className="gutter flex items-center gap-3 py-3">
          {!product.stock ? (
            <div className="grid h-12 flex-1 place-items-center rounded-full bg-surface font-bold text-muted">Sin stock por ahora</div>
          ) : qty > 0 ? (
            <>
              <div className="w-[140px] shrink-0">
                <QtyStepper qty={qty} size="lg" label={product.name} onChange={(n) => setQty(product.id, n)} />
              </div>
              <button type="button" onClick={() => navigate("/carrito")} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-fg font-bold text-bg">
                Ver carrito · <span className="num">{ars(totals.total)}</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                addToCart(product.id);
                toast(`Agregaste ${product.name}`);
              }}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-red font-bold text-on-red active:bg-red-deep"
            >
              <Icon name="plus" size={20} strokeWidth={2.75} /> Agregar · <span className="num">{ars(priceOf(product))}</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
