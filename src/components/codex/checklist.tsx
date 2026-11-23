import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import type { Packet } from "@/lib/codex/types";
import { reqsById } from "@/lib/codex/catalog";
import { isChecked, packetProgress, setChecked } from "@/lib/codex/storage";
import { CitationRow } from "./citation";
import { ConflictBanner } from "./conflict-banner";
import { cn } from "@/lib/utils";

export function PacketChecklist({ packet }: { packet: Packet }) {
  const ids = useMemo(() => packet.items.map((i) => i.requirementId), [packet]);
  const [, setTick] = useState(0);

  useEffect(() => {
    setTick((n) => n + 1);
  }, [packet.id]);

  const progress = packetProgress(packet.id, ids);

  return (
    <section className="rounded-lg bg-paper-elev p-5 hairline sm:p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
            Master checklist
          </p>
          <h2 className="gold-rule mt-1 font-display text-2xl leading-tight">{packet.title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{packet.subtitle}</p>
        </div>
        <p className="font-display text-sm font-semibold tabular-nums text-oxblood">
          {progress.done}/{progress.total}
        </p>
      </header>
      <div
        className="mt-4 h-1 overflow-hidden rounded-full bg-paper-inset"
        aria-hidden="true"
      >
        <div
          className="h-full bg-oxblood transition-[width] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%`,
          }}
        />
      </div>
      <ol className="mt-6 divide-y divide-rule/70">
        {packet.items.map((item) => {
          const req = reqsById[item.requirementId];
          const checked = isChecked(packet.id, item.requirementId);
          return (
            <li key={item.requirementId} className="py-4 first:pt-0 last:pb-0">
              <label className="flex cursor-pointer items-start gap-3">
                <span className="relative mt-0.5">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={checked}
                    onChange={(e) => {
                      setChecked(packet.id, item.requirementId, e.target.checked);
                      setTick((n) => n + 1);
                    }}
                  />
                  <span
                    className={cn(
                      "relative flex size-6 items-center justify-center rounded-sm border after:absolute after:top-1/2 after:left-1/2 after:size-11 after:-translate-1/2",
                      checked
                        ? "border-oxblood bg-oxblood text-on-brand"
                        : "border-rule-strong bg-paper",
                    )}
                  >
                    {checked ? <Check className="size-3.5" strokeWidth={2.5} /> : null}
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-2">
                    <span className="font-mono text-[11px] tabular-nums text-faint">
                      {String(item.order).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "text-[15px] leading-snug",
                        checked ? "text-muted line-through" : "text-ink",
                      )}
                    >
                      {item.label}
                    </span>
                  </span>
                  {req?.packetItem ? (
                    <span className="mt-1 block text-sm leading-relaxed text-muted">
                      {req.packetItem}
                    </span>
                  ) : null}
                  {req?.legalFormula ? (
                    <span className="mt-1 block font-mono text-xs text-ink-soft">
                      {req.legalFormula}
                    </span>
                  ) : null}
                  {req?.status === "conflict" && req.conflictId ? (
                    <span className="mt-3 block">
                      <ConflictBanner conflictId={req.conflictId} />
                    </span>
                  ) : null}
                  {req ? <CitationRow citations={req.citations} /> : null}
                </span>
              </label>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
