export type Track = "digital-nomad" | "non-lucrative";
export type RouteKind = "consulate" | "uge-ce";
export type Actor = "principal" | "family";
export type RecordStatus = "in-force" | "conflict" | "repealed";

export type Topic =
  | "eligibility"
  | "funds-formula"
  | "insurance"
  | "criminal-record"
  | "contract-clients"
  | "qualifications"
  | "ss"
  | "fees"
  | "forms"
  | "tie"
  | "renewal"
  | "prohibitions"
  | "family"
  | "apostille"
  | "where-to-file"
  | "pending"
  | "duration";

export type JourneyStage =
  | "eligibility"
  | "route"
  | "documents"
  | "apostille"
  | "forms"
  | "pending"
  | "approval"
  | "renewal";

export interface Citation {
  boeId?: string;
  article?: string;
  processPageId?: string;
}

export interface Norm {
  id: string;
  boeId: string;
  eli: string;
  title: string;
  rank: string;
  department: string;
  published: string;
  inForceFrom: string;
  inForceTo: string | null;
  status: RecordStatus;
  urlHtml: string;
  urlPdf: string;
  urlGazette: string;
  consolidationUrl: string;
  lastConsolidationNote: string;
  lastSeen: string;
  lastSeenHash: string;
  watchedArticles: string[];
  amendments: { byBoeId: string; note: string }[];
}

export interface Requirement {
  id: string;
  track: Track;
  routes: RouteKind[];
  actor: Actor;
  topic: Topic;
  title: string;
  rule: string;
  legalFormula?: string;
  citations: Citation[];
  status: RecordStatus;
  conflictId?: string;
  journey: JourneyStage;
  fileOrder: number;
  packetItem?: string;
}

export interface ProcessPage {
  id: string;
  url: string;
  owner: string;
  allowedFields: string[];
  lastSeen: string;
  lastSeenHash: string;
  status: "live" | "vanished";
  note?: string;
}

export interface ConflictRecord {
  id: string;
  status: "conflict";
  topic: string;
  track: Track;
  title: string;
  summary: string;
  sources: {
    label: string;
    boeId: string | null;
    processPageId: string | null;
    quote: string;
  }[];
  resolution: string | null;
  guideMust: string;
}

export interface IndexValues {
  id: string;
  name: string;
  role: "index-not-statute";
  disclaimer: string;
  normId: string;
  boeId: string;
  article: string;
  periodLabel: string;
  values: Record<string, number>;
  currency: string;
  lastSeen: string;
}

export interface ChecklistItem {
  order: number;
  requirementId: string;
  label: string;
}

export interface Packet {
  id: string;
  track: Track;
  route: RouteKind;
  actor: Actor;
  title: string;
  subtitle: string;
  items: ChecklistItem[];
}

export const JOURNEY_STAGES: { id: JourneyStage; label: string }[] = [
  { id: "eligibility", label: "Eligibility" },
  { id: "route", label: "Route" },
  { id: "documents", label: "Document packet" },
  { id: "apostille", label: "Apostille & translation" },
  { id: "forms", label: "Forms & fees" },
  { id: "pending", label: "Pending / requerimientos" },
  { id: "approval", label: "Approval, entry, TIE" },
  { id: "renewal", label: "Renewal & prohibitions" },
];

export const LEGAL_DISCLAIMER =
  "Consolidated BOE text is informative; the official gazette publication is the only legally binding source.";
