import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { packets } from "@/lib/codex/catalog";
import { reviewAnswer, type Review } from "./review";

const Track = z.enum(["digital-nomad", "non-lucrative"]);
const RouteKind = z.enum(["consulate", "uge-ce"]);

export interface CaseRow {
  id: string;
  track: "digital-nomad" | "non-lucrative";
  route: "consulate" | "uge-ce";
  includeFamily: boolean;
  familyCount: number;
  displayName: string;
  updatedAt: string;
}

export interface AnswerRow {
  requirementId: string;
  textValue: string;
  fileName: string | null;
  verdict: Review["verdict"] | null;
  summary: string | null;
  findings: Review["findings"];
}

function newId() {
  return crypto.randomUUID();
}

async function sql() {
  const { getSql } = await import("@/lib/db");
  return getSql();
}

export const listCases = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<CaseRow[]> => {
    const db = await sql();
    const rows = await db<{
      id: string;
      track: CaseRow["track"];
      route: CaseRow["route"];
      include_family: boolean;
      family_count: number;
      display_name: string;
      updated_at: string;
    }>`select id, track, route, include_family, family_count, display_name, updated_at
       from cases where user_id = ${context.userId} order by updated_at desc`;
    return rows.map((r) => ({
      id: r.id,
      track: r.track,
      route: r.route,
      includeFamily: r.include_family,
      familyCount: r.family_count,
      displayName: r.display_name,
      updatedAt: String(r.updated_at),
    }));
  });

export const openCase = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      track: Track,
      route: RouteKind,
      includeFamily: z.boolean(),
      familyCount: z.number().int().min(0).max(12),
      displayName: z.string().max(80),
    }),
  )
  .handler(async ({ data, context }): Promise<CaseRow> => {
    const db = await sql();
    const id = newId();
    const route = data.track === "non-lucrative" ? "consulate" : data.route;
    await db`insert into cases (id, user_id, track, route, include_family, family_count, display_name)
      values (${id}, ${context.userId}, ${data.track}, ${route}, ${data.includeFamily}, ${data.familyCount}, ${data.displayName})`;
    return {
      id,
      track: data.track,
      route,
      includeFamily: data.includeFamily,
      familyCount: data.familyCount,
      displayName: data.displayName,
      updatedAt: new Date().toISOString(),
    };
  });

export const getCase = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string().min(8).max(80) }))
  .handler(async ({ data, context }): Promise<{ file: CaseRow; answers: AnswerRow[] } | null> => {
    const db = await sql();
    const rows = await db<{
      id: string;
      track: CaseRow["track"];
      route: CaseRow["route"];
      include_family: boolean;
      family_count: number;
      display_name: string;
      updated_at: string;
    }>`select id, track, route, include_family, family_count, display_name, updated_at
       from cases where id = ${data.id} and user_id = ${context.userId}`;
    const row = rows[0];
    if (!row) return null;
    const answers = await db<{
      requirement_id: string;
      text_value: string;
      file_name: string | null;
      verdict: AnswerRow["verdict"];
      summary: string | null;
      findings_json: string;
    }>`select requirement_id, text_value, file_name, verdict, summary, findings_json
       from case_answers where case_id = ${data.id} and user_id = ${context.userId}`;
    return {
      file: {
        id: row.id,
        track: row.track,
        route: row.route,
        includeFamily: row.include_family,
        familyCount: row.family_count,
        displayName: row.display_name,
        updatedAt: String(row.updated_at),
      },
      answers: answers.map((a) => ({
        requirementId: a.requirement_id,
        textValue: a.text_value,
        fileName: a.file_name,
        verdict: a.verdict,
        summary: a.summary,
        findings: safeFindings(a.findings_json),
      })),
    };
  });

export const saveAnswer = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      caseId: z.string().min(8).max(80),
      requirementId: z.string().min(2).max(80),
      textValue: z.string().max(4000),
      fileName: z.string().max(180).optional(),
      imageMime: z.enum(["image/jpeg", "image/png"]).optional(),
      imageBase64: z.string().max(6_000_000).optional(),
    }),
  )
  .handler(async ({ data, context }): Promise<Review> => {
    const db = await sql();
    const owned = await db<{ id: string }>`select id from cases
      where id = ${data.caseId} and user_id = ${context.userId}`;
    if (!owned[0]) throw new Error("Case not found");
    const allowed = new Set(packets.flatMap((p) => p.items.map((i) => i.requirementId)));
    if (!allowed.has(data.requirementId)) throw new Error("Unknown packet item");

    let review = reviewAnswer(data.requirementId, data.textValue);
    if (data.imageBase64 && data.imageMime && review.verdict !== "looks-aligned") {
      const { readScan } = await import("./vision.server");
      const label =
        packets.flatMap((p) => p.items).find((i) => i.requirementId === data.requirementId)?.label ??
        data.requirementId;
      const seen = await readScan({
        requirementId: data.requirementId,
        label,
        mime: data.imageMime,
        base64: data.imageBase64,
      });
      if (seen) review = seen;
      else if (data.textValue.trim().length < 12) {
        review = {
          verdict: "unreadable",
          summary:
            "The file is saved. A photo has no text layer, so this desk cannot read it until a vision key is connected. Type the key lines, or upload a PDF with selectable text.",
          findings: [
            {
              id: "photo",
              severity: "warn",
              title: "Scan stored, not read",
              detail: "JPEG and PNG stay on this account as a name only. The bytes are not kept.",
            },
          ],
        };
      }
    }

    const id = newId();
    const findings = JSON.stringify(review.findings);
    const fileName = data.fileName ?? null;
    await db`insert into case_answers
        (id, case_id, user_id, requirement_id, text_value, file_name, verdict, summary, findings_json, updated_at)
      values (${id}, ${data.caseId}, ${context.userId}, ${data.requirementId}, ${data.textValue},
        ${fileName}, ${review.verdict}, ${review.summary}, ${findings}, now())
      on conflict (case_id, requirement_id) do update set
        text_value = excluded.text_value,
        file_name = coalesce(excluded.file_name, case_answers.file_name),
        verdict = excluded.verdict,
        summary = excluded.summary,
        findings_json = excluded.findings_json,
        updated_at = now()`;
    await db`update cases set updated_at = now() where id = ${data.caseId} and user_id = ${context.userId}`;
    return review;
  });

function safeFindings(raw: string): Review["findings"] {
  try {
    const parsed = JSON.parse(raw) as Review["findings"];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
