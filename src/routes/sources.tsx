import { createFileRoute } from "@tanstack/react-router";
import { conflicts, norms, pages } from "@/lib/codex/catalog";
import { LEGAL_DISCLAIMER } from "@/lib/codex/types";
import { ConflictBanner } from "@/components/codex/conflict-banner";

export const Route = createFileRoute("/sources")({ component: Page });

function Page() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-oxblood">
        Source of truth
      </p>
      <h1 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-[2.6rem]">
        Every BOE ID and official URL this codex is allowed to speak from.
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft">
        {LEGAL_DISCLAIMER} Blogs, Facebook groups, lawyer marketing pages and outdated
        consular PDFs that contradict current BOE are not authority here.
      </p>

      <section className="mt-12">
        <h2 className="gold-rule font-display text-2xl">Norms</h2>
        <ul className="mt-4 divide-y divide-rule">
          {norms.map((n) => (
            <li key={n.id} className="py-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-oxblood">
                {n.boeId}
              </p>
              <h3 className="mt-1 font-display text-xl leading-snug text-ink">{n.title}</h3>
              <p className="mt-1 text-sm text-muted">
                {n.department} · published {n.published} · in force from {n.inForceFrom}
                {n.inForceTo ? ` to ${n.inForceTo}` : ""} · last seen {n.lastSeen}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {n.lastConsolidationNote}
              </p>
              <p className="mt-2 font-mono text-[11px] text-faint">
                hash {n.lastSeenHash}
              </p>
              <p className="mt-3 flex flex-wrap gap-3 text-sm">
                <a href={n.urlHtml} target="_blank" rel="noreferrer">
                  HTML
                </a>
                <a href={n.urlPdf} target="_blank" rel="noreferrer">
                  PDF
                </a>
                <a href={n.urlGazette} target="_blank" rel="noreferrer">
                  Gazette
                </a>
                <a href={n.eli} target="_blank" rel="noreferrer">
                  ELI
                </a>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="gold-rule font-display text-2xl">Official process pages</h2>
        <ul className="mt-4 divide-y divide-rule">
          {pages.map((p) => (
            <li key={p.id} className="py-5">
              <p className="font-mono text-[11px] text-faint">{p.id}</p>
              <h3 className="mt-1 font-sans text-base font-medium">{p.owner}</h3>
              <p className="mt-1 break-all text-sm">
                <a href={p.url} target="_blank" rel="noreferrer">
                  {p.url}
                </a>
              </p>
              <p className="mt-2 text-sm text-muted">
                May supply: {p.allowedFields.join(", ")} · last seen {p.lastSeen}
              </p>
              <p className="mt-1 font-mono text-[11px] text-faint">
                hash {p.lastSeenHash} · {p.status}
              </p>
              {p.note ? <p className="mt-2 text-sm text-ink-soft">{p.note}</p> : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 space-y-4">
        <h2 className="gold-rule font-display text-2xl">Open conflicts</h2>
        {conflicts.map((c) => (
          <ConflictBanner key={c.id} conflictId={c.id} />
        ))}
      </section>
    </main>
  );
}
