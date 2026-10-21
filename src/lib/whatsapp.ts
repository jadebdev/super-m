import type { Order, Settings } from "../types";
import { ars, paymentLabel, statusLabel } from "./format";

const wa = (number: string, text: string) => `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

/** Customer → store: the full order, so the store gets it on WhatsApp even before the backend exists. */
export function orderToStoreLink(order: Order, settings: Settings) {
  const lines = order.items.map((i) => `• ${i.qty} x ${i.name} — ${ars(i.price * i.qty)}`).join("\n");
  const text = [
    `Hola ${settings.storeName}! Hice el pedido #${order.number} 🛒`,
    "",
    lines,
    "",
    order.discount ? `Descuento: -${ars(order.discount)}` : null,
    `Envío: ${order.deliveryFee ? ars(order.deliveryFee) : "Gratis"}`,
    `*Total: ${ars(order.total)}*`,
    `Pago: ${paymentLabel[order.payment]}`,
    "",
    `📍 ${order.customer.address} (${order.zoneName})`,
    `🕒 ${order.slot}`,
    `👤 ${order.customer.name} · ${order.customer.phone}`,
    order.customer.notes ? `📝 ${order.customer.notes}` : null,
    order.invoice.type === "A" ? `🧾 Factura A · CUIT ${order.invoice.cuit} · ${order.invoice.businessName}` : null,
  ]
    .filter((l) => l !== null)
    .join("\n");
  return wa(settings.whatsapp, text);
}

/** Store → customer: status update from the admin panel. */
export function statusToCustomerLink(order: Order, settings: Settings) {
  const msg: Record<string, string> = {
    new: `recibimos tu pedido #${order.number}. Te avisamos cuando salga.`,
    preparing: `estamos preparando tu pedido #${order.number}.`,
    on_the_way: `tu pedido #${order.number} está en camino 🛵. Llega en la franja ${order.slot}.`,
    delivered: `tu pedido #${order.number} fue entregado. ¡Gracias por comprar en ${settings.storeName}!`,
    cancelled: `tu pedido #${order.number} fue cancelado. Escribinos si tenés dudas.`,
  };
  const first = order.customer.name.split(" ")[0];
  return wa(order.customer.phone, `Hola ${first}, ${msg[order.status]} (Estado: ${statusLabel[order.status]})`);
}
