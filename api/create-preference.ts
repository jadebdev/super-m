// Vercel Function: creates a Mercado Pago Checkout Pro payment link.
// Needs env vars MP_ACCESS_TOKEN and SITE_URL (see .env.example).
//
// IMPORTANT before taking real money: once the database exists (Phase 2), load the order
// from the database here and use ITS total. Right now the total comes from the phone,
// which is fine for testing with TEST credentials but not for production.

type Body = {
  orderId: string;
  orderNumber: number;
  total: number;
  payer?: { name?: string; phone?: string };
};

export async function POST(request: Request) {
  const token = process.env.MP_ACCESS_TOKEN;
  const site = (process.env.SITE_URL ?? "").replace(/\/$/, "");
  if (!token || !site) return Response.json({ error: "Faltan MP_ACCESS_TOKEN o SITE_URL en Vercel." }, { status: 500 });

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return Response.json({ error: "Pedido inválido." }, { status: 400 });
  }
  const total = Math.round(Number(body.total));
  if (!body.orderId || !Number.isFinite(total) || total <= 0) {
    return Response.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const back = (status: string) => `${site}/?mp=${status}&order=${encodeURIComponent(body.orderId)}`;

  const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Idempotency-Key": `pref-${body.orderId}`,
    },
    body: JSON.stringify({
      items: [
        {
          id: body.orderId,
          title: `Super M · Pedido #${body.orderNumber}`,
          quantity: 1,
          currency_id: "ARS",
          unit_price: total,
        },
      ],
      payer: body.payer?.name ? { name: body.payer.name } : undefined,
      external_reference: body.orderId,
      back_urls: { success: back("ok"), pending: back("pending"), failure: back("error") },
      auto_return: "approved",
      notification_url: `${site}/api/mp-webhook`,
      statement_descriptor: "SUPER M",
    }),
  });

  const data = (await res.json()) as { init_point?: string; message?: string };
  if (!res.ok || !data.init_point) {
    return Response.json({ error: data.message ?? "Mercado Pago rechazó el pedido." }, { status: 502 });
  }
  return Response.json({ init_point: data.init_point });
}
