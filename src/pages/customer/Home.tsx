import { useState } from "react";
import { Icon } from "../../components/icons";
import { FreeDeliveryBar, ProductCard, SectionTitle } from "../../components/ui";
import { ZonePicker } from "../../components/ZonePicker";
import { ars, discountPct } from "../../lib/format";
import { Link, useRouter } from "../../lib/router";
import { useStore } from "../../lib/store";

export function Home() {
  const { products, categories, totals, settings } = useStore();
  const { navigate } = useRouter();
  const [zoneOpen, setZoneOpen] = useState(false);
  const deals = products.filter((p) => discountPct(p) > 0 && p.stock);
  const favorites = products.filter((p) => p.featured);

  return (
    <>
      {/* Red brand band */}
      <header className="sticky z-20 bg-red text-on-red" style={{ top: "env(safe-area-inset-top, 0px)" }}>
        <div className="gutter flex flex-col gap-3 pt-3 pb-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-display text-[26px] leading-none font-extrabold tracking-tight">{settings.storeName}</span>
              <span lang="zh-CN" className="rounded-md bg-gold px-1.5 py-0.5 text-[13px] leading-none font-bold text-[#5a1a00]">
                超市
              </span>
            </div>
            <Link to="/cuenta" ariaLabel="Mi cuenta" className="grid h-10 w-10 place-items-center rounded-full bg-white/15 active:bg-white/25">
              <Icon name="user" />
            </Link>
          </div>
          <button
            type="button"
            onClick={() => navigate("/buscar")}
            className="flex h-12 items-center gap-2.5 rounded-full bg-card px-4 text-left text-muted shadow-card"
          >
            <Icon name="search" size={20} className="text-fg" />
            <span className="truncate">Buscá soja, dumplings, 米粉…</span>
          </button>
        </div>
        <button
          type="button"
          onClick={() => setZoneOpen(true)}
          className="gutter flex w-full items-center gap-2 bg-red-deep py-2.5 text-left text-sm"
        >
          <Icon name="pin" size={18} className="shrink-0" />
          <span className="min-w-0 flex-1 truncate">
            {totals.zone ? (
              <>
                Entregar en <b>{totals.zone.name}</b> · envío {ars(totals.zone.fee)}
              </>
            ) : (
              <b>Elegí tu barrio para ver el costo de envío</b>
            )}
          </span>
          <Icon name="down" size={18} className="shrink-0" />
        </button>
      </header>
      <ZonePicker open={zoneOpen} onClose={() => setZoneOpen(false)} />

      <main className="flex flex-col gap-7 pt-4 pb-6">
        {totals.count > 0 && (
          <div className="gutter">
            <FreeDeliveryBar />
          </div>
        )}

        {/* Promo banners */}
        <section aria-label="Promociones" className="no-scrollbar gutter flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4">
          <Promo
            tone="red"
            eyebrow="Primera compra"
            title={`${settings.couponPercent}% off en tu pedido`}
            body={`Usá el cupón ${settings.couponCode} en el carrito.`}
            cta="Ver ofertas"
            emoji="🧧"
            onClick={() => navigate("/c/ofertas")}
          />
          <Promo
            tone="blue"
            eyebrow="Semana del dumpling"
            title="Hasta 15% en congelados"
            body="Dumplings y gyozas hechos a mano."
            cta="Ir a congelados"
            emoji="🥟"
            onClick={() => navigate("/c/congelados")}
          />
          <Promo
            tone="green"
            eyebrow="CABA y GBA"
            title={`Envío gratis desde ${ars(settings.freeDeliveryThreshold)}`}
            body="Elegí tu franja horaria al pagar."
            cta="Ver zonas"
            emoji="🛵"
            onClick={() => setZoneOpen(true)}
          />
        </section>

        {/* Aisles */}
        <section className="gutter flex flex-col gap-3">
          <SectionTitle title="Pasillos" action="Ver todo" to="/categorias" />
          <div className="grid grid-cols-4 gap-x-2 gap-y-4">
            {categories.map((c) => (
              <Link key={c.id} to={`/c/${c.id}`} className="flex flex-col items-center gap-1.5 text-center">
                <span className="grid aspect-square w-full max-w-[76px] place-items-center rounded-full text-[34px]" style={{ background: `var(--t-${c.tint})` }} aria-hidden="true">
                  {c.emoji}
                </span>
                <span className="text-[12px] leading-tight font-semibold">{c.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Deals rail */}
        {deals.length > 0 && (
          <section className="flex flex-col gap-3">
            <div className="gutter">
              <SectionTitle title="Ofertas de la semana" action="Ver todas" to="/c/ofertas" />
            </div>
            <div className="no-scrollbar gutter flex snap-x gap-3 overflow-x-auto scroll-px-4 pb-1">
              {deals.map((p) => (
                <ProductCard key={p.id} product={p} wide />
              ))}
            </div>
          </section>
        )}

        {/* Favorites grid */}
        <section className="gutter flex flex-col gap-3">
          <SectionTitle title="Lo que más se lleva el barrio" />
          <div className="grid grid-cols-2 gap-x-3 gap-y-6">
            {favorites.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="gutter">
          <div className="grid grid-cols-3 gap-2 rounded-2xl bg-surface p-4 text-center text-[12px] font-semibold">
            <div className="flex flex-col items-center gap-1.5">
              <Icon name="clock" className="text-red" />
              Elegí día y horario
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Icon name="card" className="text-red" />
              Mercado Pago, transferencia o efectivo
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Icon name="truck" className="text-red" />
              Te lo llevamos a tu casa
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function Promo({
  tone,
  eyebrow,
  title,
  body,
  cta,
  emoji,
  onClick,
}: {
  tone: "red" | "blue" | "green";
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  emoji: string;
  onClick: () => void;
}) {
  const bg = { red: "bg-gold-soft", blue: "bg-blue-soft", green: "bg-green-soft" }[tone];
  const accent = { red: "text-red", blue: "text-blue", green: "text-green" }[tone];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex w-[86%] shrink-0 snap-start flex-col items-start gap-1 overflow-hidden rounded-3xl p-5 text-left ${bg}`}
    >
      <span className={`text-xs font-bold tracking-wider uppercase ${accent}`}>{eyebrow}</span>
      <span className="max-w-[70%] font-display text-[24px] leading-[1.05] font-extrabold tracking-tight">{title}</span>
      <span className="max-w-[68%] text-sm text-muted">{body}</span>
      <span className={`mt-2 flex items-center gap-1 text-sm font-bold ${accent}`}>
        {cta} <Icon name="chevron" size={16} />
      </span>
      <span className="pointer-events-none absolute -right-3 -bottom-4 rotate-[-8deg] text-[96px] leading-none" aria-hidden="true">
        {emoji}
      </span>
    </button>
  );
}
