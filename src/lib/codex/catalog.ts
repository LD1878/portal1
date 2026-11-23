import ley14 from "../../../data/norms/ley-14-2013.json" with { type: "json" };
import ley28 from "../../../data/norms/ley-28-2022.json" with { type: "json" };
import lo4000 from "../../../data/norms/lo-4-2000.json" with { type: "json" };
import rd1155 from "../../../data/norms/rd-1155-2024.json" with { type: "json" };
import ley31 from "../../../data/norms/ley-31-2022-iprem.json" with { type: "json" };
import rd126 from "../../../data/norms/rd-126-2026-smi.json" with { type: "json" };
import ley11 from "../../../data/norms/ley-11-2023.json" with { type: "json" };
import dnReqs from "../../../data/requirements/digital-nomad.json" with { type: "json" };
import nlvReqs from "../../../data/requirements/non-lucrative.json" with { type: "json" };
import dnFamReqs from "../../../data/requirements/family-digital-nomad.json" with { type: "json" };
import nlvFamReqs from "../../../data/requirements/family-non-lucrative.json" with { type: "json" };
import processPages from "../../../data/process-pages/pages.json" with { type: "json" };
import conflictsJson from "../../../data/conflicts/conflicts.json" with { type: "json" };
import indicesJson from "../../../data/indices/indices.json" with { type: "json" };
import packetsJson from "../../../data/checklists/packets.json" with { type: "json" };
import type {
  ConflictRecord,
  IndexValues,
  Norm,
  Packet,
  ProcessPage,
  Requirement,
  RouteKind,
  Track,
} from "./types";

export const norms: Norm[] = [
  ley14,
  ley28,
  lo4000,
  rd1155,
  ley31,
  rd126,
  ley11,
] as Norm[];

export const requirements: Requirement[] = [
  ...(dnReqs as Requirement[]),
  ...(nlvReqs as Requirement[]),
  ...(dnFamReqs as Requirement[]),
  ...(nlvFamReqs as Requirement[]),
];

export const pages: ProcessPage[] = processPages as ProcessPage[];
export const conflicts: ConflictRecord[] = conflictsJson as ConflictRecord[];
export const packets: Packet[] = packetsJson as Packet[];

export const indices = indicesJson as { iprem: IndexValues; smi: IndexValues };

export const normsByBoeId = Object.fromEntries(norms.map((n) => [n.boeId, n]));
export const normsById = Object.fromEntries(norms.map((n) => [n.id, n]));
export const pagesById = Object.fromEntries(pages.map((p) => [p.id, p]));
export const reqsById = Object.fromEntries(requirements.map((r) => [r.id, r]));
export const conflictsById = Object.fromEntries(conflicts.map((c) => [c.id, c]));

export function requirementsFor(opts: {
  track: Track;
  route?: RouteKind;
  actor?: Requirement["actor"];
}): Requirement[] {
  return requirements.filter((r) => {
    if (r.track !== opts.track) return false;
    if (opts.route && !r.routes.includes(opts.route)) return false;
    if (opts.actor && r.actor !== opts.actor) return false;
    return true;
  });
}

export function packetById(id: string): Packet | undefined {
  return packets.find((p) => p.id === id);
}

export const OFFICIAL_HOSTS = [
  "boe.es",
  "www.boe.es",
  "inclusion.gob.es",
  "www.inclusion.gob.es",
  "sede.inclusion.gob.es",
  "expinterweb.inclusion.gob.es",
  "one.gob.es",
  "www.one.gob.es",
  "exteriores.gob.es",
  "www.exteriores.gob.es",
  "sede.administracionespublicas.gob.es",
  "seg-social.es",
  "www.seg-social.es",
];
