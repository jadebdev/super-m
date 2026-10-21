import { useState } from "react";
import { Icon } from "../../components/icons";
import { Button, EmptyState, FreeDeliveryBar, PageHeader, ProductImage, QtyStepper, inputClass } from "../../components/ui";
import { ZonePicker } from "../../components/ZonePicker";
import { ars } from "../../lib/format";
import { Link, useRouter } from "../../lib/router";
import { tintOf, useStore } from "../../lib/store";

export function Summary({ showZoneHint = true }: { showZoneHint?: boolean }) {
  const { totals, settings } = useStore();
  const free = totals.subtotal >= settings.freeDeliveryThreshold;
  return (
    <dl className="num flex flex-col gap-2 text-[15px]">
      <div className="flex justify-between">
        <dt className="text-muted">Productos ({totals.count})</dt>
        <dd>{ars(totals.subtotal)}</dd>
      </div>
      {totals.discount > 0 && (
        <div className="flex justify-between text-green">
          <dt>Cupón {settings.couponCode}</dt>
          <dd>-{ars(totals.discount)}</dd>
        </div>
      )}
      <div className="flex justify-between">
        <dt className="text-muted">Envío</dt>
        <dd>
          {free ? (
            <span className="font-semibold text-green">Gratis</span>
          ) : totals.zone ? (
            ars(totals.deliveryFee)
          ) : showZoneHint ? (
            <span className="text-muted">Elegí tu barrio</span>
          ) : (
            "—"
          )}
        </dd>
      </div>
      <div className="mt-1 flex items-baseline justify-between border-t border-line pt-3">
        <dt className="font-bold">Total</dt>
        <dd className="font-display text-2xl font-extrabold">{ars(totals.total)}</dd>
      </div>
    </dl>
  );
}

export function Cart() {
  const { totals, setQty, settings, couponApplied, setCoupon, clearCart } = useStore();
  const { navigate } = useRouter();
  const [code, setCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [zoneOpen, setZoneOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  if (totals.count === 0) {
    return (
      <>
        <PageHeader title="Carrito" />
        <EmptyState
          emoji="🛒"
          title="Tu carrito está vacío"
          text="Sumá productos y te los llevamos a tu casa el mismo día."
          action={
            <Button onClick={() => navigate("/")} className="mt-2">
              Empezar a comprar
            </Button>
          }
        />
      </>
    );
  }

  const belowMin = totals.zone && totals.subtotal < totals.zone.minOrder;

  return (
    <>
      <PageHeader
        title="Carrito"
        subtitle={`${totals.count} producto${totals.count === 1 ? "" : "s"}`}
        right={
          confirmClear ? (
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setConfirmClear(false)} className="h-9 rounded-full px-3 text-sm font-semibold">
                No
              </button>
              <button
                type="button"
                onClick={() => {
                  clearCart();
                  setConfirmClear(false);
                }}
                className="h-9 rounded-full bg-red px-3 text-sm font-bold text-on-red"
              >
                Vaciar
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirmClear(true)} className="h-9 rounded-full px-3 text-sm font-semibold text-muted">
              Vaciar
            </button>
          )
        }
      />
      <div className="gutter flex flex-col gap-5 py-4 pb-36">
        <FreeDeliveryBar />

        <ul className="flex flex-col divide-y divide-line">
          {totals.lines.map(({ product, qty, unit, total }) => (
            <li key={product.id} className="flex gap-3 py-3.5">
              <Link to={`/p/${product.id}`} className="shrink-0">
                <ProductImage emoji={product.emoji} image={product.image} tint={tintOf(product.categoryId)} size="sm" className="h-[72px] w-[72px] rounded-xl" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex justify-between gap-2">
                  <div className="min-w-0">
                    <div className="line-clamp-2 leading-tight font-semibold">{product.name}</div>
                    <div className="num text-sm text-muted">
                      {product.unit} · {ars(unit)} c/u
                    </div>
                  </div>
                  <div className="num shrink-0 font-bold">{ars(total)}</div>
                </div>
                <div className="w-[120px]">
                  <QtyStepper qty={qty} label={product.name} onChange={(n) => setQty(product.id, n)} />
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Coupon */}
        <div className="rounded-2xl border border-line p-4">
          {couponApplied ? (
            <div className="flex items-center gap-3">
              <Icon name="tag" className="text-green" />
              <div className="flex-1">
                <div className="font-bold">{settings.couponCode}</div>
                <div className="text-sm text-muted">{settings.couponPercent}% de descuento aplicado</div>
              </div>
              <button type="button" onClick={() => setCoupon(false)} className="text-sm font-semibold text-red">
                Quitar
              </button>
            </div>
          ) : (
            <form
              className="flex flex-col gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (code.trim().toUpperCase() === settings.couponCode.toUpperCase()) {
                  setCoupon(true);
                  setCouponError("");
                } else {
                  setCouponError("Ese cupón no existe o ya venció. Revisá cómo lo escribiste.");
                }
              }}
            >
              <label htmlFor="coupon" className="text-sm font-semibold">
                ¿Tenés un cupón?
              </label>
              <div className="flex gap-2">
                <input id="coupon" value={code} onChange={(e) => setCode(e.target.value)} placeholder={settings.couponCode} className={`${inputClass} uppercase`} />
                <button type="submit" className="h-12 shrink-0 rounded-xl bg-fg px-4 font-bold text-bg">
                  Aplicar
                </button>
              </div>
              {couponError && <p className="text-sm text-red">{couponError}</p>}
            </form>
          )}
        </div>

        <button type="button" onClick={() => setZoneOpen(true)} className="flex items-center gap-3 rounded-2xl bg-surface p-4 text-left">
          <Icon name="pin" className="text-red" />
          <div className="min-w-0 flex-1">
            <div className="font-semibold">{totals.zone ? `Envío a ${totals.zone.name}` : "¿Dónde lo recibís?"}</div>
            <div className="truncate text-sm text-muted">{totals.zone ? totals.zone.neighborhoods : "Elegí tu barrio para calcular el envío"}</div>
          </div>
          <span className="text-sm font-semibold text-red">{totals.zone ? "Cambiar" : "Elegir"}</span>
        </button>
        <ZonePicker open={zoneOpen} onClose={() => setZoneOpen(false)} />

        <Summary />
      </div>

      <div className="fixed inset-x-0 z-30 mx-auto max-w-[480px] border-t border-line bg-bg bottom-[calc(64px+env(safe-area-inset-bottom,0px))]">
        <div className="gutter flex flex-col gap-1.5 py-3">
          {belowMin && (
            <p className="num text-center text-sm text-red">
              El mínimo para {totals.zone!.name} es {ars(totals.zone!.minOrder)}. Te faltan {ars(totals.zone!.minOrder - totals.subtotal)}.
            </p>
          )}
          <Button onClick={() => navigate("/checkout")} disabled={!!belowMin} className="w-full">
            Continuar · <span className="num">{ars(totals.total)}</span>
          </Button>
        </div>
      </div>
    </>
  );
}
