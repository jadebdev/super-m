import { ars } from "../lib/format";
import { useStore } from "../lib/store";
import { Icon } from "./icons";
import { Sheet } from "./ui";

export function ZonePicker({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { zones, zoneId, setZone, settings } = useStore();
  const groups: ("CABA" | "GBA")[] = ["CABA", "GBA"];
  return (
    <Sheet open={open} onClose={onClose} title="¿Dónde recibís tu pedido?">
      <div className="flex flex-col gap-5">
        <p className="text-sm text-muted">
          Envío gratis en compras desde <b className="num text-fg">{ars(settings.freeDeliveryThreshold)}</b>.
        </p>
        {groups.map((g) => (
          <div key={g} className="flex flex-col gap-2">
            <h3 className="text-xs font-bold tracking-wider text-muted uppercase">{g === "CABA" ? "Capital Federal" : "Gran Buenos Aires"}</h3>
            {zones
              .filter((z) => z.area === g)
              .map((z) => {
                const selected = z.id === zoneId;
                return (
                  <button
                    key={z.id}
                    type="button"
                    disabled={!z.active}
                    onClick={() => {
                      setZone(z.id);
                      onClose();
                    }}
                    className={`flex items-center gap-3 rounded-2xl border-2 p-3.5 text-left transition-colors disabled:opacity-50 ${
                      selected ? "border-red bg-red-soft" : "border-line bg-card"
                    }`}
                  >
                    <Icon name="pin" className={selected ? "text-red" : "text-muted"} />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold">{z.name}</div>
                      <div className="text-sm text-muted">{z.neighborhoods}</div>
                    </div>
                    <div className="shrink-0 text-right text-sm">
                      {z.active ? (
                        <>
                          <div className="num font-bold">{ars(z.fee)}</div>
                          <div className="num text-xs text-muted">mín. {ars(z.minOrder)}</div>
                        </>
                      ) : (
                        <span className="text-xs font-semibold text-muted">Próximamente</span>
                      )}
                    </div>
                  </button>
                );
              })}
          </div>
        ))}
      </div>
    </Sheet>
  );
}
