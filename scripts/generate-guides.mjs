#!/usr/bin/env node
/**
 * Generate English Markdown guides from structured records.
 * Prose is assembled from requirement.rule fields — law is not hand-written
 * in Markdown as the primary source.
 */
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = join(root, "data");
const outDir = join(root, "guides");

const DISCLAIMER =
  "> Consolidated BOE text is informative; the official gazette publication is the only legally binding source.";

async function loadDir(rel) {
  const dir = join(dataDir, rel);
  const names = (await readdir(dir)).filter((n) => n.endsWith(".json"));
  const out = [];
  for (const name of names) {
    const value = JSON.parse(await readFile(join(dir, name), "utf8"));
    if (Array.isArray(value)) out.push(...value);
    else out.push(value);
  }
  return out;
}

const reqs = await loadDir("requirements");
const packets = (await loadDir("checklists")).flatMap((p) =>
  Array.isArray(p) ? p : [p],
);
const conflicts = (await loadDir("conflicts")).flatMap((c) =>
  Array.isArray(c) ? c : [c],
);
const conflictById = Object.fromEntries(conflicts.map((c) => [c.id, c]));

function cite(c) {
  if (c.boeId && c.article) return `${c.boeId} art. ${c.article}`;
  if (c.boeId) return c.boeId;
  if (c.processPageId) return `process:${c.processPageId}`;
  return "";
}

function renderReq(r) {
  const lines = [`### ${r.title}`, "", r.rule, ""];
  if (r.legalFormula) lines.push(`**Formula:** \`${r.legalFormula}\``, "");
  if (r.packetItem) lines.push(`**In the file:** ${r.packetItem}`, "");
  if (r.status === "conflict" && r.conflictId && conflictById[r.conflictId]) {
    const c = conflictById[r.conflictId];
    lines.push(`> **Conflict — not settled.** ${c.title}`, "", c.summary, "");
  }
  const cites = (r.citations ?? []).map(cite).filter(Boolean);
  if (cites.length) lines.push(`*Citations:* ${cites.join("; ")}`, "");
  return lines.join("\n");
}

function renderGuide(title, intro, subset, packetIds) {
  const body = [
    `# ${title}`,
    "",
    DISCLAIMER,
    "",
    intro,
    "",
    ...subset.map(renderReq),
  ];
  for (const id of packetIds) {
    const packet = packets.find((p) => p.id === id);
    if (!packet) continue;
    body.push(`## ${packet.title}`, "", packet.subtitle, "");
    for (const item of packet.items) {
      body.push(`${item.order}. ${item.label}`);
    }
    body.push("");
  }
  return body.join("\n");
}

const files = [
  [
    "digital-nomad/README.md",
    renderGuide(
      "International telework (digital nomad)",
      "Generated from `data/requirements/digital-nomad.json`. Ley 14/2013 arts. 74 bis–quinquies, as inserted by Ley 28/2022.",
      reqs.filter((r) => r.track === "digital-nomad" && r.actor === "principal"),
      ["dn-consulate", "dn-uge"],
    ),
  ],
  [
    "family-digital-nomad/README.md",
    renderGuide(
      "Family of the international teleworker",
      "Generated from `data/requirements/family-digital-nomad.json`. Ley 14/2013 art. 62.4.",
      reqs.filter((r) => r.track === "digital-nomad" && r.actor === "family"),
      ["dn-family"],
    ),
  ],
  [
    "non-lucrative/README.md",
    renderGuide(
      "Non-lucrative temporary residence",
      "Generated from `data/requirements/non-lucrative.json`. RD 1155/2024 arts. 61–64.",
      reqs.filter((r) => r.track === "non-lucrative" && r.actor === "principal"),
      ["nlv-consulate"],
    ),
  ],
  [
    "family-non-lucrative/README.md",
    renderGuide(
      "Family of the non-lucrative resident",
      "Generated from `data/requirements/family-non-lucrative.json`. RD 1155/2024 art. 61.3.",
      reqs.filter((r) => r.track === "non-lucrative" && r.actor === "family"),
      ["nlv-family"],
    ),
  ],
];

for (const [rel, markdown] of files) {
  const path = join(outDir, rel);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, markdown);
  console.log("wrote", rel);
}
