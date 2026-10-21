import type { Category, Order, Product, Settings, Zone } from "../types";

// Demo catalog. Prices are examples in ARS; the store edits them in the admin panel.

export const categories: Category[] = [
  { id: "arroz-fideos", name: "Arroz y fideos", nameZh: "米面", emoji: "🍜", tint: "amber" },
  { id: "salsas", name: "Salsas y condimentos", nameZh: "调料", emoji: "🫙", tint: "red" },
  { id: "congelados", name: "Congelados", nameZh: "冷冻", emoji: "🥟", tint: "blue" },
  { id: "verduras", name: "Verduras asiáticas", nameZh: "蔬菜", emoji: "🥬", tint: "green" },
  { id: "tofu", name: "Tofu y frescos", nameZh: "豆制品", emoji: "🫘", tint: "cream" },
  { id: "snacks", name: "Snacks y dulces", nameZh: "零食", emoji: "🍡", tint: "orange" },
  { id: "bebidas", name: "Bebidas", nameZh: "饮料", emoji: "🧋", tint: "teal" },
  { id: "hogar", name: "Cocina y hogar", nameZh: "厨具", emoji: "🥢", tint: "purple" },
];

type P = Omit<Product, "stock"> & { stock?: boolean };
const p = (x: P): Product => ({ stock: true, ...x });

export const seedProducts: Product[] = [
  // Arroz y fideos
  p({ id: "arroz-jazmin-5kg", name: "Arroz jazmín 5 kg", nameZh: "茉莉香米", categoryId: "arroz-fideos", unit: "Bolsa 5 kg", price: 14900, salePrice: 12900, emoji: "🍚", featured: true, description: "Arroz de grano largo y aroma suave. El de todos los días para acompañar salteados y curry." }),
  p({ id: "arroz-glutinoso", name: "Arroz glutinoso", nameZh: "糯米", categoryId: "arroz-fideos", unit: "1 kg", price: 4200, emoji: "🍙", description: "Para zongzi, mochi y arroz pegajoso al vapor." }),
  p({ id: "fideos-arroz", name: "Fideos de arroz finos", nameZh: "米粉", categoryId: "arroz-fideos", unit: "400 g", price: 2650, emoji: "🍜", description: "Se hidratan en 5 minutos. Ideales para salteados y sopas." }),
  p({ id: "ramen-x5", name: "Ramen instantáneo x5", nameZh: "方便面", categoryId: "arroz-fideos", unit: "Pack 5 u.", price: 5400, salePrice: 4590, emoji: "🍜", featured: true, description: "Sabor carne picante. Pack familiar de 5 unidades." }),
  p({ id: "udon-fresco", name: "Fideos udon frescos", nameZh: "乌冬面", categoryId: "arroz-fideos", unit: "200 g", price: 1980, emoji: "🍲", description: "Fideos gruesos de trigo, listos en 2 minutos." }),
  p({ id: "harina-arroz", name: "Harina de arroz", nameZh: "粘米粉", categoryId: "arroz-fideos", unit: "500 g", price: 2300, emoji: "🌾" }),

  // Salsas y condimentos
  p({ id: "soja-light", name: "Salsa de soja light", nameZh: "生抽", categoryId: "salsas", unit: "500 ml", price: 3100, emoji: "🫙", featured: true, description: "Soja clara para condimentar y marinar. Más salada y menos oscura que la soja oscura." }),
  p({ id: "soja-oscura", name: "Salsa de soja oscura", nameZh: "老抽", categoryId: "salsas", unit: "500 ml", price: 3300, emoji: "🫙", description: "Da color y un dulzor suave a carnes estofadas." }),
  p({ id: "salsa-ostras", name: "Salsa de ostras", nameZh: "蚝油", categoryId: "salsas", unit: "510 g", price: 4500, salePrice: 3900, emoji: "🦪", description: "Clásica para verduras salteadas y carne con brócoli." }),
  p({ id: "aceite-sesamo", name: "Aceite de sésamo", nameZh: "芝麻油", categoryId: "salsas", unit: "250 ml", price: 5800, emoji: "🫗", description: "Tostado y muy aromático. Unas gotas al final de la cocción." }),
  p({ id: "vinagre-negro", name: "Vinagre negro", nameZh: "镇江香醋", categoryId: "salsas", unit: "550 ml", price: 3700, emoji: "🍶", description: "Vinagre de arroz añejado. Perfecto para mojar dumplings con jengibre." }),
  p({ id: "doubanjiang", name: "Pasta de habas picante", nameZh: "郫县豆瓣酱", categoryId: "salsas", unit: "500 g", price: 4900, emoji: "🌶️", description: "La base del mapo tofu y de la cocina de Sichuan." }),
  p({ id: "chili-crisp", name: "Aceite de chile crocante", nameZh: "辣椒油", categoryId: "salsas", unit: "210 g", price: 5200, emoji: "🌶️", featured: true, description: "Chile, ajo y maní crocantes en aceite. Va con todo." }),

  // Congelados
  p({ id: "dumplings-cerdo", name: "Dumplings de cerdo y repollo x20", nameZh: "猪肉白菜饺子", categoryId: "congelados", unit: "Bandeja 20 u.", price: 6900, salePrice: 5900, emoji: "🥟", featured: true, description: "Hechos a mano. Hervilos 6 minutos o dorálos a la plancha." }),
  p({ id: "gyozas-verdura", name: "Gyozas de verdura x20", nameZh: "素饺子", categoryId: "congelados", unit: "Bandeja 20 u.", price: 6500, emoji: "🥟", description: "Relleno de repollo, hongos y verdeo. Aptas vegetarianos." }),
  p({ id: "bao-cerdo", name: "Bao de cerdo agridulce x6", nameZh: "叉烧包", categoryId: "congelados", unit: "6 u.", price: 7200, emoji: "🍘", description: "Pancitos al vapor rellenos de cerdo char siu. 10 minutos de vaporera." }),
  p({ id: "langostinos", name: "Langostinos pelados", nameZh: "虾仁", categoryId: "congelados", unit: "400 g", price: 11900, emoji: "🦐" }),
  p({ id: "bolitas-pescado", name: "Bolitas de pescado", nameZh: "鱼丸", categoryId: "congelados", unit: "500 g", price: 5400, emoji: "🍢", description: "Para hot pot y sopas de fideos." }),

  // Verduras
  p({ id: "bok-choy", name: "Bok choy", nameZh: "小白菜", categoryId: "verduras", unit: "500 g", price: 1900, emoji: "🥬", description: "Fresco del día. Salteado con ajo en 3 minutos." }),
  p({ id: "repollo-chino", name: "Repollo chino", nameZh: "大白菜", categoryId: "verduras", unit: "Por unidad", price: 2400, emoji: "🥬" }),
  p({ id: "jengibre", name: "Jengibre fresco", nameZh: "生姜", categoryId: "verduras", unit: "250 g", price: 1600, emoji: "🫚" }),
  p({ id: "shiitake", name: "Hongos shiitake", nameZh: "香菇", categoryId: "verduras", unit: "200 g", price: 3900, emoji: "🍄", stock: false }),
  p({ id: "verdeo", name: "Cebolla de verdeo", nameZh: "葱", categoryId: "verduras", unit: "Atado", price: 900, emoji: "🧅" }),

  // Tofu y frescos
  p({ id: "tofu-firme", name: "Tofu firme", nameZh: "老豆腐", categoryId: "tofu", unit: "400 g", price: 2200, emoji: "🧈", featured: true, description: "Elaborado en Buenos Aires. Ideal para saltear o mapo tofu." }),
  p({ id: "leche-soja", name: "Leche de soja", nameZh: "豆浆", categoryId: "tofu", unit: "1 L", price: 2100, emoji: "🥛" }),
  p({ id: "kimchi", name: "Kimchi de repollo", nameZh: "泡菜", categoryId: "tofu", unit: "400 g", price: 4800, emoji: "🥗" }),

  // Snacks y dulces
  p({ id: "galletas-arroz", name: "Galletitas de arroz", nameZh: "雪饼", categoryId: "snacks", unit: "150 g", price: 2400, emoji: "🍘" }),
  p({ id: "palitos-choco", name: "Palitos de chocolate", nameZh: "巧克力棒", categoryId: "snacks", unit: "40 g", price: 1500, emoji: "🍫" }),
  p({ id: "algas", name: "Algas tostadas x10", nameZh: "海苔", categoryId: "snacks", unit: "Pack 10 u.", price: 3200, salePrice: 2700, emoji: "🍙" }),
  p({ id: "caramelos-leche", name: "Caramelos de leche", nameZh: "奶糖", categoryId: "snacks", unit: "180 g", price: 2900, emoji: "🍬" }),
  p({ id: "mochi", name: "Mochi de poroto rojo x6", nameZh: "红豆麻薯", categoryId: "snacks", unit: "6 u.", price: 3600, emoji: "🍡", featured: true }),

  // Bebidas
  p({ id: "te-taro", name: "Té con leche de taro", nameZh: "芋头奶茶", categoryId: "bebidas", unit: "500 ml", price: 2300, emoji: "🧋", featured: true }),
  p({ id: "jugo-lichi", name: "Jugo de lichi", nameZh: "荔枝汁", categoryId: "bebidas", unit: "1 L", price: 2800, salePrice: 2350, emoji: "🧃" }),
  p({ id: "te-jazmin", name: "Té verde jazmín", nameZh: "茉莉绿茶", categoryId: "bebidas", unit: "500 ml", price: 1800, emoji: "🍵" }),
  p({ id: "bebida-coco", name: "Bebida de coco", nameZh: "椰汁", categoryId: "bebidas", unit: "330 ml", price: 1700, emoji: "🥥" }),

  // Cocina y hogar
  p({ id: "palitos-bambu", name: "Palitos de bambú x10 pares", nameZh: "竹筷", categoryId: "hogar", unit: "10 pares", price: 2500, emoji: "🥢" }),
  p({ id: "wok", name: "Wok de acero al carbono 32 cm", nameZh: "炒锅", categoryId: "hogar", unit: "Unidad", price: 32900, salePrice: 27900, emoji: "🍳", description: "Curalo una vez y te dura años. Apto cocina a gas." }),
  p({ id: "vaporera", name: "Vaporera de bambú 25 cm", nameZh: "竹蒸笼", categoryId: "hogar", unit: "2 pisos + tapa", price: 18900, emoji: "🧺" }),
];

export const seedZones: Zone[] = [
  { id: "caba-norte", name: "CABA Norte", area: "CABA", neighborhoods: "Belgrano, Núñez, Colegiales, Palermo", fee: 2500, minOrder: 15000, active: true },
  { id: "caba-centro", name: "CABA Centro", area: "CABA", neighborhoods: "Recoleta, Balvanera, Almagro, Caballito", fee: 2500, minOrder: 15000, active: true },
  { id: "caba-oeste", name: "CABA Oeste", area: "CABA", neighborhoods: "Villa Urquiza, Devoto, Flores, Floresta", fee: 3000, minOrder: 15000, active: true },
  { id: "caba-sur", name: "CABA Sur", area: "CABA", neighborhoods: "San Telmo, Barracas, Boedo, Parque Patricios", fee: 3000, minOrder: 15000, active: true },
  { id: "gba-norte", name: "GBA Norte", area: "GBA", neighborhoods: "Vicente López, Olivos, San Isidro", fee: 4500, minOrder: 25000, active: true },
  { id: "gba-oeste", name: "GBA Oeste", area: "GBA", neighborhoods: "Ramos Mejía, Haedo, Morón", fee: 5000, minOrder: 25000, active: true },
  { id: "gba-sur", name: "GBA Sur", area: "GBA", neighborhoods: "Avellaneda, Lanús, Quilmes", fee: 5000, minOrder: 25000, active: false },
];

export const seedSettings: Settings = {
  storeName: "Super M",
  whatsapp: "5491100000000",
  transferAlias: "SUPERM.CHINO.MP",
  transferHolder: "Nombre del titular (editar en Ajustes)",
  cuit: "",
  address: "Dirección del local (editar en Ajustes)",
  hours: "Lunes a domingo, 9 a 21 h",
  freeDeliveryThreshold: 30000,
  couponCode: "BIENVENIDO10",
  couponPercent: 10,
  adminPin: "1234",
};

function hoursAgo(h: number) {
  return new Date(Date.now() - h * 3600_000).toISOString();
}

// Example orders so the admin panel shows how it works. They are marked as examples.
export const seedOrders: Order[] = [
  {
    id: "ej-1001", number: 1001, createdAt: hoursAgo(5), example: true,
    customer: { name: "Lucía Fernández", phone: "5491155550101", address: "Av. Cabildo 2100, 4° B", notes: "Timbre no anda, llamar" },
    zoneId: "caba-norte", zoneName: "CABA Norte", slot: "Hoy · 14 a 17 h",
    items: [
      { productId: "dumplings-cerdo", name: "Dumplings de cerdo y repollo x20", price: 5900, qty: 2, emoji: "🥟", tint: "blue" },
      { productId: "soja-light", name: "Salsa de soja light", price: 3100, qty: 1, emoji: "🫙", tint: "red" },
      { productId: "bok-choy", name: "Bok choy", price: 1900, qty: 2, emoji: "🥬", tint: "green" },
    ],
    subtotal: 18700, discount: 0, deliveryFee: 2500, total: 21200,
    payment: "mercadopago", paid: true, status: "on_the_way", invoice: { type: "B", issued: true },
  },
  {
    id: "ej-1002", number: 1002, createdAt: hoursAgo(2), example: true,
    customer: { name: "Martín Gómez", phone: "5491155550202", address: "Juramento 3400, PB" },
    zoneId: "caba-norte", zoneName: "CABA Norte", slot: "Hoy · 18 a 21 h",
    items: [
      { productId: "arroz-jazmin-5kg", name: "Arroz jazmín 5 kg", price: 12900, qty: 1, emoji: "🍚", tint: "amber" },
      { productId: "chili-crisp", name: "Aceite de chile crocante", price: 5200, qty: 2, emoji: "🌶️", tint: "red" },
      { productId: "tofu-firme", name: "Tofu firme", price: 2200, qty: 3, emoji: "🧈", tint: "cream" },
    ],
    subtotal: 29900, discount: 2990, deliveryFee: 2500, total: 29410, coupon: "BIENVENIDO10",
    payment: "transfer", paid: false, status: "preparing", invoice: { type: "A", cuit: "30-12345678-9", businessName: "Restó Dragón SRL", issued: false },
  },
  {
    id: "ej-1003", number: 1003, createdAt: hoursAgo(0.5), example: true,
    customer: { name: "Wei Zhang", phone: "5491155550303", address: "Olazábal 1900, 2° A" },
    zoneId: "caba-norte", zoneName: "CABA Norte", slot: "Mañana · 10 a 13 h",
    items: [
      { productId: "wok", name: "Wok de acero al carbono 32 cm", price: 27900, qty: 1, emoji: "🍳", tint: "purple" },
      { productId: "aceite-sesamo", name: "Aceite de sésamo", price: 5800, qty: 1, emoji: "🫗", tint: "red" },
    ],
    subtotal: 33700, discount: 0, deliveryFee: 0, total: 33700,
    payment: "cash", paid: false, status: "new", invoice: { type: "B", issued: false },
  },
];
