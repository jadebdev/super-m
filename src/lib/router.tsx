import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

// Tiny hash router: #/carrito, #/p/soja-light, #/admin/productos …
// Hash routes work on any static host (Vercel, Netlify) without server rewrites.

type Ctx = { path: string; navigate: (to: string) => void; back: () => void };
const RouterContext = createContext<Ctx>({ path: "/", navigate: () => {}, back: () => {} });

const readHash = () => {
  try {
    const h = window.location.hash.replace(/^#/, "");
    return h.startsWith("/") ? h : "/";
  } catch {
    return "/";
  }
};

export function RouterProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<string[]>(() => [readHash()]);
  const path = stack[stack.length - 1];

  useEffect(() => {
    const onHash = () => {
      const h = readHash();
      setStack((s) => (s[s.length - 1] === h ? s : s.length > 1 && s[s.length - 2] === h ? s.slice(0, -1) : [...s, h]));
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = useCallback((to: string) => {
    setStack((s) => [...s, to]);
    try {
      window.location.hash = to;
    } catch {
      /* the page keeps working without the address bar */
    }
    window.scrollTo({ top: 0 });
  }, []);

  const back = useCallback(() => {
    setStack((s) => {
      const next = s.length > 1 ? s.slice(0, -1) : ["/"];
      try {
        window.history.replaceState(null, "", "#" + next[next.length - 1]);
      } catch {
        /* ignore */
      }
      return next;
    });
    window.scrollTo({ top: 0 });
  }, []);

  return <RouterContext.Provider value={{ path, navigate, back }}>{children}</RouterContext.Provider>;
}

export const useRouter = () => useContext(RouterContext);

/** match("/p/:id", "/p/tofu") → { id: "tofu" } */
export function match(pattern: string, path: string): Record<string, string> | null {
  const a = pattern.split("/").filter(Boolean);
  const b = path.split("?")[0].split("/").filter(Boolean);
  if (a.length !== b.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < a.length; i++) {
    if (a[i].startsWith(":")) params[a[i].slice(1)] = decodeURIComponent(b[i]);
    else if (a[i] !== b[i]) return null;
  }
  return params;
}

export function Link({ to, className, children, ariaLabel }: { to: string; className?: string; children: ReactNode; ariaLabel?: string }) {
  const { navigate } = useRouter();
  return (
    <a
      href={"#" + to}
      aria-label={ariaLabel}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}
