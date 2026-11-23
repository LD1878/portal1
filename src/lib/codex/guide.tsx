import { RequirementCard } from "@/components/codex/requirement-card";
import { StageBlock } from "@/components/codex/guide-layout";
import { JOURNEY_STAGES, type JourneyStage, type Requirement } from "./types";

export function RequirementsByJourney({ reqs }: { reqs: Requirement[] }) {
  const used = new Set(reqs.map((r) => r.journey));
  return (
    <>
      {JOURNEY_STAGES.filter((s) => used.has(s.id)).map((stage) => (
        <StageBlock key={stage.id} id={stage.id} title={stage.label}>
          {reqs
            .filter((r) => r.journey === stage.id)
            .map((r, i) => (
              <RequirementCard key={r.id} req={r} index={i + 1} />
            ))}
        </StageBlock>
      ))}
    </>
  );
}

export function stagesPresent(reqs: Requirement[]): JourneyStage[] {
  const used = new Set(reqs.map((r) => r.journey));
  return JOURNEY_STAGES.filter((s) => used.has(s.id)).map((s) => s.id);
}
