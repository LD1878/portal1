import type { Citation } from "@/lib/codex/types";
import { normsByBoeId, pagesById } from "@/lib/codex/catalog";
import { cn } from "@/lib/utils";

export function CitationChip({
  citation,
  className,
}: {
  citation: Citation;
  className?: string;
}) {
  if (citation.boeId) {
    const norm = normsByBoeId[citation.boeId];
    const href = norm?.urlHtml ?? `https://www.boe.es/buscar/doc.php?id=${citation.boeId}`;
    const label = citation.article
      ? `${citation.boeId} · art. ${citation.article}`
      : citation.boeId;
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={cn(
          "inline-flex items-center rounded-sm border border-oxblood/70 bg-paper-elev px-2 py-1 font-mono text-[11px] leading-none text-oxblood hover:bg-oxblood-soft",
          className,
        )}
      >
        {label}
      </a>
    );
  }
  if (citation.processPageId) {
    const page = pagesById[citation.processPageId];
    if (!page) return null;
    return (
      <a
        href={page.url}
        target="_blank"
        rel="noreferrer"
        className={cn(
          "inline-flex items-center rounded-sm border border-rule bg-paper-elev px-2 py-1 font-mono text-[11px] leading-none text-ink-soft hover:border-oxblood hover:text-oxblood",
          className,
        )}
      >
        {page.owner.split("—")[0]?.trim() ?? page.id}
      </a>
    );
  }
  return null;
}

export function CitationRow({ citations }: { citations: Citation[] }) {
  if (!citations.length) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {citations.map((c, i) => (
        <CitationChip
          key={`${c.boeId ?? c.processPageId ?? "c"}-${c.article ?? i}`}
          citation={c}
        />
      ))}
    </div>
  );
}
