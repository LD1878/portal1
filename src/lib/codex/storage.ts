const KEY = "jurospain-codex-checks-v1";
const DECIDE_KEY = "jurospain-codex-decide-v1";

function readMap(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Record<string, boolean>;
  } catch {
    return {};
  }
}

export function isChecked(packetId: string, requirementId: string): boolean {
  return Boolean(readMap()[`${packetId}:${requirementId}`]);
}

export function setChecked(
  packetId: string,
  requirementId: string,
  value: boolean,
): Record<string, boolean> {
  const next = { ...readMap(), [`${packetId}:${requirementId}`]: value };
  window.localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function packetProgress(
  packetId: string,
  requirementIds: string[],
): { done: number; total: number } {
  const map = readMap();
  const done = requirementIds.filter((id) => map[`${packetId}:${id}`]).length;
  return { done, total: requirementIds.length };
}

export interface DecisionState {
  unionCitizen: "yes" | "no" | null;
  activity: "remote" | "means" | "other" | null;
  location: "abroad" | "spain" | null;
  family: "solo" | "family" | null;
}

export const emptyDecision = (): DecisionState => ({
  unionCitizen: null,
  activity: null,
  location: null,
  family: null,
});

export function loadDecision(): DecisionState {
  if (typeof window === "undefined") return emptyDecision();
  try {
    const raw = window.localStorage.getItem(DECIDE_KEY);
    if (!raw) return emptyDecision();
    return { ...emptyDecision(), ...(JSON.parse(raw) as Partial<DecisionState>) };
  } catch {
    return emptyDecision();
  }
}

export function saveDecision(state: DecisionState) {
  window.localStorage.setItem(DECIDE_KEY, JSON.stringify(state));
}
