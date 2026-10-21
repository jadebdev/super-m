import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Icon, type IconName } from "../../components/icons";
import { Button, EmptyState, Field, PageHeader, Sheet, inputClass } from "../../components/ui";
import { ars, deliverySlots, digits, toWhatsAppNumber } from "../../lib/format";
import { MP_ENABLED, createMercadoPagoLink } from "../../lib/payments";
import { useRouter } from "../../lib/router";
import { useStore } from "../../lib/store";
import type { Order, PaymentMethod } from "../../types";
import { Summary } from "./Cart";

type Errors = Partial<Record<"zone" | "slot" | "address" | "name" | "phone" | "cuit" | "businessName", string>>;

export function Checkout() {
  const store = useStore();
  const { totals, zones, zoneId, setZone, slotId, setSlot, profile, settings, placeOrder, updateOrder } = store;
  const { navigate } = useRouter();
  const slots = useMemo(() => deliverySlots(), []);

  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone.startsWith("549") ? profile.phone.slice(3) : profile.phone);
  const [address, setAddress] = useState(profile.address);
  const [notes, setNotes] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("mercadopago");
  const [invoiceA, setInvoiceA] = useState(false);
  const [cuit, setCuit] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [payError, setPayError] = useState("");
  const [demoPay, setDemoPay] = useState<Order | null>(null);

  // Default to the first open slot
  useEffect(() => {
    if (!slotId || !slots.some((s) => s.id === slotId)) setSlot(slots[0]?.id ?? "");
  }, [slotId, slots, setSlot]);

  if (totals.count === 0 && !demoPay) {
    return (
      <>
        <PageHeader title="Pagar" />
        <EmptyState emoji="🛒" title="No hay nada para pagar" text="Tu carrito está vacío." action={<Button onClick={() => navigate("/")}>Ir a comprar</Button>} />
      </>
    );
  }

  const zone = zones.find((z) => z.id === zoneId && z.active);
  const slot = slots.find((s) => s.id === slotId);

  const validate = (): Errors => {
    const e: Errors = {};
    if (!zone) e.zone = "Elegí tu barrio.";
    else if (totals.subtotal < zone.minOrder) e.zone = `El pedido mínimo para ${zone.name} es ${ars(zone.minOrder)}.`;
    if (!slot) e.slot = "Elegí una franja horaria.";
    if (address.trim().length < 5) e.address = "Escribí calle, número y piso o depto.";
    if (name.trim().length < 2) e.name = "Escribí tu nombre.";
    const d = digits(phone);
    if (d.length < 10 || d.length > 13) e.phone = "Escribí tu celular con código de área, por ejemplo 11 2345 6789.";
    if (invoiceA) {
      if (digits(cuit).length !== 11) e.cuit = "El CUIT tiene 11 números.";
      if (businessName.trim().length < 2) e.businessName = "Escribí la razón social.";
    }
    return e;
  };

  const submit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`f-${Object.keys(e)[0]}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setBusy(true);
    setPayError("");
    const order = placeOrder({
      customer: { name: name.trim(), phone: toWhatsAppNumber(phone), address: address.trim(), notes: notes.trim() || undefined },
      zoneId: zone!.id,
      slot: slot!.label,
      payment,
      invoice: invoiceA ? { type: "A", cuit: cuit.trim(), businessName: businessName.trim() } : { type: "B" },
    });

    if (payment === "mercadopago") {
      if (MP_ENABLED) {
        try {
          window.location.href = await createMercadoPagoLink(order);
          return;
        } catch (err) {
          setBusy(false);
          setPayError((err as Error).message);
          navigate(`/pedido/${order.id}`);
          return;
        }
      }
      setBusy(false);
      setDemoPay(order);
      return;
    }
    setBusy(false);
    navigate(`/pedido/${order.id}`);
  };

  return (
    <>
      <PageHeader title="Finalizar compra" subtitle="Entrega, datos y pago" />
      <div className="gutter flex flex-col gap-7 py-5 pb-40">
        <Section n={1} title="Entrega">
          <div id="f-zone" className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold">Barrio</span>
            <select
              id="zone"
              value={zoneId ?? ""}
              onChange={(e) => setZone(e.target.value)}
              className={`${inputClass} appearance-none`}
              aria-invalid={!!errors.zone}
            >
              <option value="" disabled>
                Elegí tu barrio
              </option>
              {zones
                .filter((z) => z.active)
                .map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name} — {z.neighborhoods} ({ars(z.fee)})
                  </option>
                ))}
            </select>
            {errors.zone && <span className="text-sm font-medium text-red">{errors.zone}</span>}
          </div>

          <div id="f-address">
            <Field label="Dirección" error={errors.address}>
              <input id="address" value={address} onChange={(e) => setAddress(e.target.value)} autoComplete="street-address" placeholder="Av. Cabildo 2100, 4° B" className={inputClass} />
            </Field>
          </div>

          <div id="f-slot" className="flex flex-col gap-2">
            <span className="text-sm font-semibold">Día y horario</span>
            <div className="grid grid-cols-2 gap-2">
              {slots.slice(0, 6).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSlot(s.id)}
                  aria-pressed={slotId === s.id}
                  className={`flex flex-col items-start rounded-xl border-2 px-3 py-2.5 text-left ${slotId === s.id ? "border-red bg-red-soft" : "border-line bg-card"}`}
                >
                  <span className="text-xs font-bold tracking-wide text-muted uppercase">{s.day}</span>
                  <span className="font-semibold">{s.label.split(" · ")[1]}</span>
                </button>
              ))}
            </div>
            {errors.slot && <span className="text-sm font-medium text-red">{errors.slot}</span>}
          </div>

          <Field label="Indicaciones para el repartidor (opcional)">
            <input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Timbre, portero, entre calles…" className={inputClass} />
          </Field>
        </Section>

        <Section n={2} title="Tus datos">
          <div id="f-name">
            <Field label="Nombre y apellido" error={errors.name}>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Lucía Fernández" className={inputClass} />
            </Field>
          </div>
          <div id="f-phone">
            <Field label="Celular (WhatsApp)" hint="Te avisamos por WhatsApp cuando el pedido sale." error={errors.phone}>
              <div className="flex gap-2">
                <span className="grid h-12 shrink-0 place-items-center rounded-xl bg-surface px-3 font-semibold">+54 9</span>
                <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel-national" placeholder="11 2345 6789" className={inputClass} />
              </div>
            </Field>
          </div>
        </Section>

        <Section n={3} title="Pago">
          <div className="flex flex-col gap-2" role="radiogroup" aria-label="Medio de pago">
            <PayOption
              icon="card"
              title="Mercado Pago"
              text="Tarjeta de crédito, débito o dinero en cuenta."
              selected={payment === "mercadopago"}
              onClick={() => setPayment("mercadopago")}
              badge="Recomendado"
            />
            <PayOption
              icon="bank"
              title="Transferencia"
              text={`Al alias ${settings.transferAlias}. Te mostramos los datos al confirmar.`}
              selected={payment === "transfer"}
              onClick={() => setPayment("transfer")}
            />
            <PayOption icon="cash" title="Efectivo al recibir" text="Pagás cuando llega el pedido." selected={payment === "cash"} onClick={() => setPayment("cash")} />
          </div>
        </Section>

        <Section n={4} title="Factura">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setInvoiceA(false)}
              aria-pressed={!invoiceA}
              className={`rounded-xl border-2 p-3 text-left ${!invoiceA ? "border-red bg-red-soft" : "border-line bg-card"}`}
            >
              <div className="font-bold">Consumidor final</div>
              <div className="text-xs text-muted">Factura B</div>
            </button>
            <button
              type="button"
              onClick={() => setInvoiceA(true)}
              aria-pressed={invoiceA}
              className={`rounded-xl border-2 p-3 text-left ${invoiceA ? "border-red bg-red-soft" : "border-line bg-card"}`}
            >
              <div className="font-bold">Con CUIT</div>
              <div className="text-xs text-muted">Factura A para empresas</div>
            </button>
          </div>
          {invoiceA && (
            <div className="flex flex-col gap-4">
              <div id="f-cuit">
                <Field label="CUIT" error={errors.cuit}>
                  <input id="cuit" value={cuit} onChange={(e) => setCuit(e.target.value)} inputMode="numeric" placeholder="30-12345678-9" className={inputClass} />
                </Field>
              </div>
              <div id="f-businessName">
                <Field label="Razón social" error={errors.businessName}>
                  <input id="businessName" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Restó Dragón SRL" className={inputClass} />
                </Field>
              </div>
            </div>
          )}
          <p className="text-xs text-muted">Te enviamos la factura electrónica por WhatsApp junto con el pedido.</p>
        </Section>

        <div className="rounded-2xl bg-surface p-4">
          <Summary showZoneHint={false} />
        </div>
        {payError && <p className="text-sm text-red">{payError}</p>}
      </div>

      <div className="pb-safe fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[480px] border-t border-line bg-bg">
        <div className="gutter py-3">
          <Button onClick={submit} disabled={busy} className="w-full">
            {busy ? "Procesando…" : payment === "mercadopago" ? "Pagar con Mercado Pago" : "Confirmar pedido"} ·{" "}
            <span className="num">{ars(totals.total)}</span>
          </Button>
        </div>
      </div>

      <DemoPaymentSheet
        order={demoPay}
        onApprove={() => {
          if (!demoPay) return;
          updateOrder(demoPay.id, { paid: true });
          const id = demoPay.id;
          setDemoPay(null);
          navigate(`/pedido/${id}`);
        }}
        onClose={() => {
          const id = demoPay?.id;
          setDemoPay(null);
          if (id) navigate(`/pedido/${id}`);
        }}
      />
    </>
  );
}

function Section({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="flex items-center gap-2.5 font-display text-xl font-extrabold">
        <span className="num grid h-7 w-7 place-items-center rounded-full bg-fg text-sm text-bg">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function PayOption({ icon, title, text, selected, onClick, badge }: { icon: IconName; title: string; text: string; selected: boolean; onClick: () => void; badge?: string }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-2xl border-2 p-3.5 text-left ${selected ? "border-red bg-red-soft" : "border-line bg-card"}`}
    >
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${selected ? "bg-red text-on-red" : "bg-surface"}`}>
        <Icon name={icon} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2 font-bold">
          {title}
          {badge && <span className="rounded-md bg-gold-soft px-1.5 py-0.5 text-[11px] font-bold text-gold-ink">{badge}</span>}
        </span>
        <span className="block text-sm text-muted">{text}</span>
      </span>
      <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${selected ? "border-red bg-red text-on-red" : "border-line"}`}>
        {selected && <Icon name="check" size={14} strokeWidth={3.5} />}
      </span>
    </button>
  );
}

/** Shown only in demo mode, where real Mercado Pago credentials are not connected yet. */
function DemoPaymentSheet({ order, onApprove, onClose }: { order: Order | null; onApprove: () => void; onClose: () => void }) {
  return (
    <Sheet open={!!order} onClose={onClose} title="Pago con Mercado Pago">
      {order && (
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3 rounded-2xl bg-gold-soft p-4 text-sm">
            <Icon name="sparkle" className="shrink-0 text-gold-ink" />
            <p>
              <b>Modo demo.</b> Cuando conectemos la cuenta de Mercado Pago del local, este botón abre la página de pago real de Mercado Pago.
            </p>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-2xl border border-line p-5 text-center">
            <span className="text-sm text-muted">Pedido #{order.number}</span>
            <span className="num font-display text-4xl font-extrabold">{ars(order.total)}</span>
          </div>
          <button type="button" onClick={onApprove} className="min-h-12 w-full rounded-full bg-[#009ee3] px-5 font-bold text-white active:bg-[#0083bd]">
            Simular pago aprobado
          </button>
          <Button variant="secondary" onClick={onClose} className="w-full">
            Pagar más tarde
          </Button>
        </div>
      )}
    </Sheet>
  );
}
