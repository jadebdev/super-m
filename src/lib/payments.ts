import type { Order } from "../types";

/**
 * Mercado Pago (Checkout Pro).
 * - Demo mode (VITE_MP_ENABLED not "true"): the app shows a simulated payment screen.
 * - Live mode: the app asks our Vercel function /api/create-preference for a payment link
 *   and sends the customer to Mercado Pago. After paying they come back to /?mp=ok&order=ID.
 */
export const MP_ENABLED = import.meta.env.VITE_MP_ENABLED === "true";

export async function createMercadoPagoLink(order: Order): Promise<string> {
  const res = await fetch("/api/create-preference", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orderId: order.id,
      orderNumber: order.number,
      total: order.total,
      payer: { name: order.customer.name, phone: order.customer.phone },
    }),
  });
  if (!res.ok) throw new Error("No pudimos iniciar el pago. Probá de nuevo o elegí otro medio de pago.");
  const data = (await res.json()) as { init_point?: string };
  if (!data.init_point) throw new Error("Mercado Pago no devolvió el link de pago.");
  return data.init_point;
}

/** Reads ?mp=ok&order=ID when the customer returns from Mercado Pago. */
export function readPaymentReturn(): { status: string; orderId: string } | null {
  try {
    const q = new URLSearchParams(window.location.search);
    const status = q.get("mp");
    const orderId = q.get("order");
    if (!status || !orderId) return null;
    window.history.replaceState(null, "", window.location.pathname + window.location.hash);
    return { status, orderId };
  } catch {
    return null;
  }
}
