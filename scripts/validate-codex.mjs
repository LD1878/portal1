#!/usr/bin/env node
/**
 * CI gate: every published citation must resolve to a live BOE ID or official
 * process page. Conflict/repealed records cannot appear as settled law.
 */
import { readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "data");

const OFFICIAL = [
  "boe.es",
  "inclusion.gob.es",
  "sede.inclusion.gob.es",
  "expinterweb.inclusion.gob.es",
  "one.gob.es",
  "exteriores.gob.es",
  "sede.administracionespublicas.gob.es",
  "seg-social.es",
];

const errors = [];

function fail(msg) {
  errors.push(msg);
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function loadDir(rel) {
  const dir = join(dataDir, rel);
  const names = (await readdir(dir)).filter((n) => n.endsWith(".json"));
  const out = [];
  for (const name of names) {
    const value = await readJson(join(dir, name));
    if (Array.isArray(value)) out.push(...value);
    else out.push(value);
  }
  return out;
}

const norms = await loadDir("norms");
const reqs = await loadDir("requirements");
const pages = await loadDir("process-pages");
const conflicts = await loadDir("conflicts");
const packets = await loadDir("checklists");

const boeIds = new Set(norms.map((n) => n.boeId));
const pageIds = new Set(pages.flatMap((p) => (p.id ? [p.id] : Array.isArray(p) ? [] : [])).concat(
  pages.flatMap((p) => (Array.isArray(p) ? p.map((x) => x.id) : p.id ? [p.id] : [])),
));
const flatPages = pages.flatMap((p) => (Array.isArray(p) ? p : [p]));
const flatConflicts = conflicts.flatMap((c) => (Array.isArray(c) ? c : [c]));
const flatPackets = packets.flatMap((p) => (Array.isArray(p) ? p : [p]));
const pageIdSet = new Set(flatPages.map((p) => p.id));
const conflictIds = new Set(flatConflicts.map((c) => c.id));
const reqIds = new Set(reqs.map((r) => r.id));

for (const n of norms) {
  if (n.status === "repealed") {
    fail(`Norm ${n.boeId} is repealed — it must not be published as in-force.`);
  }
  for (const url of [n.urlHtml, n.urlPdf, n.urlGazette, n.consolidationUrl, n.eli]) {
    checkOfficialUrl(url, n.boeId);
  }
}

for (const p of flatPages) {
  checkOfficialUrl(p.url, p.id);
}

for (const r of reqs) {
  if (r.status === "repealed") {
    fail(`Requirement ${r.id} is repealed and must not appear in a published guide.`);
  }
  if (r.status === "conflict") {
    if (!r.conflictId || !conflictIds.has(r.conflictId)) {
      fail(`Requirement ${r.id} is conflict but has no resolvable conflictId.`);
    }
  }
  for (const c of r.citations ?? []) {
    if (c.boeId && !boeIds.has(c.boeId)) {
      fail(`Requirement ${r.id} cites missing BOE ID ${c.boeId}.`);
    }
    if (c.processPageId && !pageIdSet.has(c.processPageId)) {
      fail(`Requirement ${r.id} cites missing process page ${c.processPageId}.`);
    }
  }
}

for (const packet of flatPackets) {
  for (const item of packet.items ?? []) {
    if (!reqIds.has(item.requirementId)) {
      fail(`Packet ${packet.id} points at missing requirement ${item.requirementId}.`);
    }
  }
}

function checkOfficialUrl(url, label) {
  if (!url) return;
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (!OFFICIAL.some((h) => host === h || host.endsWith(`.${h}`))) {
      fail(`${label} has non-official URL host ${host}: ${url}`);
    }
  } catch {
    fail(`${label} has unparseable URL ${url}`);
  }
}

if (errors.length) {
  console.error(`codex validation failed (${errors.length}):`);
  for (const e of errors) console.error(" -", e);
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      norms: norms.length,
      requirements: reqs.length,
      processPages: flatPages.length,
      conflicts: flatConflicts.length,
      packets: flatPackets.length,
    },
    null,
    2,
  ),
);
