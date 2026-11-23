#!/usr/bin/env node
/**
 * Weekday watcher: fetch watched BOE IDs and official URLs, compare hashes.
 * Safe metadata (dates, hashes) may be auto-merged. Guide prose still goes
 * through a PR — this script only writes data/*.json metadata and a report.
 *
 * Usage:
 *   node scripts/watch-boe.mjs            # live fetch
 *   node scripts/watch-boe.mjs --sample   # sample amendment (CI demonstration)
 */
import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sample = process.argv.includes("--sample");

function sha(buf) {
  return createHash("sha256").update(buf).digest("hex").slice(0, 16);
}

async function fetchHash(url) {
  const res = await fetch(url, {
    headers: { "user-agent": "JUROSpain-Living-Visa-Codex/1.0 (+https://jurospain.com)" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  return { status: res.status, hash: sha(buf), bytes: buf.length };
}

if (sample) {
  const reportDir = join(root, "artifacts");
  await mkdir(reportDir, { recursive: true });
  const report = {
    mode: "sample",
    simulatedAt: new Date().toISOString(),
    change: {
      boeId: "BOE-A-2026-3815",
      article: "1",
      kind: "index-update",
      note: "Sample: if RD of SMI is amended, update data/indices/indices.json values and data/norms/rd-126-2026-smi.json lastSeenHash. Do not rewrite guide English in this commit.",
      autoMergeSafe: ["lastSeen", "lastSeenHash", "values.monthly14", "values.annual"],
      requiresHumanPr: [
        "Any change to requirement.rule English",
        "Any new conflict",
        "Any vanished official URL",
      ],
    },
  };
  const path = join(reportDir, "watch-boe-sample.json");
  await writeFile(path, JSON.stringify(report, null, 2));
  console.log("sample amendment report", path);
  process.exit(0);
}

const pages = JSON.parse(
  await readFile(join(root, "data/process-pages/pages.json"), "utf8"),
);
const results = [];
for (const page of pages) {
  try {
    const got = await fetchHash(page.url);
    const changed = got.hash !== page.lastSeenHash.replace(/^seed:[^:]+:/, "");
    results.push({
      id: page.id,
      url: page.url,
      ok: true,
      hash: got.hash,
      bytes: got.bytes,
      changed,
    });
    page.lastSeen = new Date().toISOString().slice(0, 10);
    page.lastSeenHash = got.hash;
  } catch (err) {
    results.push({
      id: page.id,
      url: page.url,
      ok: false,
      error: String(err),
      changed: true,
      vanished: true,
    });
    page.status = "vanished";
  }
}

await writeFile(
  join(root, "data/process-pages/pages.json"),
  JSON.stringify(pages, null, 2) + "\n",
);
await mkdir(join(root, "artifacts"), { recursive: true });
await writeFile(
  join(root, "artifacts/watch-boe-report.json"),
  JSON.stringify({ ranAt: new Date().toISOString(), results }, null, 2),
);
const vanished = results.filter((r) => r.vanished);
if (vanished.length) {
  console.error("vanished sources", vanished.map((v) => v.id).join(", "));
  process.exit(2);
}
console.log(JSON.stringify({ ok: true, pages: results.length }, null, 2));
