import { useMemo, useState, type ReactNode } from "react";
import { Icon, WhatsAppIcon, type IconName } from "../../components/icons";
import { Button, Field, ProductImage, Sheet, inputClass, useToast } from "../../components/ui";
import { ars, itemCount, normalize, paymentLabel, statusLabel, timeAgo } from "../../lib/format";
import { Link, useRouter } from "../../lib/router";
import { tintOf, useStore } from "../../lib/store";
import { statusToCustomerLink } from "../../lib/whatsapp";
import type { Order, OrderStatus, Product, Settings } from "../../types";
import { OrderItems, StatusPill } from "../customer/Orders";

const sections: { to: string; label: string; icon: IconName }[] = [
  { to: "/admin", label: "Pedidos", icon: "receipt" },
  { to: "/admin/productos", label: "Productos", icon: "box" },
  { to: "/admin/zonas", label: "Zonas", icon: "map" },
  { to: "/admin/ajustes", label: "Ajustes", icon: "settings" },
];

export function Admin({ section }: { section: string }) {
  const { adminUnlocked } = useStore();
  if (!adminUnlocked) return <PinGate />;
  return (
    <div className="min-h-dvh bg-surface">
      <AdminBar active={section} />
      <main className="gutter mx-auto max-w-5xl py-5 pb-16">
        {section === "pedidos" && <OrdersPanel />}
        {section === "productos" && <ProductsPanel />}
        {section === "zonas" && <ZonesPanel />}
        {section === "ajustes" && <SettingsPanel />}
      </main>
    </div>
  );
}

function PinGate() {
  const { settings, unlockAdmin } = useStore();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  return (
    <div className="grid min-h-dvh place-items-center bg-surface">
      <form
        className="gutter flex w-full max-w-sm flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (pin === settings.adminPin) unlockAdmin(true);
          else setError("PIN incorrecto. Probá de nuevo.");
        }}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-red text-on-red">
            <Icon name="lock" size={26} />
          </span>
          <h1 className="font-display text-2xl font-extrabold">Panel del local</h1>
          <p className="text-sm text-muted">Ingresá el PIN del local. En la demo es {settings.adminPin === "1234" ? "1234" : "el que configuraste"}.</p>
        </div>
        <input
          id="pin"
          autoFocus
          inputMode="numeric"
          type="password"
          value={pin}
          onChange={(e) => {
            setPin(e.target.value);
            setError("");
          }}
          aria-label="PIN"
          className={`${inputClass} text-center text-2xl tracking-[0.5em]`}
        />
        {error && <p className="text-center text-sm text-red">{error}</p>}
        <Button type="submit">Entrar</Button>
        <Link to="/" className="text-center text-sm font-semibold text-muted">
          Volver a la tienda
        </Link>
      </form>
    </div>
  );
}

function AdminBar({ active }: { active: string }) {
  const { settings, unlockAdmin, orders } = useStore();
  const { navigate } = useRouter();
  const newCount = orders.filter((o) => o.status === "new").length;
  return (
    <header className="sticky z-20 border-b border-line bg-bg" style={{ top: "env(safe-area-inset-top, 0px)" }}>
      <div className="gutter mx-auto flex max-w-5xl items-center justify-between gap-3 pt-3">
        <div className="flex items-center gap-2">
          <span className="font-display text-xl font-extrabold text-red">{settings.storeName}</span>
          <span className="rounded-md bg-fg px-1.5 py-0.5 text-[11px] font-bold tracking-wide text-bg uppercase">Panel</span>
        </div>
        <div className="flex items-center gap-1">
          <Link to="/" className="flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-semibold active:bg-surface">
            <Icon name="store" size={18} /> <span className="hidden sm:inline">Ver tienda</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              unlockAdmin(false);
              navigate("/");
            }}
            aria-label="Salir del panel"
            className="grid h-9 w-9 place-items-center rounded-full active:bg-surface"
          >
            <Icon name="logout" size={18} />
          </button>
        </div>
      </div>
      <nav aria-label="Panel" className="no-scrollbar gutter mx-auto flex max-w-5xl gap-1 overflow-x-auto pt-2">
        {sections.map((s) => {
          const key = s.to.split("/")[2] ?? "pedidos";
          const on = key === active;
          return (
            <Link
              key={s.to}
              to={s.to}
              className={`flex h-11 shrink-0 items-center gap-1.5 border-b-[3px] px-3 text-sm font-bold ${on ? "border-red text-fg" : "border-transparent text-muted"}`}
            >
              <Icon name={s.icon} size={18} />
              {s.label}
              {s.label === "Pedidos" && newCount > 0 && (
                <span className="num grid h-5 min-w-5 place-items-center rounded-full bg-red px-1 text-[11px] text-on-red">{newCount}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

/* ================= Orders ================= */

const flow: OrderStatus[] = ["new", "preparing", "on_the_way", "delivered"];
const filters: { key: "active" | OrderStatus | "all"; label: string }[] = [
  { key: "active", label: "En curso" },
  { key: "new", label: "Nuevos" },
  { key: "preparing", label: "Preparando" },
  { key: "on_the_way", label: "En camino" },
  { key: "delivered", label: "Entregados" },
  { key: "all", label: "Todos" },
];

function OrdersPanel() {
  const { orders } = useStore();
  const [filter, setFilter] = useState<(typeof filters)[number]["key"]>("active");
  const [openId, setOpenId] = useState<string | null>(null);

  const today = new Date().toDateString();
  const todays = orders.filter((o) => new Date(o.createdAt).toDateString() === today && o.status !== "cancelled");
  const list = orders.filter((o) =>
    filter === "all" ? true : filter === "active" ? ["new", "preparing", "on_the_way"].includes(o.status) : o.status === filter,
  );
  const count = (s: OrderStatus) => orders.filter((o) => o.status === s).length;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Nuevos" value={String(count("new"))} tone="gold" />
        <Stat label="Preparando" value={String(count("preparing"))} tone="blue" />
        <Stat label="En camino" value={String(count("on_the_way"))} tone="red" />
        <Stat label="Ventas de hoy" value={ars(todays.reduce((a, o) => a + o.total, 0))} sub={`${todays.length} pedidos`} tone="green" />
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            aria-pressed={filter === f.key}
            className={`h-9 shrink-0 rounded-full border px-4 text-sm font-semibold ${filter === f.key ? "border-fg bg-fg text-bg" : "border-line bg-card"}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="rounded-2xl bg-card p-8 text-center text-muted">No hay pedidos en esta lista.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {list.map((o) => (
            <OrderRow key={o.id} order={o} open={openId === o.id} onToggle={() => setOpenId(openId === o.id ? null : o.id)} />
          ))}
        </ul>
      )}
    </div>
  );
}

function Stat({ label, value, sub, tone }: { label: string; value: string; sub?: string; tone: "gold" | "blue" | "red" | "green" }) {
  const stripe = { gold: "bg-gold", blue: "bg-blue", red: "bg-red", green: "bg-green" }[tone];
  return (
    <div className="relative overflow-hidden rounded-2xl bg-card p-4 shadow-card">
      <span className={`absolute inset-y-0 left-0 w-1 ${stripe}`} />
      <div className="text-sm font-semibold text-muted">{label}</div>
      <div className="num font-display text-[26px] leading-tight font-extrabold">{value}</div>
      {sub && <div className="text-xs text-muted">{sub}</div>}
    </div>
  );
}

function OrderRow({ order, open, onToggle }: { order: Order; open: boolean; onToggle: () => void }) {
  const { setOrderStatus, updateOrder, settings } = useStore();
  const toast = useToast();
  const next = flow[flow.indexOf(order.status) + 1];
  const nextLabel: Partial<Record<OrderStatus, string>> = {
    preparing: "Empezar a preparar",
    on_the_way: "Marcar en camino",
    delivered: "Marcar entregado",
  };

  return (
    <li className={`overflow-hidden rounded-2xl bg-card shadow-card ${order.status === "new" ? "ring-2 ring-gold" : ""}`}>
      <button type="button" onClick={onToggle} aria-expanded={open} className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 p-4 text-left">
        <div className="flex min-w-[140px] flex-1 items-center gap-3">
          <span className="num font-display text-xl font-extrabold">#{order.number}</span>
          <StatusPill status={order.status} />
          {order.example && <span className="rounded bg-surface px-1.5 py-0.5 text-[10px] font-bold text-muted uppercase">Ejemplo</span>}
        </div>
        <div className="min-w-[160px] flex-1 text-sm">
          <div className="font-semibold">{order.customer.name}</div>
          <div className="text-muted">
            {order.zoneName} · {order.slot}
          </div>
        </div>
        <div className="flex items-center gap-3 text-right">
          <div>
            <div className="num font-bold">{ars(order.total)}</div>
            <div className={`text-xs font-semibold ${order.paid ? "text-green" : "text-gold-ink"}`}>
              {paymentLabel[order.payment]} · {order.paid ? "pagado" : "a cobrar"}
            </div>
          </div>
          <Icon name="down" size={20} className={`shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {open && (
        <div className="grid gap-5 border-t border-line p-4 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1 text-sm">
              <div className="text-xs text-muted">{timeAgo(order.createdAt)} · {itemCount(order)} productos</div>
              <div className="flex items-start gap-2"><Icon name="pin" size={18} className="mt-0.5 shrink-0 text-red" /><span>{order.customer.address} ({order.zoneName})</span></div>
              <div className="flex items-start gap-2"><Icon name="clock" size={18} className="mt-0.5 shrink-0 text-red" /><span>{order.slot}</span></div>
              <div className="flex items-start gap-2"><Icon name="phone" size={18} className="mt-0.5 shrink-0 text-red" /><span className="select-all">+{order.customer.phone}</span></div>
              {order.customer.notes && <div className="mt-1 rounded-lg bg-gold-soft p-2">📝 {order.customer.notes}</div>}
            </div>

            <div className="flex flex-col gap-2">
              {next && order.status !== "cancelled" && (
                <Button
                  onClick={() => {
                    setOrderStatus(order.id, next);
                    toast(`Pedido #${order.number}: ${statusLabel[next]}`);
                  }}
                >
                  {nextLabel[next]}
                </Button>
              )}
              <a
                href={statusToCustomerLink(order, settings)}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#1fa855] px-5 font-bold text-white"
              >
                <WhatsAppIcon /> Avisar al cliente
              </a>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" onClick={() => updateOrder(order.id, { paid: !order.paid })}>
                  {order.paid ? "Marcar no pagado" : "Marcar pagado"}
                </Button>
                {order.status !== "cancelled" && order.status !== "delivered" ? (
                  <Button variant="secondary" onClick={() => setOrderStatus(order.id, "cancelled")}>
                    Cancelar
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={() => setOrderStatus(order.id, "new")}>
                    Reabrir
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-xl border border-line p-3 text-sm">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 font-bold"><Icon name="file" size={16} /> Factura {order.invoice.type}</div>
                <div className="truncate text-muted">
                  {order.invoice.type === "A" ? `${order.invoice.businessName} · CUIT ${order.invoice.cuit}` : "Consumidor final"}
                </div>
              </div>
              <button
                type="button"
                onClick={() => updateOrder(order.id, { invoice: { ...order.invoice, issued: !order.invoice.issued } })}
                className={`h-9 shrink-0 rounded-full px-3 text-xs font-bold ${order.invoice.issued ? "bg-green-soft text-green" : "bg-gold-soft text-gold-ink"}`}
              >
                {order.invoice.issued ? "Emitida ✓" : "Marcar emitida"}
              </button>
            </div>
          </div>
          <OrderItems order={order} />
        </div>
      )}
    </li>
  );
}

/* ================= Products ================= */

function ProductsPanel() {
  const { products, categories, upsertProduct } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [editing, setEditing] = useState<Product | null>(null);

  const list = useMemo(() => {
    const n = normalize(q);
    return products.filter((p) => (cat === "all" || p.categoryId === cat) && normalize(`${p.name} ${p.nameZh ?? ""}`).includes(n));
  }, [products, q, cat]);

  const blank: Product = { id: "", name: "", nameZh: "", categoryId: categories[0].id, unit: "", price: 0, emoji: "🛍️", stock: true };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Icon name="search" size={18} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
          <input id="p-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar producto" aria-label="Buscar producto" className={`${inputClass} pl-10`} />
        </div>
        <select id="p-cat" value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Categoría" className={`${inputClass} w-auto`}>
          <option value="all">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <Button onClick={() => setEditing(blank)}>
          <Icon name="plus" size={18} /> Nuevo producto
        </Button>
      </div>
      <p className="text-sm text-muted">
        {list.length} productos · {products.filter((p) => !p.stock).length} sin stock. Tocá el precio para cambiarlo.
      </p>

      <ul className="flex flex-col divide-y divide-line overflow-hidden rounded-2xl bg-card shadow-card">
        {list.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center gap-3 p-3">
            <ProductImage emoji={p.emoji} image={p.image} tint={tintOf(p.categoryId)} size="sm" className={`h-12 w-12 shrink-0 rounded-xl ${p.stock ? "" : "opacity-40"}`} />
            <div className="min-w-[140px] flex-1">
              <div className="leading-tight font-semibold">{p.name}</div>
              <div className="text-xs text-muted">
                {p.unit} {p.nameZh && <span lang="zh-CN">· {p.nameZh}</span>}
              </div>
            </div>
            <PriceInput value={p.salePrice ?? p.price} sale={!!p.salePrice} onCommit={(v) => upsertProduct(p.salePrice ? { ...p, salePrice: v } : { ...p, price: v })} label={`Precio de ${p.name}`} />
            <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={p.stock}
                onChange={() => upsertProduct({ ...p, stock: !p.stock })}
                className="peer sr-only"
              />
              <span className="relative h-7 w-12 rounded-full bg-line transition-colors peer-checked:bg-green peer-focus-visible:outline-2 peer-focus-visible:outline-red after:absolute after:top-1 after:left-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" />
              <span className="w-16">{p.stock ? "En stock" : "Sin stock"}</span>
            </label>
            <button type="button" onClick={() => setEditing(p)} aria-label={`Editar ${p.name}`} className="grid h-10 w-10 place-items-center rounded-full active:bg-surface">
              <Icon name="edit" size={20} />
            </button>
          </li>
        ))}
      </ul>

      <ProductEditor product={editing} onClose={() => setEditing(null)} />
    </div>
  );
}

function PriceInput({ value, onCommit, sale, label }: { value: number; onCommit: (v: number) => void; sale: boolean; label: string }) {
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <div className="flex flex-col items-end">
      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted">$</span>
        <input
          aria-label={label}
          inputMode="numeric"
          value={draft ?? String(value)}
          onChange={(e) => setDraft(e.target.value.replace(/\D/g, ""))}
          onBlur={() => {
            if (draft !== null && Number(draft) > 0) onCommit(Number(draft));
            setDraft(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
          className="num h-10 w-[110px] rounded-lg border border-line bg-bg pr-2 pl-6 text-right font-bold outline-none focus:border-red"
        />
      </div>
      {sale && <span className="text-[11px] font-bold text-red">precio oferta</span>}
    </div>
  );
}

const slug = (s: string) =>
  normalize(s)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40) || `prod-${Date.now().toString(36)}`;

async function resizeImage(file: File, max = 600): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = url;
    });
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.82);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function ProductEditor({ product, onClose }: { product: Product | null; onClose: () => void }) {
  return (
    <Sheet open={!!product} onClose={onClose} title={product?.id ? "Editar producto" : "Nuevo producto"}>
      {product && <ProductForm key={product.id || "new"} product={product} onClose={onClose} />}
    </Sheet>
  );
}

function ProductForm({ product, onClose }: { product: Product; onClose: () => void }) {
  const { categories, upsertProduct, deleteProduct, products } = useStore();
  const toast = useToast();
  const [p, setP] = useState<Product>(product);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const set = <K extends keyof Product>(k: K, v: Product[K]) => setP((x) => ({ ...x, [k]: v }));
  const num = (s: string) => Number(s.replace(/\D/g, "")) || 0;

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (p.name.trim().length < 2) return setError("Escribí el nombre del producto.");
        if (p.price <= 0) return setError("El precio tiene que ser mayor a cero.");
        if (p.salePrice && p.salePrice >= p.price) return setError("El precio de oferta tiene que ser menor al precio normal.");
        let id = p.id || slug(p.name);
        if (!p.id && products.some((x) => x.id === id)) id = `${id}-${Date.now().toString(36).slice(-4)}`;
        upsertProduct({ ...p, id, name: p.name.trim(), salePrice: p.salePrice || undefined });
        toast(product.id ? "Producto actualizado" : "Producto creado");
        onClose();
      }}
    >
      <div className="flex items-center gap-4">
        <ProductImage emoji={p.emoji} image={p.image} tint={tintOf(p.categoryId)} size="md" className="h-24 w-24 shrink-0 rounded-2xl" />
        <div className="flex flex-col gap-2">
          <label className="flex h-10 cursor-pointer items-center gap-2 rounded-full border border-line px-4 text-sm font-bold">
            <Icon name="image" size={18} /> {p.image ? "Cambiar foto" : "Subir foto"}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (f) set("image", await resizeImage(f));
              }}
            />
          </label>
          {p.image && (
            <button type="button" onClick={() => set("image", undefined)} className="text-left text-sm font-semibold text-red">
              Quitar foto
            </button>
          )}
        </div>
      </div>

      <Field label="Nombre">
        <input id="pf-name" value={p.name} onChange={(e) => set("name", e.target.value)} className={inputClass} placeholder="Salsa de soja light" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Nombre en chino">
          <input id="pf-zh" lang="zh-CN" value={p.nameZh ?? ""} onChange={(e) => set("nameZh", e.target.value)} className={inputClass} placeholder="生抽" />
        </Field>
        <Field label="Presentación">
          <input id="pf-unit" value={p.unit} onChange={(e) => set("unit", e.target.value)} className={inputClass} placeholder="500 ml" />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Categoría">
          <select id="pf-cat" value={p.categoryId} onChange={(e) => set("categoryId", e.target.value)} className={inputClass}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Ícono (si no hay foto)">
          <input id="pf-emoji" value={p.emoji} onChange={(e) => set("emoji", e.target.value)} className={inputClass} maxLength={4} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Precio ($)">
          <input id="pf-price" inputMode="numeric" value={p.price || ""} onChange={(e) => set("price", num(e.target.value))} className={`${inputClass} num`} placeholder="3100" />
        </Field>
        <Field label="Precio oferta ($)" hint="Vacío = sin oferta">
          <input id="pf-sale" inputMode="numeric" value={p.salePrice || ""} onChange={(e) => set("salePrice", num(e.target.value) || undefined)} className={`${inputClass} num`} placeholder="—" />
        </Field>
      </div>
      <Field label="Descripción">
        <textarea id="pf-desc" value={p.description ?? ""} onChange={(e) => set("description", e.target.value)} rows={3} className={`${inputClass} h-auto py-3`} placeholder="Para qué se usa, cómo se cocina…" />
      </Field>
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 font-semibold">
          <input type="checkbox" checked={p.stock} onChange={(e) => set("stock", e.target.checked)} className="h-5 w-5 accent-[var(--red)]" /> En stock
        </label>
        <label className="flex items-center gap-2 font-semibold">
          <input type="checkbox" checked={!!p.featured} onChange={(e) => set("featured", e.target.checked)} className="h-5 w-5 accent-[var(--red)]" /> Destacado en inicio
        </label>
      </div>
      {error && <p className="text-sm font-medium text-red">{error}</p>}
      <Button type="submit">{product.id ? "Guardar cambios" : "Crear producto"}</Button>
      {product.id &&
        (confirmDelete ? (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setConfirmDelete(false)} className="flex-1">
              No borrar
            </Button>
            <Button
              onClick={() => {
                deleteProduct(product.id);
                toast("Producto borrado");
                onClose();
              }}
              className="flex-1"
            >
              Sí, borrar
            </Button>
          </div>
        ) : (
          <Button variant="ghost" onClick={() => setConfirmDelete(true)}>
            <Icon name="trash" size={18} /> Borrar producto
          </Button>
        ))}
    </form>
  );
}

/* ================= Zones ================= */

function ZonesPanel() {
  const { zones, updateZone, settings } = useStore();
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted">
        Costo de envío y pedido mínimo por zona. Los pedidos desde <b className="num text-fg">{ars(settings.freeDeliveryThreshold)}</b> tienen envío gratis (cambialo en Ajustes).
      </p>
      <ul className="grid gap-3 md:grid-cols-2">
        {zones.map((z) => (
          <li key={z.id} className={`flex flex-col gap-3 rounded-2xl bg-card p-4 shadow-card ${z.active ? "" : "opacity-60"}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-display text-lg font-extrabold">{z.name}</div>
                <div className="text-sm text-muted">{z.neighborhoods}</div>
              </div>
              <label className="flex shrink-0 cursor-pointer items-center gap-2 text-sm font-semibold">
                <input type="checkbox" checked={z.active} onChange={() => updateZone({ ...z, active: !z.active })} className="h-5 w-5 accent-[var(--red)]" />
                Activa
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <MoneyField label="Envío" value={z.fee} onCommit={(fee) => updateZone({ ...z, fee })} />
              <MoneyField label="Pedido mínimo" value={z.minOrder} onCommit={(minOrder) => updateZone({ ...z, minOrder })} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MoneyField({ label, value, onCommit }: { label: string; value: number; onCommit: (v: number) => void }) {
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <label className="flex flex-col gap-1 text-sm font-semibold">
      {label}
      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted">$</span>
        <input
          inputMode="numeric"
          value={draft ?? String(value)}
          onChange={(e) => setDraft(e.target.value.replace(/\D/g, ""))}
          onBlur={() => {
            if (draft !== null) onCommit(Number(draft) || 0);
            setDraft(null);
          }}
          className={`${inputClass} num pl-7`}
        />
      </div>
    </label>
  );
}

/* ================= Settings ================= */

function SettingsPanel() {
  const { settings, updateSettings, resetDemo } = useStore();
  const toast = useToast();
  const [s, setS] = useState<Settings>(settings);
  const [confirmReset, setConfirmReset] = useState(false);
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setS((x) => ({ ...x, [k]: v }));

  return (
    <form
      className="flex max-w-2xl flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        updateSettings({ ...s, whatsapp: s.whatsapp.replace(/\D/g, "") });
        toast("Ajustes guardados");
      }}
    >
      <Group title="Datos del local">
        <Field label="Nombre de la tienda">
          <input id="s-name" value={s.storeName} onChange={(e) => set("storeName", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Dirección del local">
          <input id="s-address" value={s.address} onChange={(e) => set("address", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Horario">
          <input id="s-hours" value={s.hours} onChange={(e) => set("hours", e.target.value)} className={inputClass} />
        </Field>
        <Field label="CUIT del local" hint="Para la factura electrónica (ARCA).">
          <input id="s-cuit" value={s.cuit} onChange={(e) => set("cuit", e.target.value)} className={inputClass} placeholder="30-00000000-0" />
        </Field>
      </Group>

      <Group title="WhatsApp y cobros">
        <Field label="WhatsApp del local" hint="Con código de país, sin espacios. Ej: 5491123456789. Acá llegan los pedidos.">
          <input id="s-wa" inputMode="tel" value={s.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} className={`${inputClass} num`} />
        </Field>
        <Field label="Alias para transferencias">
          <input id="s-alias" value={s.transferAlias} onChange={(e) => set("transferAlias", e.target.value)} className={`${inputClass} uppercase`} />
        </Field>
        <Field label="Titular de la cuenta">
          <input id="s-holder" value={s.transferHolder} onChange={(e) => set("transferHolder", e.target.value)} className={inputClass} />
        </Field>
      </Group>

      <Group title="Envíos y promociones">
        <Field label="Envío gratis desde ($)">
          <input id="s-free" inputMode="numeric" value={s.freeDeliveryThreshold} onChange={(e) => set("freeDeliveryThreshold", Number(e.target.value.replace(/\D/g, "")) || 0)} className={`${inputClass} num`} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Cupón">
            <input id="s-coupon" value={s.couponCode} onChange={(e) => set("couponCode", e.target.value.toUpperCase())} className={`${inputClass} uppercase`} />
          </Field>
          <Field label="Descuento (%)">
            <input id="s-pct" inputMode="numeric" value={s.couponPercent} onChange={(e) => set("couponPercent", Math.min(90, Number(e.target.value.replace(/\D/g, "")) || 0))} className={`${inputClass} num`} />
          </Field>
        </div>
      </Group>

      <Group title="Seguridad">
        <Field label="PIN del panel" hint="Solo para la demo. La versión real usa usuario y contraseña.">
          <input id="s-pin" inputMode="numeric" value={s.adminPin} onChange={(e) => set("adminPin", e.target.value.replace(/\D/g, "").slice(0, 8))} className={`${inputClass} num`} />
        </Field>
      </Group>

      <Button type="submit">Guardar ajustes</Button>

      <div className="flex flex-col gap-2 rounded-2xl border border-line p-4 text-sm">
        <div className="font-bold">Reiniciar demo</div>
        <p className="text-muted">Vuelve al catálogo, zonas y pedidos de ejemplo en este dispositivo.</p>
        {confirmReset ? (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setConfirmReset(false)} className="flex-1">Cancelar</Button>
            <Button onClick={() => { resetDemo(); setConfirmReset(false); toast("Demo reiniciada"); }} className="flex-1">Reiniciar</Button>
          </div>
        ) : (
          <Button variant="secondary" onClick={() => setConfirmReset(true)}>Reiniciar datos</Button>
        )}
      </div>
    </form>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-4 rounded-2xl bg-card p-4 shadow-card">
      <legend className="sr-only">{title}</legend>
      <h2 className="font-display text-lg font-extrabold">{title}</h2>
      {children}
    </fieldset>
  );
}
