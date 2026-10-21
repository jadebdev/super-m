import type { Category, Order, Product, Settings, Zone } from "../types";

// Demo catalog. Prices are examples in ARS; the store edits them in the admin panel.

export const categories: Category[] = [
  // Everyday aisles
  { id: "frutas-verduras", name: "Frutas y verduras", nameZh: "果蔬", emoji: "🍎", image: "/products/manzanas.jpg", tint: "green" },
  { id: "panaderia", name: "Panadería", nameZh: "面包", emoji: "🥖", image: "/products/medialunas.jpg", tint: "amber" },
  { id: "lacteos", name: "Lácteos y huevos", nameZh: "奶制品", emoji: "🥛", image: "/products/leche.jpg", tint: "blue" },
  { id: "carnes", name: "Carnes y fiambres", nameZh: "肉类", emoji: "🥩", image: "/products/asado.jpg", tint: "red" },
  { id: "almacen", name: "Almacén", nameZh: "粮油", emoji: "🥫", image: "/products/fideos-spaghetti.jpg", tint: "orange" },
  { id: "bebidas", name: "Bebidas", nameZh: "饮料", emoji: "🥤", image: "/products/vino-malbec.jpg", tint: "teal" },
  { id: "snacks", name: "Snacks y golosinas", nameZh: "零食", emoji: "🍫", image: "/products/papas-fritas.jpg", tint: "orange" },
  { id: "congelados", name: "Congelados", nameZh: "冷冻", emoji: "🥟", image: "/products/dumplings-cerdo.jpg", tint: "blue" },
  { id: "limpieza", name: "Limpieza", nameZh: "清洁", emoji: "🧽", image: "/products/detergente.jpg", tint: "teal" },
  { id: "perfumeria", name: "Perfumería e higiene", nameZh: "个护", emoji: "🧴", image: "/products/shampoo.jpg", tint: "purple" },
  { id: "mascotas", name: "Mascotas", nameZh: "宠物", emoji: "🐶", image: "/products/alimento-perro.jpg", tint: "cream" },
  // Asian specialty aisles
  { id: "arroz-fideos", name: "Arroz y fideos orientales", nameZh: "米面", emoji: "🍜", image: "/products/ramen-x5.jpg", tint: "amber" },
  { id: "salsas", name: "Salsas y condimentos", nameZh: "调料", emoji: "🌶️", image: "/products/soja-light.jpg", tint: "red" },
  { id: "verduras", name: "Verduras asiáticas", nameZh: "蔬菜", emoji: "🥬", image: "/products/bok-choy.jpg", tint: "green" },
  { id: "tofu", name: "Tofu y frescos", nameZh: "豆制品", emoji: "🥡", image: "/products/tofu-firme.jpg", tint: "cream" },
  { id: "hogar", name: "Cocina y hogar", nameZh: "厨具", emoji: "🥢", image: "/products/wok.jpg", tint: "purple" },
];

type P = Omit<Product, "stock"> & { stock?: boolean };
const p = (x: P): Product => ({ stock: true, ...x });

export const seedProducts: Product[] = [
  // ---------- Everyday supermarket ----------

  p({ id: "bananas", name: "Bananas", nameZh: "香蕉", categoryId: "frutas-verduras", unit: "1 kg", price: 2200, emoji: "🍌", image: "/products/bananas.jpg", featured: true }),
  p({ id: "manzanas", name: "Manzanas rojas", nameZh: "红苹果", categoryId: "frutas-verduras", unit: "1 kg", price: 2800, salePrice: 2400, emoji: "🍎", image: "/products/manzanas.jpg" }),
  p({ id: "papas", name: "Papas", nameZh: "土豆", categoryId: "frutas-verduras", unit: "Bolsa 2 kg", price: 2500, emoji: "🥔", image: "/products/papas.jpg" }),
  p({ id: "tomates", name: "Tomates redondos", nameZh: "西红柿", categoryId: "frutas-verduras", unit: "1 kg", price: 3000, emoji: "🍅", image: "/products/tomates.jpg" }),
  p({ id: "cebollas", name: "Cebollas", nameZh: "洋葱", categoryId: "frutas-verduras", unit: "1 kg", price: 1600, emoji: "🧅", image: "/products/cebollas.jpg" }),
  p({ id: "lechuga", name: "Lechuga", nameZh: "生菜", categoryId: "frutas-verduras", unit: "Por unidad", price: 1500, emoji: "🥬", image: "/products/lechuga.jpg" }),
  p({ id: "limones", name: "Limones", nameZh: "柠檬", categoryId: "frutas-verduras", unit: "1 kg", price: 2000, emoji: "🍋", image: "/products/limones.jpg" }),
  p({ id: "zanahorias", name: "Zanahorias", nameZh: "胡萝卜", categoryId: "frutas-verduras", unit: "1 kg", price: 1400, emoji: "🥕", image: "/products/zanahorias.jpg" }),

  p({ id: "pan-frances", name: "Pan francés", nameZh: "法式面包", categoryId: "panaderia", unit: "1 kg", price: 3000, emoji: "🥖", image: "/products/pan-frances.jpg", featured: true, description: "Horneado todas las mañanas. Crocante por fuera, tierno por dentro." }),
  p({ id: "medialunas", name: "Medialunas de manteca x6", nameZh: "牛角面包", categoryId: "panaderia", unit: "6 u.", price: 3600, emoji: "🥐", image: "/products/medialunas.jpg", featured: true, description: "Las del desayuno y la merienda, con almíbar." }),
  p({ id: "pan-lactal", name: "Pan lactal blanco", nameZh: "切片面包", categoryId: "panaderia", unit: "550 g", price: 2900, emoji: "🍞", image: "/products/pan-lactal.jpg" }),
  p({ id: "facturas", name: "Facturas surtidas x6", nameZh: "什锦甜面包", categoryId: "panaderia", unit: "6 u.", price: 4200, emoji: "🥐", image: "/products/facturas.jpg", description: "Vigilantes, cañoncitos y bolas de fraile." }),
  p({ id: "bizcochitos", name: "Bizcochitos de grasa", nameZh: "猪油饼干", categoryId: "panaderia", unit: "250 g", price: 2200, emoji: "🍪", image: "/products/bizcochitos.jpg", description: "Para acompañar el mate." }),

  p({ id: "leche", name: "Leche entera", nameZh: "全脂牛奶", categoryId: "lacteos", unit: "1 L", price: 1500, emoji: "🥛", image: "/products/leche.jpg", featured: true }),
  p({ id: "yogur", name: "Yogur bebible de frutilla", nameZh: "草莓酸奶", categoryId: "lacteos", unit: "1 L", price: 2600, emoji: "🥛", image: "/products/yogur.jpg" }),
  p({ id: "queso-cremoso", name: "Queso cremoso", nameZh: "奶酪", categoryId: "lacteos", unit: "500 g", price: 5800, salePrice: 4990, emoji: "🧀", image: "/products/queso-cremoso.jpg" }),
  p({ id: "manteca", name: "Manteca", nameZh: "黄油", categoryId: "lacteos", unit: "200 g", price: 2700, emoji: "🧈", image: "/products/manteca.jpg" }),
  p({ id: "huevos", name: "Huevos blancos x12", nameZh: "鸡蛋", categoryId: "lacteos", unit: "Maple 12 u.", price: 3900, emoji: "🥚", image: "/products/huevos.jpg", featured: true }),
  p({ id: "dulce-de-leche", name: "Dulce de leche", nameZh: "牛奶酱", categoryId: "lacteos", unit: "400 g", price: 3200, emoji: "🍯", image: "/products/dulce-de-leche.jpg", description: "Clásico argentino para tostadas, panqueques y alfajores." }),
  p({ id: "crema", name: "Crema de leche", nameZh: "奶油", categoryId: "lacteos", unit: "200 ml", price: 2100, emoji: "🥛", image: "/products/crema.jpg" }),

  p({ id: "asado", name: "Asado de tira", nameZh: "牛肋排", categoryId: "carnes", unit: "1 kg", price: 12900, emoji: "🥩", image: "/products/asado.jpg", featured: true, description: "Corte de novillo para la parrilla del domingo." }),
  p({ id: "milanesas", name: "Milanesas de carne", nameZh: "炸牛排", categoryId: "carnes", unit: "1 kg", price: 11500, salePrice: 9900, emoji: "🥩", image: "/products/milanesas.jpg", description: "Rebozadas y listas para freír o al horno." }),
  p({ id: "pollo", name: "Pollo entero", nameZh: "整鸡", categoryId: "carnes", unit: "Aprox. 2,5 kg", price: 9500, emoji: "🍗", image: "/products/pollo.jpg" }),
  p({ id: "jamon", name: "Jamón cocido", nameZh: "火腿", categoryId: "carnes", unit: "200 g", price: 3500, emoji: "🥓", image: "/products/jamon.jpg" }),
  p({ id: "chorizo", name: "Chorizos parrilleros x4", nameZh: "香肠", categoryId: "carnes", unit: "Aprox. 500 g", price: 5200, emoji: "🌭", image: "/products/chorizo.jpg" }),

  p({ id: "fideos-spaghetti", name: "Fideos spaghetti", nameZh: "意大利面", categoryId: "almacen", unit: "500 g", price: 1500, emoji: "🍝", image: "/products/fideos-spaghetti.jpg" }),
  p({ id: "arroz-largo", name: "Arroz largo fino", nameZh: "长粒米", categoryId: "almacen", unit: "1 kg", price: 1900, emoji: "🍚", image: "/products/arroz-largo.jpg" }),
  p({ id: "aceite-girasol", name: "Aceite de girasol", nameZh: "葵花籽油", categoryId: "almacen", unit: "1,5 L", price: 4200, salePrice: 3690, emoji: "🌻", image: "/products/aceite-girasol.jpg" }),
  p({ id: "harina-trigo", name: "Harina de trigo 000", nameZh: "面粉", categoryId: "almacen", unit: "1 kg", price: 1100, emoji: "🌾", image: "/products/harina-trigo.jpg" }),
  p({ id: "tomate-triturado", name: "Tomate triturado", nameZh: "番茄碎", categoryId: "almacen", unit: "520 g", price: 1300, emoji: "🥫", image: "/products/tomate-triturado.jpg" }),
  p({ id: "yerba", name: "Yerba mate", nameZh: "马黛茶", categoryId: "almacen", unit: "1 kg", price: 5500, emoji: "🧉", image: "/products/yerba.jpg", featured: true, description: "Con palo, sabor intenso. La de todos los días." }),
  p({ id: "azucar", name: "Azúcar", nameZh: "白糖", categoryId: "almacen", unit: "1 kg", price: 1300, emoji: "🍬", image: "/products/azucar.jpg" }),
  p({ id: "cafe", name: "Café molido", nameZh: "咖啡粉", categoryId: "almacen", unit: "250 g", price: 4800, emoji: "☕", image: "/products/cafe.jpg" }),

  p({ id: "gaseosa-cola", name: "Gaseosa cola", nameZh: "可乐", categoryId: "bebidas", unit: "2,25 L", price: 3900, salePrice: 3300, emoji: "🥤", image: "/products/gaseosa-cola.jpg", featured: true }),
  p({ id: "agua-mineral", name: "Agua mineral sin gas", nameZh: "矿泉水", categoryId: "bebidas", unit: "2 L", price: 1400, emoji: "💧", image: "/products/agua-mineral.jpg" }),
  p({ id: "cerveza", name: "Cerveza rubia", nameZh: "啤酒", categoryId: "bebidas", unit: "1 L", price: 2900, emoji: "🍺", image: "/products/cerveza.jpg", description: "Venta solo a mayores de 18 años." }),
  p({ id: "vino-malbec", name: "Vino tinto Malbec", nameZh: "马尔贝克红酒", categoryId: "bebidas", unit: "750 ml", price: 6500, emoji: "🍷", image: "/products/vino-malbec.jpg", description: "Malbec de Mendoza. Venta solo a mayores de 18 años." }),
  p({ id: "jugo-naranja", name: "Jugo de naranja", nameZh: "橙汁", categoryId: "bebidas", unit: "1 L", price: 2400, emoji: "🧃", image: "/products/jugo-naranja.jpg" }),

  p({ id: "papas-fritas", name: "Papas fritas clásicas", nameZh: "薯片", categoryId: "snacks", unit: "150 g", price: 2600, emoji: "🥔", image: "/products/papas-fritas.jpg", featured: true }),
  p({ id: "mani", name: "Maní salado", nameZh: "咸花生", categoryId: "snacks", unit: "200 g", price: 1800, emoji: "🥜", image: "/products/mani.jpg" }),
  p({ id: "alfajores", name: "Alfajores de chocolate x6", nameZh: "阿根廷夹心饼", categoryId: "snacks", unit: "6 u.", price: 4500, salePrice: 3900, emoji: "🍫", image: "/products/alfajores.jpg", description: "Rellenos de dulce de leche y bañados en chocolate." }),
  p({ id: "chocolate", name: "Chocolate con leche", nameZh: "牛奶巧克力", categoryId: "snacks", unit: "100 g", price: 2900, emoji: "🍫", image: "/products/chocolate.jpg" }),
  p({ id: "galletitas", name: "Galletitas dulces surtidas", nameZh: "甜饼干", categoryId: "snacks", unit: "400 g", price: 2300, emoji: "🍪", image: "/products/galletitas.jpg" }),

  p({ id: "mayonesa", name: "Mayonesa", nameZh: "蛋黄酱", categoryId: "salsas", unit: "500 g", price: 2800, emoji: "🥚", image: "/products/mayonesa.jpg" }),
  p({ id: "ketchup", name: "Ketchup", nameZh: "番茄酱", categoryId: "salsas", unit: "500 g", price: 2600, emoji: "🍅", image: "/products/ketchup.jpg" }),

  p({ id: "hamburguesas", name: "Hamburguesas de carne x4", nameZh: "汉堡肉饼", categoryId: "congelados", unit: "4 u.", price: 4900, emoji: "🍔", image: "/products/hamburguesas.jpg" }),
  p({ id: "papas-congeladas", name: "Papas bastón congeladas", nameZh: "冷冻薯条", categoryId: "congelados", unit: "1 kg", price: 4300, emoji: "🍟", image: "/products/papas-congeladas.jpg" }),
  p({ id: "helado", name: "Helado de dulce de leche", nameZh: "冰淇淋", categoryId: "congelados", unit: "1 kg", price: 8900, salePrice: 7500, emoji: "🍨", image: "/products/helado.jpg" }),
  p({ id: "empanadas", name: "Empanadas de carne x12", nameZh: "阿根廷馅饼", categoryId: "congelados", unit: "12 u.", price: 9600, emoji: "🥟", image: "/products/empanadas.jpg", description: "Listas para el horno: 20 minutos a 200 °C." }),

  p({ id: "detergente", name: "Detergente lavavajillas", nameZh: "洗洁精", categoryId: "limpieza", unit: "750 ml", price: 2200, emoji: "🧴", image: "/products/detergente.jpg" }),
  p({ id: "lavandina", name: "Lavandina", nameZh: "漂白水", categoryId: "limpieza", unit: "2 L", price: 1500, emoji: "🧴", image: "/products/lavandina.jpg" }),
  p({ id: "jabon-polvo", name: "Jabón en polvo para ropa", nameZh: "洗衣粉", categoryId: "limpieza", unit: "3 kg", price: 9000, salePrice: 7900, emoji: "🧺", image: "/products/jabon-polvo.jpg" }),
  p({ id: "papel-higienico", name: "Papel higiénico x4", nameZh: "卫生纸", categoryId: "limpieza", unit: "4 rollos 30 m", price: 2800, emoji: "🧻", image: "/products/papel-higienico.jpg", featured: true }),
  p({ id: "esponjas", name: "Esponjas de cocina x3", nameZh: "海绵", categoryId: "limpieza", unit: "3 u.", price: 1600, emoji: "🧽", image: "/products/esponjas.jpg" }),

  p({ id: "shampoo", name: "Shampoo", nameZh: "洗发水", categoryId: "perfumeria", unit: "400 ml", price: 3500, emoji: "🧴", image: "/products/shampoo.jpg" }),
  p({ id: "pasta-dental", name: "Pasta dental", nameZh: "牙膏", categoryId: "perfumeria", unit: "90 g", price: 2200, emoji: "🦷", image: "/products/pasta-dental.jpg" }),
  p({ id: "jabon-tocador", name: "Jabón de tocador x3", nameZh: "香皂", categoryId: "perfumeria", unit: "3 u.", price: 2400, emoji: "🧼", image: "/products/jabon-tocador.jpg" }),
  p({ id: "desodorante", name: "Desodorante en aerosol", nameZh: "止汗喷雾", categoryId: "perfumeria", unit: "150 ml", price: 3300, emoji: "🧴", image: "/products/desodorante.jpg" }),

  p({ id: "alimento-perro", name: "Alimento para perros adultos", nameZh: "狗粮", categoryId: "mascotas", unit: "3 kg", price: 9500, emoji: "🐶", image: "/products/alimento-perro.jpg" }),
  p({ id: "alimento-gato", name: "Alimento para gatos", nameZh: "猫粮", categoryId: "mascotas", unit: "1,5 kg", price: 6800, emoji: "🐱", image: "/products/alimento-gato.jpg" }),

  // ---------- Asian specialty ----------

  // Arroz y fideos
  p({ id: "arroz-jazmin-5kg", name: "Arroz jazmín 5 kg", nameZh: "茉莉香米", categoryId: "arroz-fideos", unit: "Bolsa 5 kg", price: 14900, salePrice: 12900, emoji: "🍚", image: "/products/arroz-jazmin-5kg.jpg", featured: true, description: "Arroz de grano largo y aroma suave. El de todos los días para acompañar salteados y curry." }),
  p({ id: "arroz-glutinoso", name: "Arroz glutinoso", nameZh: "糯米", categoryId: "arroz-fideos", unit: "1 kg", price: 4200, emoji: "🍙", image: "/products/arroz-glutinoso.jpg", description: "Para zongzi, mochi y arroz pegajoso al vapor." }),
  p({ id: "fideos-arroz", name: "Fideos de arroz finos", nameZh: "米粉", categoryId: "arroz-fideos", unit: "400 g", price: 2650, emoji: "🍜", image: "/products/fideos-arroz.jpg", description: "Se hidratan en 5 minutos. Ideales para salteados y sopas." }),
  p({ id: "ramen-x5", name: "Ramen instantáneo x5", nameZh: "方便面", categoryId: "arroz-fideos", unit: "Pack 5 u.", price: 5400, salePrice: 4590, emoji: "🍜", image: "/products/ramen-x5.jpg", featured: true, description: "Sabor carne picante. Pack familiar de 5 unidades." }),
  p({ id: "udon-fresco", name: "Fideos udon frescos", nameZh: "乌冬面", categoryId: "arroz-fideos", unit: "200 g", price: 1980, emoji: "🍲", image: "/products/udon-fresco.jpg", description: "Fideos gruesos de trigo, listos en 2 minutos." }),
  p({ id: "harina-arroz", name: "Harina de arroz", nameZh: "粘米粉", categoryId: "arroz-fideos", unit: "500 g", price: 2300, emoji: "🌾", image: "/products/harina-arroz.jpg" }),

  // Salsas y condimentos
  p({ id: "soja-light", name: "Salsa de soja light", nameZh: "生抽", categoryId: "salsas", unit: "500 ml", price: 3100, emoji: "🫙", image: "/products/soja-light.jpg", featured: true, description: "Soja clara para condimentar y marinar. Más salada y menos oscura que la soja oscura." }),
  p({ id: "soja-oscura", name: "Salsa de soja oscura", nameZh: "老抽", categoryId: "salsas", unit: "500 ml", price: 3300, emoji: "🫙", image: "/products/soja-oscura.jpg", description: "Da color y un dulzor suave a carnes estofadas." }),
  p({ id: "salsa-ostras", name: "Salsa de ostras", nameZh: "蚝油", categoryId: "salsas", unit: "510 g", price: 4500, salePrice: 3900, emoji: "🦪", image: "/products/salsa-ostras.jpg", description: "Clásica para verduras salteadas y carne con brócoli." }),
  p({ id: "aceite-sesamo", name: "Aceite de sésamo", nameZh: "芝麻油", categoryId: "salsas", unit: "250 ml", price: 5800, emoji: "🫗", image: "/products/aceite-sesamo.jpg", description: "Tostado y muy aromático. Unas gotas al final de la cocción." }),
  p({ id: "vinagre-negro", name: "Vinagre negro", nameZh: "镇江香醋", categoryId: "salsas", unit: "550 ml", price: 3700, emoji: "🍶", image: "/products/vinagre-negro.jpg", description: "Vinagre de arroz añejado. Perfecto para mojar dumplings con jengibre." }),
  p({ id: "doubanjiang", name: "Pasta de habas picante", nameZh: "郫县豆瓣酱", categoryId: "salsas", unit: "500 g", price: 4900, emoji: "🌶️", image: "/products/doubanjiang.jpg", description: "La base del mapo tofu y de la cocina de Sichuan." }),
  p({ id: "chili-crisp", name: "Aceite de chile crocante", nameZh: "辣椒油", categoryId: "salsas", unit: "210 g", price: 5200, emoji: "🌶️", image: "/products/chili-crisp.jpg", featured: true, description: "Chile, ajo y maní crocantes en aceite. Va con todo." }),

  // Congelados
  p({ id: "dumplings-cerdo", name: "Dumplings de cerdo y repollo x20", nameZh: "猪肉白菜饺子", categoryId: "congelados", unit: "Bandeja 20 u.", price: 6900, salePrice: 5900, emoji: "🥟", image: "/products/dumplings-cerdo.jpg", featured: true, description: "Hechos a mano. Hervilos 6 minutos o dorálos a la plancha." }),
  p({ id: "gyozas-verdura", name: "Gyozas de verdura x20", nameZh: "素饺子", categoryId: "congelados", unit: "Bandeja 20 u.", price: 6500, emoji: "🥟", image: "/products/gyozas-verdura.jpg", description: "Relleno de repollo, hongos y verdeo. Aptas vegetarianos." }),
  p({ id: "bao-cerdo", name: "Bao de cerdo agridulce x6", nameZh: "叉烧包", categoryId: "congelados", unit: "6 u.", price: 7200, emoji: "🍘", image: "/products/bao-cerdo.jpg", description: "Pancitos al vapor rellenos de cerdo char siu. 10 minutos de vaporera." }),
  p({ id: "langostinos", name: "Langostinos pelados", nameZh: "虾仁", categoryId: "congelados", unit: "400 g", price: 11900, emoji: "🦐", image: "/products/langostinos.jpg" }),
  p({ id: "bolitas-pescado", name: "Bolitas de pescado", nameZh: "鱼丸", categoryId: "congelados", unit: "500 g", price: 5400, emoji: "🍢", image: "/products/bolitas-pescado.jpg", description: "Para hot pot y sopas de fideos." }),

  // Verduras
  p({ id: "bok-choy", name: "Bok choy", nameZh: "小白菜", categoryId: "verduras", unit: "500 g", price: 1900, emoji: "🥬", image: "/products/bok-choy.jpg", description: "Fresco del día. Salteado con ajo en 3 minutos." }),
  p({ id: "repollo-chino", name: "Repollo chino", nameZh: "大白菜", categoryId: "verduras", unit: "Por unidad", price: 2400, emoji: "🥬", image: "/products/repollo-chino.jpg" }),
  p({ id: "jengibre", name: "Jengibre fresco", nameZh: "生姜", categoryId: "verduras", unit: "250 g", price: 1600, emoji: "🫚", image: "/products/jengibre.jpg" }),
  p({ id: "shiitake", name: "Hongos shiitake", nameZh: "香菇", categoryId: "verduras", unit: "200 g", price: 3900, emoji: "🍄", image: "/products/shiitake.jpg", stock: false }),
  p({ id: "verdeo", name: "Cebolla de verdeo", nameZh: "葱", categoryId: "verduras", unit: "Atado", price: 900, emoji: "🧅", image: "/products/verdeo.jpg" }),

  // Tofu y frescos
  p({ id: "tofu-firme", name: "Tofu firme", nameZh: "老豆腐", categoryId: "tofu", unit: "400 g", price: 2200, emoji: "🧈", image: "/products/tofu-firme.jpg", featured: true, description: "Elaborado en Buenos Aires. Ideal para saltear o mapo tofu." }),
  p({ id: "leche-soja", name: "Leche de soja", nameZh: "豆浆", categoryId: "tofu", unit: "1 L", price: 2100, emoji: "🥛", image: "/products/leche-soja.jpg" }),
  p({ id: "kimchi", name: "Kimchi de repollo", nameZh: "泡菜", categoryId: "tofu", unit: "400 g", price: 4800, emoji: "🥗", image: "/products/kimchi.jpg" }),

  // Snacks y dulces
  p({ id: "galletas-arroz", name: "Galletitas de arroz", nameZh: "雪饼", categoryId: "snacks", unit: "150 g", price: 2400, emoji: "🍘", image: "/products/galletas-arroz.jpg" }),
  p({ id: "palitos-choco", name: "Palitos de chocolate", nameZh: "巧克力棒", categoryId: "snacks", unit: "40 g", price: 1500, emoji: "🍫", image: "/products/palitos-choco.jpg" }),
  p({ id: "algas", name: "Algas tostadas x10", nameZh: "海苔", categoryId: "snacks", unit: "Pack 10 u.", price: 3200, salePrice: 2700, emoji: "🍙", image: "/products/algas.jpg" }),
  p({ id: "caramelos-leche", name: "Caramelos de leche", nameZh: "奶糖", categoryId: "snacks", unit: "180 g", price: 2900, emoji: "🍬", image: "/products/caramelos-leche.jpg" }),
  p({ id: "mochi", name: "Mochi de poroto rojo x6", nameZh: "红豆麻薯", categoryId: "snacks", unit: "6 u.", price: 3600, emoji: "🍡", image: "/products/mochi.jpg", featured: true }),

  // Bebidas
  p({ id: "te-taro", name: "Té con leche de taro", nameZh: "芋头奶茶", categoryId: "bebidas", unit: "500 ml", price: 2300, emoji: "🧋", image: "/products/te-taro.jpg", featured: true }),
  p({ id: "jugo-lichi", name: "Jugo de lichi", nameZh: "荔枝汁", categoryId: "bebidas", unit: "1 L", price: 2800, salePrice: 2350, emoji: "🧃", image: "/products/jugo-lichi.jpg" }),
  p({ id: "te-jazmin", name: "Té verde jazmín", nameZh: "茉莉绿茶", categoryId: "bebidas", unit: "500 ml", price: 1800, emoji: "🍵", image: "/products/te-jazmin.jpg" }),
  p({ id: "bebida-coco", name: "Bebida de coco", nameZh: "椰汁", categoryId: "bebidas", unit: "330 ml", price: 1700, emoji: "🥥", image: "/products/bebida-coco.jpg" }),

  // Cocina y hogar
  p({ id: "palitos-bambu", name: "Palitos de bambú x10 pares", nameZh: "竹筷", categoryId: "hogar", unit: "10 pares", price: 2500, emoji: "🥢", image: "/products/palitos-bambu.jpg" }),
  p({ id: "wok", name: "Wok de acero al carbono 32 cm", nameZh: "炒锅", categoryId: "hogar", unit: "Unidad", price: 32900, salePrice: 27900, emoji: "🍳", image: "/products/wok.jpg", description: "Curalo una vez y te dura años. Apto cocina a gas." }),
  p({ id: "vaporera", name: "Vaporera de bambú 25 cm", nameZh: "竹蒸笼", categoryId: "hogar", unit: "2 pisos + tapa", price: 18900, emoji: "🧺", image: "/products/vaporera.jpg" }),
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
