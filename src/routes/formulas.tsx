import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ConflictBanner } from "@/components/codex/conflict-banner";
import { CitationChip } from "@/components/codex/citation";
import { indices } from "@/lib/codex/catalog";
import { dnMonthly, formatEur, nlvMonthly, type SmiBasis } from "@/lib/codex/formulas";

export const Route = createFileRoute("/formulas")({ component: Page });

function Page() {
  const [family, setFamily] = useState(0);
  const nlv = nlvMonthly(family);
  const a = dnMonthly(family, "gazette-monthly-14");
  const b = dnMonthly(family, "annual-over-12");

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-oxblood">
        Money · formulas only
      </p>
      <h1 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-[2.6rem]">
        The statute is a percentage of an index.
      </h1>
      <p className="mt-4 text-base leading-relaxed text-ink-soft">
        This desk never treats this year’s euro figure as the visa article. Change the
        index in the BOE, and the illustration moves. The formula does not.
      </p>

      <label className="mt-8 block">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
          Family members in the file, besides the holder
        </span>
        <input
          type="number"
          min={0}
          max={12}
          value={family}
          onChange={(e) => setFamily(Math.max(0, Number(e.target.value) || 0))}
          className="mt-2 h-11 w-full rounded-md border border-rule bg-paper-elev px-3 font-mono text-lg tabular-nums text-ink"
        />
      </label>

      <section className="mt-10 rounded-lg bg-paper-elev p-6 hairline">
        <p className="font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
          Non-lucrative · RD 1155/2024 art. 62
        </p>
        <h2 className="gold-rule mt-2 font-display text-2xl">400% IPREM + 100% per family member</h2>
        <p className="mt-2 font-mono text-sm text-ink-soft">{nlv.formula}</p>
        <dl className="mt-5 grid grid-cols-2 gap-4">
          <Figure label="Index (monthly IPREM)" value={formatEur(indices.iprem.values.monthly)} />
          <Figure label="Units this household" value={`${nlv.totalUnits} × IPREM`} />
          <Figure
            label="Illustration, monthly"
            value={formatEur(nlv.illustrativeMonthly)}
          />
          <Figure
            label="Illustration, × 12 months"
            value={formatEur(nlv.illustrativeAnnual)}
          />
        </dl>
        <p className="mt-4 text-sm leading-relaxed text-muted">{indices.iprem.disclaimer}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <CitationChip citation={{ boeId: "BOE-A-2024-24099", article: "62.1–2" }} />
          <CitationChip
            citation={{ boeId: "BOE-A-2022-22128", article: "DA 90ª" }}
          />
        </div>
      </section>

      <section className="mt-6 rounded-lg bg-paper-elev p-6 hairline">
        <p className="font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
          International telework · joint instruction on art. 62.3.f
        </p>
        <h2 className="gold-rule mt-2 font-display text-2xl">200% SMI + 75% / 25% family</h2>
        <p className="mt-2 font-mono text-sm text-ink-soft">{a.formula}</p>
        <div className="mt-5">
          <ConflictBanner conflictId="smi-monthly-conversion" />
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <SmiCard basis="gazette-monthly-14" family={family} row={a} />
          <SmiCard basis="annual-over-12" family={family} row={b} />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted">{indices.smi.disclaimer}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <CitationChip citation={{ boeId: "BOE-A-2013-10074", article: "62.3.f" }} />
          <CitationChip citation={{ boeId: "BOE-A-2026-3815", article: "1 and 3" }} />
          <CitationChip citation={{ processPageId: "instruccion-conjunta-teletrabajo" }} />
        </div>
      </section>
    </main>
  );
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-display text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">{label}</dt>
      <dd className="mt-1 font-display text-2xl tabular-nums text-oxblood">{value}</dd>
    </div>
  );
}

function SmiCard({
  row,
}: {
  basis: SmiBasis;
  family: number;
  row: ReturnType<typeof dnMonthly>;
}) {
  return (
    <div className="rounded-lg bg-paper-inset p-4">
      <p className="text-xs font-medium text-ink-soft">{row.basisLabel}</p>
      <p className="mt-2 font-display text-2xl tabular-nums">
        {formatEur(row.illustrativeMonthly)}
        <span className="ml-1 font-sans text-sm font-normal text-muted">/ month</span>
      </p>
      <p className="mt-2 font-mono text-[11px] text-faint">
        SMI used {formatEur(row.smiUsed)} · {row.totalUnits} × SMI
      </p>
    </div>
  );
}
