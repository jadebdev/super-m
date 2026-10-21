import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { categories, seedOrders, seedProducts, seedSettings, seedZones } from "../data/seed";
import type { Category, Customer, Invoice, Order, OrderStatus, PaymentMethod, Product, Settings, Zone } from "../types";
import { priceOf } from "./format";

/*
  DEMO DATA LAYER
  ---------------
  Everything is saved in this browser (localStorage), so the demo works with no server.
  Orders placed on a phone appear in the admin panel of the SAME phone/browser only.

  Phase 2 replaces the functions in `actions` below with calls to a real database
  (Supabase). The screens don't need to change: they only use `useStore()`.
*/

const KEY = "superm:v1";

type State = {
  products: Product[];
  zones: Zone[];
  settings: Settings;
  orders: Order[];
  cart: Record<string, number>;
  zoneId: string | null;
  slotId: string | null;
  profile: Customer;
  myOrderIds: string[];
  couponApplied: boolean;
  adminUnlocked: boolean;
};

const initial = (): State => ({
  products: seedProducts,
  zones: seedZones,
  settings: seedSettings,
  orders: seedOrders,
  cart: {},
  zoneId: null,
  slotId: null,
  profile: { name: "", phone: "", address: "" },
  myOrderIds: [],
  couponApplied: false,
  adminUnlocked: false,
});

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial();
    return { ...initial(), ...JSON.parse(raw), adminUnlocked: false };
  } catch {
    return initial();
  }
}

export type NewOrder = {
  customer: Customer;
  zoneId: string;
  slot: string;
  payment: PaymentMethod;
  invoice: Omit<Invoice, "issued">;
};

function makeActions(set: (fn: (s: State) => State) => void) {
  return {
    addToCart: (id: string, qty = 1) => set((s) => ({ ...s, cart: { ...s.cart, [id]: (s.cart[id] ?? 0) + qty } })),
    setQty: (id: string, qty: number) =>
      set((s) => {
        const cart = { ...s.cart };
        if (qty <= 0) delete cart[id];
        else cart[id] = Math.min(qty, 99);
        return { ...s, cart };
      }),
    clearCart: () => set((s) => ({ ...s, cart: {}, couponApplied: false })),
    setZone: (zoneId: string) => set((s) => ({ ...s, zoneId })),
    setSlot: (slotId: string) => set((s) => ({ ...s, slotId })),
    setCoupon: (on: boolean) => set((s) => ({ ...s, couponApplied: on })),
    saveProfile: (profile: Customer) => set((s) => ({ ...s, profile })),
    unlockAdmin: (on: boolean) => set((s) => ({ ...s, adminUnlocked: on })),

    updateOrder: (id: string, patch: Partial<Order>) =>
      set((s) => ({ ...s, orders: s.orders.map((o) => (o.id === id ? { ...o, ...patch } : o)) })),
    setOrderStatus: (id: string, status: OrderStatus) =>
      set((s) => ({ ...s, orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)) })),

    upsertProduct: (p: Product) =>
      set((s) => {
        const exists = s.products.some((x) => x.id === p.id);
        return { ...s, products: exists ? s.products.map((x) => (x.id === p.id ? p : x)) : [p, ...s.products] };
      }),
    deleteProduct: (id: string) =>
      set((s) => {
        const cart = { ...s.cart };
        delete cart[id];
        return { ...s, cart, products: s.products.filter((x) => x.id !== id) };
      }),
    updateZone: (z: Zone) => set((s) => ({ ...s, zones: s.zones.map((x) => (x.id === z.id ? z : x)) })),
    updateSettings: (settings: Settings) => set((s) => ({ ...s, settings })),
    resetDemo: () => set(() => initial()),
  };
}

type Actions = ReturnType<typeof makeActions>;

type Totals = {
  lines: { product: Product; qty: number; unit: number; total: number }[];
  count: number;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  freeDeliveryLeft: number;
  zone: Zone | null;
};

type Store = State &
  Actions & {
    categories: Category[];
    totals: Totals;
    placeOrder: (o: NewOrder) => Order;
  };

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ ...state, adminUnlocked: false }));
    } catch {
      /* storage full or blocked: the demo keeps working in memory */
    }
  }, [state]);

  const actions = useMemo(() => makeActions(setState), []);

  const totals = useMemo<Totals>(() => {
    const byId = new Map(state.products.map((p) => [p.id, p]));
    const lines = Object.entries(state.cart)
      .map(([id, qty]) => {
        const product = byId.get(id);
        if (!product) return null;
        const unit = priceOf(product);
        return { product, qty, unit, total: unit * qty };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
    const subtotal = lines.reduce((a, l) => a + l.total, 0);
    const discount = state.couponApplied ? Math.round((subtotal * state.settings.couponPercent) / 100) : 0;
    const zone = state.zones.find((z) => z.id === state.zoneId && z.active) ?? null;
    const free = subtotal >= state.settings.freeDeliveryThreshold;
    const deliveryFee = lines.length === 0 || free || !zone ? 0 : zone.fee;
    return {
      lines,
      count: lines.reduce((a, l) => a + l.qty, 0),
      subtotal,
      discount,
      deliveryFee,
      total: subtotal - discount + deliveryFee,
      freeDeliveryLeft: Math.max(0, state.settings.freeDeliveryThreshold - subtotal),
      zone,
    };
  }, [state.products, state.cart, state.couponApplied, state.settings, state.zones, state.zoneId]);

  const placeOrder = (o: NewOrder): Order => {
    const zone = state.zones.find((z) => z.id === o.zoneId)!;
    const free = totals.subtotal >= state.settings.freeDeliveryThreshold;
    const deliveryFee = free ? 0 : zone.fee;
    const number = Math.max(1000, ...state.orders.map((x) => x.number)) + 1;
    const order: Order = {
      id: `o-${Date.now().toString(36)}`,
      number,
      createdAt: new Date().toISOString(),
      customer: o.customer,
      zoneId: zone.id,
      zoneName: zone.name,
      slot: o.slot,
      items: totals.lines.map((l) => {
        const cat = categories.find((c) => c.id === l.product.categoryId);
        return {
          productId: l.product.id,
          name: l.product.name,
          price: l.unit,
          qty: l.qty,
          emoji: l.product.emoji,
          image: l.product.image,
          tint: cat?.tint ?? "cream",
        };
      }),
      subtotal: totals.subtotal,
      discount: totals.discount,
      deliveryFee,
      total: totals.subtotal - totals.discount + deliveryFee,
      coupon: state.couponApplied ? state.settings.couponCode : undefined,
      payment: o.payment,
      paid: false,
      status: "new",
      invoice: { ...o.invoice, issued: false },
    };
    setState((s) => ({
      ...s,
      orders: [order, ...s.orders],
      myOrderIds: [order.id, ...s.myOrderIds],
      cart: {},
      couponApplied: false,
      profile: { ...o.customer, notes: "" },
    }));
    return order;
  };

  const value: Store = { ...state, ...actions, categories, totals, placeOrder };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const s = useContext(StoreContext);
  if (!s) throw new Error("useStore must be used inside <StoreProvider>");
  return s;
}

export const tintOf = (categoryId: string) => categories.find((c) => c.id === categoryId)?.tint ?? "cream";
