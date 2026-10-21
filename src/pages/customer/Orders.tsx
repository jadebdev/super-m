import { useState } from "react";
import { Icon, WhatsAppIcon } from "../../components/icons";
import { Button, CopyButton, EmptyState, Field, PageHeader, ProductImage, inputClass } from "../../components/ui";
import { ars, itemCount, paymentLabel, statusLabel, timeAgo } from "../../lib/format";
import { Link, useRouter } from "../../lib/router";
import { useStore } from "../../lib/store";
import { orderToStoreLink } from "../../lib/whatsapp";
import type { Order, OrderStatus } from "../../types";

const steps: OrderStatus[] = ["new", "preparing", "on_the_way", "delivered"];

export function StatusPill({ status }: { status: OrderStatus }) {
  const cls: Record<OrderStatus, string> = {
    new: "bg-gold-soft text-gold-ink",
    preparing: "bg-blue-soft text-blue",
    on_the_way: "bg-red-soft text-red-ink",
    delivered: "bg-green-soft text-green",
    cancelled: "bg-surface text-muted",
  };
  return <span className={`inline-flex h-6 items-center rounded-full px-2.5 text-xs font-bold ${cls[status]}`}>{statusLabel[status]}</span>;
}

function Timeline({ status }: { status: OrderStatus }) {
  if (status === "cancelled") return <p className="rounded-xl bg-surface p-3 text-sm font-semibold text-muted">Este pedido fue cancelado.</p>;
  const at = steps.indexOf(status);
  return (
    <ol className="grid grid-cols-4 gap-1">
      {steps.map((s, i) => (
        <li key={s} className="flex flex-col gap-1.5">
          <span className={`h-1.5 rounded-full ${i <= at ? "bg-red" : "bg-line"}`} />
          <span className={`text-[12px] leading-tight font-semibold ${i <= at ? "text-fg" : "text-muted"}`}>{statusLabel[s]}</span>
        </li>
      ))}
    </ol>
  );
}

export function OrderPage({ id }: { id: string }) {
  const { orders, settings, myOrderIds } = useStore();
  const { navigate } = useRouter();
  const order = orders.find((o) => o.id === id);
  if (!order) {
    return (
      <>
        <PageHeader title="Pedido" />
        <EmptyState emoji="🧾" title="No encontramos este pedido" text="Puede que lo hayas hecho desde otro teléfono." />
      </>
    );
  }
  const justPlaced = myOrderIds[0] === order.id && Date.now() - new Date(order.createdAt).getTime() < 10 * 60_000;

  return (
    <>
      <PageHeader title={`Pedido #${order.number}`} subtitle={timeAgo(order.createdAt)} />
      <div className="gutter flex flex-col gap-5 py-5 pb-10">
        {justPlaced && (
          <div className="rise flex flex-col items-center gap-2 rounded-3xl bg-red p-6 text-center text-on-red">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-white/20">
              <Icon name="check" size={30} strokeWidth={3} />
            </span>
            <h2 className="font-display text-2xl font-extrabold">¡Pedido confirmado!</h2>
            <p className="max-w-[32ch] text-white/90">
              Entrega: {order.slot}
              <br />
              {order.customer.address}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 rounded-2xl border border-line p-4">
          <div className="flex items-center justify-between">
            <span className="font-bold">Estado</span>
            <StatusPill status={order.status} />
          </div>
          <Timeline status={order.status} />
        </div>

        {/* Payment */}
        <div className="flex flex-col gap-3 rounded-2xl border border-line p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold">{paymentLabel[order.payment]}</span>
            <span className={`text-sm font-bold ${order.paid ? "text-green" : "text-gold-ink"}`}>{order.paid ? "Pagado" : "Pendiente de pago"}</span>
          </div>
          {order.payment === "transfer" && !order.paid && (
            <div className="flex flex-col gap-3 text-sm">
              <p className="text-muted">
                Transferí <b className="num text-fg">{ars(order.total)}</b> y mandanos el comprobante por WhatsApp.
              </p>
              <div className="flex items-center justify-between gap-2 rounded-xl bg-surface p-3">
                <div className="min-w-0">
                  <div className="text-xs text-muted">Alias</div>
                  <div className="truncate font-bold select-all">{settings.transferAlias}</div>
                  <div className="truncate text-xs text-muted">{settings.transferHolder}</div>
                </div>
                <CopyButton text={settings.transferAlias} />
              </div>
            </div>
          )}
          {order.payment === "cash" && <p className="num text-sm text-muted">Tené {ars(order.total)} listos al recibir. Si podés, con cambio justo.</p>}
        </div>

        {/* WhatsApp */}
        <div className="flex flex-col gap-2">
          <a href={orderToStoreLink(order, settings)} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#1fa855] px-5 font-bold text-white active:bg-[#178c45]">
            <WhatsAppIcon /> Enviar pedido por WhatsApp
          </a>
          <p className="text-center text-xs text-muted">
            WhatsApp del local: <span className="select-all">+{settings.whatsapp}</span>
          </p>
        </div>

        <OrderItems order={order} />

        <Button variant="secondary" onClick={() => navigate("/")}>
          Seguir comprando
        </Button>
      </div>
    </>
  );
}

export function OrderItems({ order }: { order: Order }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-display text-lg font-extrabold">{itemCount(order)} productos</h3>
      <ul className="flex flex-col gap-2.5">
        {order.items.map((i) => (
          <li key={i.productId} className="flex items-center gap-3">
            <ProductImage emoji={i.emoji} image={i.image} tint={i.tint} size="sm" className="h-11 w-11 shrink-0 rounded-lg" />
            <span className="min-w-0 flex-1 text-sm">
              <span className="num font-bold">{i.qty} ×</span> {i.name}
            </span>
            <span className="num text-sm font-semibold">{ars(i.price * i.qty)}</span>
          </li>
        ))}
      </ul>
      <dl className="num flex flex-col gap-1.5 border-t border-line pt-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Productos</dt>
          <dd>{ars(order.subtotal)}</dd>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between text-green">
            <dt>Cupón {order.coupon}</dt>
            <dd>-{ars(order.discount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-muted">Envío · {order.zoneName}</dt>
          <dd>{order.deliveryFee ? ars(order.deliveryFee) : "Gratis"}</dd>
        </div>
        <div className="flex justify-between text-base font-bold">
          <dt>Total</dt>
          <dd>{ars(order.total)}</dd>
        </div>
      </dl>
    </div>
  );
}

export function MyOrders() {
  const { orders, myOrderIds } = useStore();
  const { navigate } = useRouter();
  const mine = orders.filter((o) => myOrderIds.includes(o.id));
  return (
    <>
      <PageHeader title="Mis pedidos" />
      {mine.length === 0 ? (
        <EmptyState
          emoji="🧾"
          title="Todavía no hiciste pedidos"
          text="Cuando compres, acá vas a ver el estado de cada envío."
          action={<Button onClick={() => navigate("/")}>Empezar a comprar</Button>}
        />
      ) : (
        <ul className="gutter flex flex-col gap-3 py-4">
          {mine.map((o) => (
            <li key={o.id}>
              <Link to={`/pedido/${o.id}`} className="flex flex-col gap-3 rounded-2xl border border-line p-4">
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg font-extrabold">#{o.number}</span>
                  <StatusPill status={o.status} />
                </div>
                <div className="flex -space-x-2">
                  {o.items.slice(0, 5).map((i) => (
                    <ProductImage key={i.productId} emoji={i.emoji} image={i.image} tint={i.tint} size="sm" className="h-10 w-10 rounded-full ring-2 ring-bg" />
                  ))}
                </div>
                <div className="flex justify-between text-sm text-muted">
                  <span>{o.slot}</span>
                  <span className="num font-bold text-fg">{ars(o.total)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export function Account() {
  const { profile, saveProfile, settings, resetDemo } = useStore();
  const { navigate } = useRouter();
  const [name, setName] = useState(profile.name);
  const [address, setAddress] = useState(profile.address);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  return (
    <>
      <PageHeader title="Mi cuenta" />
      <div className="gutter flex flex-col gap-6 py-5">
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            saveProfile({ ...profile, name, address });
            setSaved(true);
          }}
        >
          <Field label="Nombre">
            <input id="acc-name" value={name} onChange={(e) => { setName(e.target.value); setSaved(false); }} className={inputClass} placeholder="Tu nombre" />
          </Field>
          <Field label="Dirección de entrega">
            <input id="acc-address" value={address} onChange={(e) => { setAddress(e.target.value); setSaved(false); }} className={inputClass} placeholder="Calle, número, piso" />
          </Field>
          <Button type="submit">{saved ? "Guardado" : "Guardar"}</Button>
        </form>

        <div className="flex flex-col gap-2 rounded-2xl bg-surface p-4 text-sm">
          <h2 className="font-display text-lg font-extrabold">{settings.storeName}</h2>
          <p className="flex items-center gap-2"><Icon name="pin" size={18} className="text-red" />{settings.address}</p>
          <p className="flex items-center gap-2"><Icon name="clock" size={18} className="text-red" />{settings.hours}</p>
          <p className="flex items-center gap-2"><WhatsAppIcon size={18} /> <span className="select-all">+{settings.whatsapp}</span></p>
        </div>

        <div className="flex flex-col gap-2 border-t border-line pt-5">
          <Button variant="secondary" onClick={() => navigate("/admin")}>
            <Icon name="store" size={20} /> Panel del local
          </Button>
          {confirmReset ? (
            <div className="flex flex-col gap-2 rounded-2xl border border-line p-4 text-sm">
              <p>Esto borra carrito, pedidos y cambios del panel en este teléfono y vuelve al catálogo de ejemplo.</p>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setConfirmReset(false)} className="flex-1">Cancelar</Button>
                <Button onClick={() => { resetDemo(); setConfirmReset(false); navigate("/"); }} className="flex-1">Reiniciar</Button>
              </div>
            </div>
          ) : (
            <Button variant="ghost" onClick={() => setConfirmReset(true)}>Reiniciar datos de la demo</Button>
          )}
        </div>
      </div>
    </>
  );
}
