// Vercel Function: Mercado Pago calls this when a payment changes.
// We ask Mercado Pago for the real payment status (never trust the notification body alone).
// Phase 2: save `status` on the order in the database (external_reference = our order id).

export async function POST(request: Request) {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) return new Response("missing token", { status: 500 });

  const url = new URL(request.url);
  let paymentId = url.searchParams.get("data.id") ?? url.searchParams.get("id");
  try {
    const body = (await request.json()) as { type?: string; data?: { id?: string } };
    if (body?.type && body.type !== "payment") return new Response("ignored", { status: 200 });
    paymentId = body?.data?.id ?? paymentId;
  } catch {
    /* some notifications come with an empty body */
  }
  if (!paymentId) return new Response("ok", { status: 200 });

  const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return new Response("lookup failed", { status: 200 });
  const payment = (await res.json()) as { status?: string; external_reference?: string; transaction_amount?: number };

  // TODO Phase 2: update the order in the database, e.g.
  // await db.orders.update(payment.external_reference, { paid: payment.status === "approved" })
  console.log("Mercado Pago payment", paymentId, payment.status, payment.external_reference, payment.transaction_amount);

  return new Response("ok", { status: 200 });
}
