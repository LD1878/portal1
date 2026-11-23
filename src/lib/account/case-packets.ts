import { packets, reqsById } from "@/lib/codex/catalog";
import type { Packet } from "@/lib/codex/types";
import type { CaseRow } from "./server";

export function packetsForCase(file: Pick<CaseRow, "track" | "route" | "includeFamily">): Packet[] {
  return packets.filter((p) => {
    if (p.track !== file.track) return false;
    if (p.actor === "family") return file.includeFamily;
    if (file.track === "digital-nomad") return p.route === file.route;
    return p.route === "consulate";
  });
}

export type ItemKind = "form" | "document";

export function itemKind(requirementId: string): ItemKind {
  if (
    /-form/.test(requirementId) ||
    requirementId.includes("forms") ||
    requirementId.includes("-fee") ||
    requirementId === "nlv-fam-how-attached"
  ) {
    return "form";
  }
  return "document";
}

export function programLabel(file: Pick<CaseRow, "track" | "route">) {
  if (file.track === "non-lucrative") return "Non-lucrative residence";
  return file.route === "uge-ce" ? "Digital nomad · UGE-CE" : "Digital nomad · consulate";
}

export function routeLabel(file: Pick<CaseRow, "track" | "route">) {
  if (file.track === "non-lucrative") return "From origin, at the consulate";
  return file.route === "uge-ce" ? "Already lawfully in Spain" : "From abroad, at the consulate";
}

export function itemNote(requirementId: string) {
  return reqsById[requirementId]?.packetItem ?? "";
}
