# Super M · Supermercado chino online

Mobile-first web app for a Chinese supermarket in Buenos Aires: customers shop from their phone, pick a delivery zone and time slot, and pay with Mercado Pago, bank transfer or cash. The store manages orders, products, delivery zones and settings from the admin panel.

Built with React + Vite + Tailwind. No servers to rent: it runs on Vercel.

## What works today (Phase 1: demo)

**Customer app** (`/`)
- Home with deals, aisles (8 categories with Chinese names), search in Spanish or Chinese
- Product pages, cart with coupon (`BIENVENIDO10`), free-delivery progress bar
- Checkout: delivery zone (CABA/GBA with fee and minimum order), address, time slot, WhatsApp number, payment method, Factura A or B
- Order page with status timeline, transfer alias, and a button that sends the full order to the store's WhatsApp

**Store panel** (`/#/admin`, demo PIN `1234`)
- Orders: new / preparing / on the way / delivered, mark paid, mark invoice issued, "Avisar al cliente" by WhatsApp
- Products: change prices inline, turn stock on/off, add products with photos, offers, featured items
- Zones: delivery fee, minimum order, turn zones on/off
- Settings: store WhatsApp, transfer alias, free-delivery threshold, coupon, admin PIN

**Limit of the demo:** data is saved in each phone's browser. An order placed on one phone shows in the admin panel of that same phone only. The WhatsApp button is how the store receives orders until Phase 2.

## Run on your computer

Needs Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open the address it prints (usually http://localhost:5173). To see it on your phone on the same Wi-Fi: `npm run dev -- --host`.

## Put it online (GitHub + Vercel)

1. Create a repository on GitHub (for example `super-m`) and upload this folder.
2. Go to vercel.com → **Add New → Project** → import the repository. Vercel detects Vite. Click **Deploy**.
3. You get a link like `super-m.vercel.app`. Every push to GitHub updates it automatically.

Before sharing, open **Panel → Ajustes** and set the store WhatsApp, transfer alias and account holder.

> **Vercel plan:** the free Hobby plan is for personal, non-commercial projects. It's fine for the demo. When you start selling to customers, upgrade the project to Vercel Pro (US$20/month) or move the same code to a host whose free plan allows commercial use (Netlify or Cloudflare Pages work with no code changes).

## Turn on real Mercado Pago payments

1. In Mercado Pago → **Tus integraciones**, create an application and copy the **test** Access Token.
2. In Vercel → Project → Settings → Environment Variables add:
   - `VITE_MP_ENABLED` = `true`
   - `MP_ACCESS_TOKEN` = your access token
   - `SITE_URL` = your Vercel address, e.g. `https://super-m.vercel.app`
3. Redeploy. "Pagar con Mercado Pago" now opens the real Mercado Pago checkout and returns to the order page.
4. Test with Mercado Pago's test cards, then switch to the production token.

The functions are in `api/create-preference.ts` and `api/mp-webhook.ts`. Before charging real customers, finish Phase 2 so the server takes the order total from the database instead of from the phone.

## Roadmap

| Phase | What | Cost |
|---|---|---|
| 1. Demo (this) | Full app with example catalog, WhatsApp orders | Free |
| 2. Real database | Supabase: shared products and orders across all phones, staff login, Mercado Pago webhook marks orders paid | Free tier to start |
| 3. Electronic invoices | Connect ARCA (ex AFIP) through a billing service so "Factura" issues real invoices | Service fee |
| 4. App stores | Wrap the web app for Google Play / App Store | US$25 once / US$99 per year |

## Where to change things

| To change | File |
|---|---|
| Example products, zones, settings | `src/data/seed.ts` |
| Colors and fonts | `src/index.css` |
| Home page | `src/pages/customer/Home.tsx` |
| Checkout | `src/pages/customer/Checkout.tsx` |
| Admin panel | `src/pages/admin/Admin.tsx` |
| Data layer (swap to database in Phase 2) | `src/lib/store.tsx` |
| WhatsApp messages | `src/lib/whatsapp.ts` |
