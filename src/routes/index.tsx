import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { conflicts, indices, norms, pages } from "@/lib/codex/catalog";
import { LEGAL_DISCLAIMER } from "@/lib/codex/types";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main>
      <section className="mx-auto max-w-[1200px] px-4 pb-8 pt-12 sm:px-6 sm:pt-16">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-oxblood">
          JUROSpain · Docs as code
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[0.95] font-bold tracking-tight sm:text-6xl">
          Living Visa Codex
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
          The English operating manual for two Spanish residencies. International
          telework. Non-lucrative temporary residence. Built as legal architecture
          for assembling a file — not as commentary.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/decide">
              Open the decision tree
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/sources">Inspect the sources</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1200px] gap-4 px-4 sm:px-6 lg:grid-cols-2">
        <DossierCard
          kicker="Ley 14/2013 · arts. 74 bis–quinquies"
          title="International telework"
          body="Remote labour or professional activity for companies outside Spain. Consular visa if you are not resident; UGE-CE residence if you are already lawfully in Spain."
          to="/digital-nomad"
          meta="Visa ≤ 1 year · Residence ≤ 3 years"
        />
        <DossierCard
          kicker="RD 1155/2024 · arts. 61–64"
          title="Non-lucrative residence"
          body="Reside without labour or professional activity. Consular visa from origin, then TIE. Means are 400% IPREM, not a frozen euro figure."
          to="/non-lucrative"
          meta="Initial 1 year · Renewal 2 years"
        />
      </section>

      <section className="mx-auto mt-12 max-w-[1200px] px-4 sm:px-6">
        <div className="grid gap-4 rounded-lg bg-paper-elev p-6 hairline md:grid-cols-3">
          <Stat
            label="Watched BOE records"
            value={String(norms.length)}
            hint="Consolidated texts, gazette URLs, article lists"
          />
          <Stat
            label="Official process pages"
            value={String(pages.length)}
            hint="UGE-CE, Plataforma ONE, MAE, fee and form pages"
          />
          <Stat
            label="Open conflicts"
            value={String(conflicts.length)}
            hint="Sections that must not be presented as a single rule"
          />
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-[1200px] px-4 sm:px-6">
        <div className="rounded-lg border-l-[6px] border-gold bg-paper-elev p-6 hairline">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-oxblood">
            Money is a formula
          </p>
          <h2 className="gold-rule mt-2 font-display text-3xl">
            IPREM and SMI are indices, not the visa.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
            Non-lucrative: 400% IPREM (holder) + 100% IPREM per family member, monthly,
            times the authorised period. Telework: 200% SMI (holder) + 75% / 25% for
            family, as fixed by the joint instruction. Current index values (
            {indices.iprem.values.monthly.toFixed(0)} € IPREM monthly;{" "}
            {indices.smi.values.monthly14.toFixed(0)} € SMI gazette monthly) are
            illustrations. {LEGAL_DISCLAIMER}
          </p>
          <Button asChild variant="stamp" className="mt-5">
            <Link to="/formulas">Open the formula desk</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

function DossierCard({
  kicker,
  title,
  body,
  to,
  meta,
}: {
  kicker: string;
  title: string;
  body: string;
  to: string;
  meta: string;
}) {
  return (
    <Link
      to={to}
      className="group flex min-h-64 flex-col rounded-lg bg-paper-elev p-6 text-ink no-underline hairline hairline-hover"
    >
      <p className="font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
        {kicker}
      </p>
      <h2 className="mt-3 font-display text-3xl leading-tight">{title}</h2>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">{body}</p>
      <p className="mt-6 flex items-center justify-between font-display text-[11px] font-semibold uppercase tracking-[0.12em] text-oxblood">
        {meta}
        <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
      </p>
    </Link>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div>
      <p className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
        {label}
      </p>
      <p className="mt-2 font-display text-4xl tabular-nums text-oxblood">{value}</p>
      <p className="mt-1 text-sm text-muted">{hint}</p>
    </div>
  );
}
