import type { Order, OrderStatus, PaymentMethod, Product } from "../types";

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

export const ars = (n: number) => money.format(Math.round(n)).replace(/ /g, " ");

export const priceOf = (p: Product) => (p.salePrice && p.salePrice < p.price ? p.salePrice : p.price);

export const discountPct = (p: Product) =>
  p.salePrice && p.salePrice < p.price ? Math.round((1 - p.salePrice / p.price) * 100) : 0;

export const normalize = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export const statusLabel: Record<OrderStatus, string> = {
  new: "Recibido",
  preparing: "Preparando",
  on_the_way: "En camino",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

export const paymentLabel: Record<PaymentMethod, string> = {
  mercadopago: "Mercado Pago",
  transfer: "Transferencia",
  cash: "Efectivo al recibir",
};

export function timeAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "recién";
  if (mins < 60) return `hace ${mins} min`;
  const h = Math.round(mins / 60);
  if (h < 24) return `hace ${h} h`;
  return new Date(iso).toLocaleDateString("es-AR", { day: "numeric", month: "short" });
}

export const itemCount = (o: Order) => o.items.reduce((a, i) => a + i.qty, 0);

/** Delivery time slots for the next three days. Today's slots close 1 hour before they start. */
export function deliverySlots(now = new Date()) {
  const windows: [number, number][] = [
    [10, 13],
    [14, 17],
    [18, 21],
  ];
  const days = ["Hoy", "Mañana"];
  const out: { id: string; day: string; label: string }[] = [];
  for (let d = 0; d < 3; d++) {
    const date = new Date(now);
    date.setDate(now.getDate() + d);
    const day =
      days[d] ??
      date.toLocaleDateString("es-AR", { weekday: "long" }).replace(/^./, (c) => c.toUpperCase());
    for (const [a, b] of windows) {
      if (d === 0 && now.getHours() >= a - 1) continue;
      out.push({ id: `${d}-${a}`, day, label: `${day} · ${a} a ${b} h` });
    }
  }
  return out;
}

export const digits = (s: string) => s.replace(/\D/g, "");

/** Accepts 11 2345 6789, 011..., +54 9 11..., returns 549XXXXXXXXXX for WhatsApp. */
export function toWhatsAppNumber(input: string) {
  let d = digits(input);
  if (d.startsWith("549")) return d;
  if (d.startsWith("54")) return "549" + d.slice(2);
  if (d.startsWith("0")) d = d.slice(1);
  if (d.startsWith("15")) d = "11" + d.slice(2);
  return "549" + d;
}
