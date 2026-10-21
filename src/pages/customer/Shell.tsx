import type { ReactNode } from "react";
import { Icon, type IconName } from "../../components/icons";
import { Link, useRouter } from "../../lib/router";
import { useStore } from "../../lib/store";

const tabs: { to: string; label: string; icon: IconName; active: (p: string) => boolean }[] = [
  { to: "/", label: "Inicio", icon: "home", active: (p) => p === "/" },
  { to: "/categorias", label: "Categorías", icon: "grid", active: (p) => p.startsWith("/categorias") || p.startsWith("/c/") },
  { to: "/buscar", label: "Buscar", icon: "search", active: (p) => p.startsWith("/buscar") },
  { to: "/pedidos", label: "Pedidos", icon: "receipt", active: (p) => p.startsWith("/pedido") },
  { to: "/carrito", label: "Carrito", icon: "cart", active: (p) => p.startsWith("/carrito") || p.startsWith("/checkout") },
];

/** Phone-width column. On a computer it sits centered with the brand color around it. */
export function Shell({ children, tabBar = true }: { children: ReactNode; tabBar?: boolean }) {
  return (
    <div className="min-h-dvh bg-surface">
      <div className="relative mx-auto min-h-dvh max-w-[480px] bg-bg sm:shadow-card">
        <div className={tabBar ? "pb-[calc(76px+env(safe-area-inset-bottom,0px))]" : ""}>{children}</div>
        {tabBar && <TabBar />}
      </div>
    </div>
  );
}

function TabBar() {
  const { path } = useRouter();
  const { totals } = useStore();
  return (
    <nav aria-label="Secciones" className="pb-safe fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[480px] border-t border-line bg-bg/95 backdrop-blur">
      <ul className="gutter grid h-16 grid-cols-5">
        {tabs.map((t) => {
          const on = t.active(path);
          return (
            <li key={t.to}>
              <Link
                to={t.to}
                className={`flex h-full flex-col items-center justify-center gap-0.5 text-[11px] font-semibold ${on ? "text-red" : "text-muted"}`}
              >
                <span className="relative">
                  <Icon name={t.icon} size={24} strokeWidth={on ? 2.4 : 1.9} />
                  {t.icon === "cart" && totals.count > 0 && (
                    <span key={totals.count} className="pop num absolute -top-1.5 -right-2.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-red px-1 text-[11px] font-bold text-on-red ring-2 ring-bg">
                      {totals.count}
                    </span>
                  )}
                </span>
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
