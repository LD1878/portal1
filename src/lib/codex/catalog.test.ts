import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  conflicts,
  norms,
  OFFICIAL_HOSTS,
  pages,
  packets,
  requirements,
  reqsById,
} from "./catalog.ts";
import { dnMonthly, nlvMonthly } from "./formulas.ts";

describe("codex catalog", () => {
  it("every requirement citation resolves", () => {
    const boe = new Set(norms.map((n) => n.boeId));
    const pageIds = new Set(pages.map((p) => p.id));
    const conflictIds = new Set(conflicts.map((c) => c.id));
    for (const r of requirements) {
      if (r.status === "repealed") {
        assert.fail(`published requirement ${r.id} is repealed`);
      }
      if (r.status === "conflict") {
        assert.ok(r.conflictId && conflictIds.has(r.conflictId), r.id);
      }
      for (const c of r.citations) {
        if (c.boeId) assert.ok(boe.has(c.boeId), `${r.id} -> ${c.boeId}`);
        if (c.processPageId) {
          assert.ok(pageIds.has(c.processPageId), `${r.id} -> ${c.processPageId}`);
        }
      }
    }
  });

  it("packet items point at real requirements", () => {
    for (const p of packets) {
      for (const item of p.items) {
        assert.ok(reqsById[item.requirementId], `${p.id} ${item.requirementId}`);
      }
    }
  });

  it("official URLs stay on official hosts", () => {
    for (const p of pages) {
      const host = new URL(p.url).hostname.replace(/^www\./, "");
      assert.ok(
        OFFICIAL_HOSTS.some((h) => host === h.replace(/^www\./, "") || host.endsWith(`.${h.replace(/^www\./, "")}`)),
        p.url,
      );
    }
  });

  it("NLV formula is 400% + 100% per member, not a frozen euro statute", () => {
    const one = nlvMonthly(1);
    assert.equal(one.holderUnits, 4);
    assert.equal(one.familyUnits, 1);
    assert.equal(one.totalUnits, 5);
    assert.match(one.formula, /400% IPREM/);
  });

  it("DN formula is 200% + 75% / 25% and keeps two SMI illustrations", () => {
    const a = dnMonthly(1, "gazette-monthly-14");
    const b = dnMonthly(1, "annual-over-12");
    assert.equal(a.holderUnits, 2);
    assert.equal(a.familyUnits, 0.75);
    assert.notEqual(a.illustrativeMonthly, b.illustrativeMonthly);
  });
});
