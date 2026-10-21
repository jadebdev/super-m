import { PageHeader, ProductImage } from "../../components/ui";
import { photoCredits } from "../../data/photoCredits";
import { tintOf, useStore } from "../../lib/store";

// Attribution for the catalog photos (required by their Creative Commons licenses).
export function Credits() {
  const { products } = useStore();
  const credited = products.filter((p) => photoCredits[p.id] && p.image === `/products/${p.id}.jpg`);
  return (
    <>
      <PageHeader title="Créditos de fotos" subtitle="Imágenes de Wikimedia Commons" />
      <div className="gutter flex flex-col gap-4 py-5">
        <p className="text-sm text-muted">
          Las fotos de referencia del catálogo son de Wikimedia Commons y se usan bajo las licencias indicadas. Tocá una para ver el original.
        </p>
        <ul className="flex flex-col divide-y divide-line">
          {credited.map((p) => {
            const c = photoCredits[p.id];
            return (
              <li key={p.id}>
                <a href={c.source} target="_blank" rel="noreferrer" className="flex items-center gap-3 py-3">
                  <ProductImage emoji={p.emoji} image={p.image} tint={tintOf(p.categoryId)} size="sm" className="h-12 w-12 shrink-0 rounded-xl" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{p.name}</span>
                    <span className="block truncate text-xs text-muted">
                      {c.author} · {c.license}
                    </span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
