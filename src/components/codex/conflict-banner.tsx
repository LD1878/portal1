import { AlertTriangle } from "lucide-react";
import { conflictsById } from "@/lib/codex/catalog";
import { CitationChip } from "./citation";

export function ConflictBanner({ conflictId }: { conflictId: string }) {
  const conflict = conflictsById[conflictId];
  if (!conflict) return null;
  return (
    <aside
      role="status"
      className="rounded-lg border border-warn-rule bg-warn-paper p-4 text-warn-ink shadow-[0_0_0_1px_rgb(196_163_90_/_0.25)]"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <div className="min-w-0">
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.16em]">
            Not settled
          </p>
          <h3 className="mt-1 font-display text-lg leading-snug text-ink">
            {conflict.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{conflict.summary}</p>
          <ul className="mt-3 space-y-2">
            {conflict.sources.map((s) => (
              <li key={s.label} className="text-sm leading-relaxed">
                <span className="font-medium text-ink">{s.label}.</span>{" "}
                <span className="text-ink-soft">{s.quote}</span>
                <span className="mt-1 flex flex-wrap gap-1.5">
                  {s.boeId ? <CitationChip citation={{ boeId: s.boeId }} /> : null}
                  {s.processPageId ? (
                    <CitationChip citation={{ processPageId: s.processPageId }} />
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
