import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product, Tint } from "../types";
import { ars, discountPct, priceOf } from "../lib/format";
import { Link, useRouter } from "../lib/router";
import { tintOf, useStore } from "../lib/store";
import { Icon } from "./icons";

/* ---------- Product image: a real photo if the store uploaded one, otherwise an aisle-colored tile ---------- */

export function ProductImage({ emoji, image, tint, size = "md", className = "" }: { emoji: string; image?: string; tint: Tint; size?: "sm" | "md" | "lg"; className?: string }) {
  const emojiSize = size === "lg" ? "text-[96px]" : size === "md" ? "text-[52px]" : "text-[26px]";
  return (
    <div
      className={`relative grid place-items-center overflow-hidden ${className}`}
      style={{ background: `var(--t-${tint})` }}
    >
      {image ? (
        <img src={image} alt="" className="h-full w-full object-cover" />
      ) : (
        <span className={`${emojiSize} leading-none drop-shadow-sm select-none`} aria-hidden="true">
          {emoji}
        </span>
      )}
    </div>
  );
}

/* ---------- Price ---------- */

export function Price({ product, big = false }: { product: Product; big?: boolean }) {
  const sale = discountPct(product) > 0;
  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      <span className={`num font-display font-extrabold ${big ? "text-[28px]" : "text-[17px]"} ${sale ? "text-red" : "text-fg"}`}>
        {ars(priceOf(product))}
      </span>
      {sale && <span className={`num text-muted line-through ${big ? "text-base" : "text-xs"}`}>{ars(product.price)}</span>}
    </div>
  );
}

/* ---------- Add to cart / quantity stepper ---------- */

export function QtyStepper({ qty, onChange, size = "md", label }: { qty: number; onChange: (n: number) => void; size?: "md" | "lg"; label: string }) {
  const h = size === "lg" ? "h-12" : "h-9";
  return (
    <div className={`flex ${h} items-center justify-between rounded-full bg-red text-on-red`}>
      <button
        type="button"
        aria-label={`Quitar una unidad de ${label}`}
        className={`grid ${h} aspect-square place-items-center rounded-full active:bg-red-deep`}
        onClick={() => onChange(qty - 1)}
      >
        <Icon name={qty === 1 ? "trash" : "minus"} size={size === "lg" ? 20 : 16} strokeWidth={2.5} />
      </button>
      <span key={qty} className="num pop min-w-6 text-center font-bold" aria-live="polite">
        {qty}
      </span>
      <button
        type="button"
        aria-label={`Agregar una unidad de ${label}`}
        className={`grid ${h} aspect-square place-items-center rounded-full active:bg-red-deep`}
        onClick={() => onChange(qty + 1)}
      >
        <Icon name="plus" size={size === "lg" ? 20 : 16} strokeWidth={2.5} />
      </button>
    </div>
  );
}

export function AddButton({ product }: { product: Product }) {
  const { cart, addToCart, setQty } = useStore();
  const toast = useToast();
  const qty = cart[product.id] ?? 0;
  if (!product.stock) {
    return <div className="grid h-9 place-items-center rounded-full bg-surface text-sm font-semibold text-muted">Sin stock</div>;
  }
  if (qty > 0) return <QtyStepper qty={qty} label={product.name} onChange={(n) => setQty(product.id, n)} />;
  return (
    <button
      type="button"
      onClick={() => {
        addToCart(product.id);
        toast(`Agregaste ${product.name}`);
      }}
      className="flex h-9 w-full items-center justify-center gap-1 rounded-full border-2 border-red font-bold text-red active:bg-red-soft"
    >
      <Icon name="plus" size={16} strokeWidth={2.75} /> Agregar
    </button>
  );
}

/* ---------- Product card ---------- */

export function ProductCard({ product, wide = false }: { product: Product; wide?: boolean }) {
  const pct = discountPct(product);
  return (
    <div className={`flex flex-col gap-2 ${wide ? "w-[150px] shrink-0 snap-start" : ""}`}>
      <Link to={`/p/${product.id}`} className="flex flex-col gap-2" ariaLabel={product.name}>
        <div className="relative">
          <ProductImage
            emoji={product.emoji}
            image={product.image}
            tint={tintOf(product.categoryId)}
            className={`aspect-square w-full rounded-2xl ${product.stock ? "" : "opacity-50 grayscale"}`}
          />
          {pct > 0 && (
            <span className="num absolute top-2 left-2 rounded-md bg-gold px-1.5 py-0.5 text-xs font-extrabold text-[#3d2600]">
              -{pct}%
            </span>
          )}
        </div>
        <Price product={product} />
        <div className="min-h-[2.6em] text-[14px] leading-tight font-semibold">
          <span className="line-clamp-2">{product.name}</span>
        </div>
        <div className="-mt-1 flex items-center justify-between gap-2 text-xs text-muted">
          <span className="truncate">{product.unit}</span>
          {product.nameZh && <span className="shrink-0" lang="zh-CN">{product.nameZh}</span>}
        </div>
      </Link>
      <AddButton product={product} />
    </div>
  );
}

/* ---------- Layout bits ---------- */

export function SectionTitle({ title, action, to }: { title: string; action?: string; to?: string }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <h2 className="font-display text-[21px] leading-tight font-extrabold tracking-tight">{title}</h2>
      {action && to && (
        <Link to={to} className="flex shrink-0 items-center text-sm font-semibold text-red">
          {action} <Icon name="chevron" size={16} />
        </Link>
      )}
    </div>
  );
}

export function PageHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  const { back } = useRouter();
  return (
    <header className="sticky z-20 border-b border-line bg-bg/95 backdrop-blur" style={{ top: "env(safe-area-inset-top, 0px)" }}>
      <div className="gutter flex h-14 items-center gap-2">
        <button type="button" onClick={back} aria-label="Volver" className="-ml-2 grid h-10 w-10 place-items-center rounded-full active:bg-surface">
          <Icon name="back" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-lg leading-tight font-extrabold">{title}</h1>
          {subtitle && <p className="truncate text-xs text-muted">{subtitle}</p>}
        </div>
        {right}
      </div>
    </header>
  );
}

export function EmptyState({ emoji, title, text, action }: { emoji: string; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <span className="text-6xl" aria-hidden="true">{emoji}</span>
      <h2 className="font-display text-xl font-extrabold">{title}</h2>
      <p className="max-w-[30ch] text-muted">{text}</p>
      {action}
    </div>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "whatsapp";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  const styles = {
    primary: "bg-red text-on-red active:bg-red-deep disabled:opacity-40",
    secondary: "bg-card text-fg border border-line active:bg-surface",
    ghost: "text-red active:bg-red-soft",
    whatsapp: "bg-[#1fa855] text-white active:bg-[#178c45]",
  }[variant];
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`flex min-h-12 items-center justify-center gap-2 rounded-full px-5 font-bold ${styles} ${className}`}>
      {children}
    </button>
  );
}

export function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold">{label}</span>
      {children}
      {error ? <span className="text-sm font-medium text-red">{error}</span> : hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "h-12 w-full rounded-xl border border-line bg-card px-3.5 text-[16px] outline-none placeholder:text-muted/70 focus:border-red focus:ring-2 focus:ring-red/20";

export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 sm:items-center" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div
        className="rise pb-safe max-h-[90%] w-full max-w-[560px] overflow-y-auto rounded-t-3xl bg-bg sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="gutter sticky top-0 z-10 flex items-center justify-between border-b border-line bg-bg py-3">
          <h2 className="font-display text-lg font-extrabold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="grid h-10 w-10 place-items-center rounded-full active:bg-surface">
            <Icon name="x" />
          </button>
        </div>
        <div className="gutter py-4">{children}</div>
      </div>
    </div>
  );
}

/* ---------- Toast ---------- */

const ToastContext = createContext<(msg: string) => void>(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<{ text: string; id: number } | null>(null);
  const show = useCallback((text: string) => setMsg({ text, id: Date.now() }), []);
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 1800);
    return () => clearTimeout(t);
  }, [msg]);
  return (
    <ToastContext.Provider value={show}>
      {children}
      {msg && (
        <div key={msg.id} className="rise pointer-events-none fixed inset-x-0 z-[60] flex justify-center px-4 bottom-safe" role="status">
          <div className="flex max-w-[440px] items-center gap-2 rounded-2xl bg-fg px-4 py-3 text-sm font-semibold text-bg shadow-card">
            <Icon name="check" size={18} className="shrink-0 text-gold" strokeWidth={3} />
            <span className="line-clamp-2">{msg.text}</span>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

/* ---------- Copy to clipboard ---------- */

export function CopyButton({ text, label = "Copiar" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard
          ?.writeText(text)
          .then(() => {
            setDone(true);
            setTimeout(() => setDone(false), 1500);
          })
          .catch(() => setDone(false));
      }}
      className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-red-soft px-3 text-sm font-bold text-red-ink"
    >
      <Icon name={done ? "check" : "copy"} size={16} /> {done ? "Copiado" : label}
    </button>
  );
}

export function FreeDeliveryBar() {
  const { totals, settings } = useStore();
  if (totals.count === 0) return null;
  const pct = Math.min(100, (totals.subtotal / settings.freeDeliveryThreshold) * 100);
  const done = totals.freeDeliveryLeft === 0;
  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-green-soft p-3.5">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Icon name="truck" size={20} className="shrink-0 text-green" />
        {done ? (
          <span>¡Tenés envío gratis!</span>
        ) : (
          <span>
            Te faltan <b className="num">{ars(totals.freeDeliveryLeft)}</b> para el envío gratis
          </span>
        )}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-card">
        <div className="h-full rounded-full bg-green transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
