import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  emptyDecision,
  loadDecision,
  saveDecision,
  type DecisionState,
} from "@/lib/codex/storage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Choice({
  selected,
  children,
  onClick,
}: {
  selected: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-12 rounded-md px-4 py-3 text-left text-[15px] leading-snug transition-[background-color,box-shadow,color,border-color,transform] duration-200",
        selected
          ? "border-2 border-oxblood bg-oxblood text-on-brand shadow-[0_2px_5px_rgb(227_6_19_/_0.2)]"
          : "bg-paper-elev text-ink hairline hairline-hover",
      )}
    >
      {children}
    </button>
  );
}

export function DecisionTree() {
  const [state, setState] = useState<DecisionState>(() =>
    typeof window === "undefined" ? emptyDecision() : loadDecision(),
  );

  function patch(next: Partial<DecisionState>) {
    const merged = { ...state, ...next };
    setState(merged);
    if (typeof window !== "undefined") saveDecision(merged);
  }

  const result = resolve(state);

  return (
    <div className="space-y-8">
      <fieldset>
        <legend className="font-display text-xl">Are you an EU, EEA or Swiss national?</legend>
        <p className="mt-1 text-sm text-muted">
          Includes family members covered by Union free-movement rules. Ley 14/2013 art.
          61.2 takes those persons out of this section.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Choice
            selected={state.unionCitizen === "yes"}
            onClick={() => patch({ unionCitizen: "yes" })}
          >
            Yes — Union / equivalent free movement
          </Choice>
          <Choice
            selected={state.unionCitizen === "no"}
            onClick={() => patch({ unionCitizen: "no" })}
          >
            No — third-country national
          </Choice>
        </div>
      </fieldset>

      {state.unionCitizen === "no" ? (
        <fieldset>
          <legend className="font-display text-xl">What will you do in Spain?</legend>
          <p className="mt-1 text-sm text-muted">
            This codex documents two residencies only. Other permits are out of scope.
          </p>
          <div className="mt-3 grid gap-2">
            <Choice
              selected={state.activity === "remote"}
              onClick={() => patch({ activity: "remote" })}
            >
              Remote labour or professional activity for companies outside Spain
            </Choice>
            <Choice
              selected={state.activity === "means"}
              onClick={() => patch({ activity: "means" })}
            >
              Live on my own means, without labour or professional activity
            </Choice>
            <Choice
              selected={state.activity === "other"}
              onClick={() => patch({ activity: "other" })}
            >
              Something else (entrepreneur, highly qualified, student, arraigo…)
            </Choice>
          </div>
        </fieldset>
      ) : null}

      {state.unionCitizen === "no" &&
      (state.activity === "remote" || state.activity === "means") ? (
        <fieldset>
          <legend className="font-display text-xl">Where are you now?</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <Choice
              selected={state.location === "abroad"}
              onClick={() => patch({ location: "abroad" })}
            >
              Outside Spain — not a Spanish resident
            </Choice>
            <Choice
              selected={state.location === "spain"}
              onClick={() => patch({ location: "spain" })}
            >
              Already lawfully in Spain
            </Choice>
          </div>
        </fieldset>
      ) : null}

      {state.unionCitizen === "no" &&
      (state.activity === "remote" || state.activity === "means") &&
      state.location ? (
        <fieldset>
          <legend className="font-display text-xl">Family members in the same file?</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <Choice
              selected={state.family === "solo"}
              onClick={() => patch({ family: "solo" })}
            >
              Principal only
            </Choice>
            <Choice
              selected={state.family === "family"}
              onClick={() => patch({ family: "family" })}
            >
              Spouse, partner or children accompanying
            </Choice>
          </div>
        </fieldset>
      ) : null}

      {result ? (
        <aside className="rounded-lg bg-oxblood p-6 text-on-brand">
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-on-brand/70">
            Route
          </p>
          <h3 className="mt-2 font-display text-2xl leading-snug text-on-brand">{result.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-on-brand/90">{result.body}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {result.links.map((l) => (
              <Button
                key={l.to}
                asChild
                variant="quiet"
                className="border-on-brand/20 bg-white text-oxblood hover:bg-paper"
              >
                <Link to={l.to}>{l.label}</Link>
              </Button>
            ))}
          </div>
        </aside>
      ) : null}
    </div>
  );
}

function resolve(state: DecisionState): {
  title: string;
  body: string;
  links: { to: string; label: string }[];
} | null {
  if (state.unionCitizen === "yes") {
    return {
      title: "This codex does not apply",
      body: "EU, EEA and Swiss nationals, and family members under Union law, are outside Ley 14/2013 section 2 and outside the ordinary non-lucrative sheet. Use the Union regime, not these two residencies.",
      links: [{ to: "/sources", label: "See the governing sources" }],
    };
  }
  if (state.activity === "other") {
    return {
      title: "Out of scope",
      body: "Entrepreneur, highly qualified, golden visa (repealed), student, arraigo and other permits are not documented here. Do not stretch this manual onto a different authorisation.",
      links: [{ to: "/", label: "Back to the two residencies" }],
    };
  }
  if (state.unionCitizen !== "no" || !state.activity || !state.location || !state.family) {
    return null;
  }

  if (state.activity === "remote" && state.location === "abroad") {
    return {
      title: "International telework visa at the consulate",
      body: "Art. 74 quater: non-residents apply for the visa, maximum one year. The official FAQ: you cannot file the UGE-CE residence from abroad. Check the competent consulate’s current page for local filing mechanics.",
      links: [
        { to: "/digital-nomad/consulate", label: "Consular visa journey" },
        { to: "/digital-nomad/checklist?packet=dn-consulate", label: "Open the packet" },
        ...(state.family === "family"
          ? [{ to: "/digital-nomad/family", label: "Family chapter" }]
          : []),
      ],
    };
  }
  if (state.activity === "remote" && state.location === "spain") {
    return {
      title: "UGE-CE residence, already lawfully in Spain",
      body: "Art. 74 quinquies + art. 76: electronic filing with UGE-CE via Plataforma ONE / sede. Maximum three years. Twenty working days; silence is positive. If you currently hold the one-year visa, file the residence in the sixty days before it expires.",
      links: [
        { to: "/digital-nomad/uge", label: "UGE-CE journey" },
        { to: "/digital-nomad/checklist?packet=dn-uge", label: "Open the packet" },
        ...(state.family === "family"
          ? [{ to: "/digital-nomad/family", label: "Family chapter" }]
          : []),
      ],
    };
  }
  if (state.activity === "means" && state.location === "abroad") {
    return {
      title: "Non-lucrative visa at the consulate",
      body: "RD 1155/2024 arts. 61–63: apply for the residence visa at the competent consulate. The visa application is the authorisation application. Initial grant is one year. There is no UGE-CE initial path on this residence.",
      links: [
        { to: "/non-lucrative/consulate", label: "Consular visa journey" },
        { to: "/non-lucrative/checklist?packet=nlv-consulate", label: "Open the packet" },
        ...(state.family === "family"
          ? [{ to: "/non-lucrative/family", label: "Family chapter" }]
          : []),
      ],
    };
  }
  return {
    title: "Non-lucrative initial is not an in-Spain UGE-CE filing",
    body: "The official ministry sheet states the initial non-lucrative authorisation is requested from the country of origin at the consulate. Being lawfully in Spain does not open a UGE-CE initial path for this residence. If you already hold a non-lucrative authorisation, renewal is with extranjería (art. 64).",
    links: [
      { to: "/non-lucrative", label: "Read the non-lucrative architecture" },
      { to: "/non-lucrative/consulate", label: "Initial consular route" },
    ],
  };
}
