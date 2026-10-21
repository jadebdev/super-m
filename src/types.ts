export type Tint = "amber" | "red" | "blue" | "green" | "orange" | "teal" | "cream" | "purple";

export type Category = {
  id: string;
  name: string;
  nameZh: string;
  emoji: string;
  image?: string; // photo for the aisle tile; the emoji is the fallback
  tint: Tint;
};

export type Product = {
  id: string;
  name: string;
  nameZh?: string;
  categoryId: string;
  unit: string;
  price: number;
  salePrice?: number;
  emoji: string;
  image?: string; // data URL or https URL of a real photo
  stock: boolean;
  featured?: boolean;
  description?: string;
};

export type Zone = {
  id: string;
  name: string;
  area: "CABA" | "GBA";
  neighborhoods: string;
  fee: number;
  minOrder: number;
  active: boolean;
};

export type PaymentMethod = "mercadopago" | "transfer" | "cash";
export type OrderStatus = "new" | "preparing" | "on_the_way" | "delivered" | "cancelled";

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  emoji: string;
  image?: string;
  tint: Tint;
};

export type Invoice = {
  type: "B" | "A";
  cuit?: string;
  businessName?: string;
  issued: boolean;
};

export type Customer = {
  name: string;
  phone: string;
  address: string;
  notes?: string;
};

export type Order = {
  id: string;
  number: number;
  createdAt: string;
  customer: Customer;
  zoneId: string;
  zoneName: string;
  slot: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  coupon?: string;
  payment: PaymentMethod;
  paid: boolean;
  status: OrderStatus;
  invoice: Invoice;
  example?: boolean;
};

export type Settings = {
  storeName: string;
  whatsapp: string; // digits only, with country code, e.g. 5491123456789
  transferAlias: string;
  transferHolder: string;
  cuit: string;
  address: string;
  hours: string;
  freeDeliveryThreshold: number;
  couponCode: string;
  couponPercent: number;
  adminPin: string;
};
