import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { describe, it } from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("validate-codex", () => {
  it("passes on the committed catalog", () => {
    const r = spawnSync(process.execPath, ["scripts/validate-codex.mjs"], {
      cwd: root,
      encoding: "utf8",
    });
    assert.equal(r.status, 0, r.stderr || r.stdout);
    const json = JSON.parse(r.stdout);
    assert.equal(json.ok, true);
    assert.ok(json.requirements > 20);
  });
});
