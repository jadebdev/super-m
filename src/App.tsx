import { useEffect } from "react";
import { ToastProvider } from "./components/ui";
import { readPaymentReturn } from "./lib/payments";
import { RouterProvider, match, useRouter } from "./lib/router";
import { StoreProvider, useStore } from "./lib/store";
import { Admin } from "./pages/admin/Admin";
import { CategoryPage, Categories, SearchPage } from "./pages/customer/Browse";
import { Cart } from "./pages/customer/Cart";
import { Checkout } from "./pages/customer/Checkout";
import { Home } from "./pages/customer/Home";
import { Account, MyOrders, OrderPage } from "./pages/customer/Orders";
import { ProductPage } from "./pages/customer/ProductPage";
import { Shell } from "./pages/customer/Shell";

function Routes() {
  const { path, navigate } = useRouter();
  const { updateOrder } = useStore();

  // Customer coming back from Mercado Pago
  useEffect(() => {
    const ret = readPaymentReturn();
    if (!ret) return;
    if (ret.status === "ok") updateOrder(ret.orderId, { paid: true });
    navigate(`/pedido/${ret.orderId}`);
  }, [navigate, updateOrder]);

  if (path === "/admin") return <Admin section="pedidos" />;
  const admin = match("/admin/:section", path);
  if (admin) return <Admin section={admin.section} />;

  let page = <Home />;
  let tabBar = true;
  let m: Record<string, string> | null;
  if (path === "/categorias") page = <Categories />;
  else if ((m = match("/c/:id", path))) page = <CategoryPage key={m.id} id={m.id} />;
  else if (path === "/buscar") page = <SearchPage />;
  else if ((m = match("/p/:id", path))) {
    page = <ProductPage key={m.id} id={m.id} />;
    tabBar = false;
  } else if (path === "/carrito") page = <Cart />;
  else if (path === "/checkout") {
    page = <Checkout />;
    tabBar = false;
  } else if (path === "/pedidos") page = <MyOrders />;
  else if ((m = match("/pedido/:id", path))) page = <OrderPage key={m.id} id={m.id} />;
  else if (path === "/cuenta") page = <Account />;

  return <Shell tabBar={tabBar}>{page}</Shell>;
}

export default function App() {
  return (
    <StoreProvider>
      <RouterProvider>
        <ToastProvider>
          <Routes />
        </ToastProvider>
      </RouterProvider>
    </StoreProvider>
  );
}
