import { createFileRoute } from "@tanstack/react-router";
import { DecisionTree } from "@/components/codex/decision-tree";

export const Route = createFileRoute("/decide")({ component: DecidePage });

function DecidePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-oxblood">
        Layer 1 · Decision tree
      </p>
      <h1 className="mt-3 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
        Which of the two visas, from where, with whom.
      </h1>
      <p className="mt-4 text-base leading-relaxed text-ink-soft">
        Answer in file order. The tree only routes into international telework and
        non-lucrative residence. Everything else is out of this codex.
      </p>
      <div className="mt-10">
        <DecisionTree />
      </div>
    </main>
  );
}
