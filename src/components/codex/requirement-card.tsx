import type { Requirement } from "@/lib/codex/types";
import { ConflictBanner } from "./conflict-banner";
import { CitationRow } from "./citation";

export function RequirementCard({ req, index }: { req: Requirement; index?: number }) {
  return (
    <article
      id={req.id}
      className="scroll-mt-28 rounded-lg bg-paper-elev p-5 hairline hairline-hover sm:p-6"
    >
      <header className="flex items-baseline justify-between gap-4">
        <p className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
          {req.topic.replace("-", " ")}
          {typeof index === "number" ? ` · ${String(index).padStart(2, "0")}` : null}
        </p>
        {req.status === "conflict" ? (
          <span className="font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-warn-ink">
            Conflict
          </span>
        ) : (
          <span className="font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            In force
          </span>
        )}
      </header>
      <h3 className="mt-2 font-display text-xl leading-snug">{req.title}</h3>
      {req.legalFormula ? (
        <p className="mt-3 rounded-md bg-paper-inset px-3 py-2 font-mono text-xs leading-relaxed text-ink-soft">
          Formula: {req.legalFormula}
        </p>
      ) : null}
      <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{req.rule}</p>
      {req.packetItem ? (
        <p className="mt-3 border-l-[3px] border-gold pl-3 text-sm leading-relaxed text-ink">
          <span className="font-medium">In the file. </span>
          {req.packetItem}
        </p>
      ) : null}
      {req.status === "conflict" && req.conflictId ? (
        <div className="mt-4">
          <ConflictBanner conflictId={req.conflictId} />
        </div>
      ) : null}
      <CitationRow citations={req.citations} />
    </article>
  );
}
