import { specFor } from "./specs";
import type { Review } from "./review";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

/**
 * Read a JPEG or PNG against the packet note. Server-only. The key never
 * reaches the browser. Returns null when no key is configured, so the desk
 * keeps the rules check instead of inventing a reading.
 */
export async function readScan(opts: {
  requirementId: string;
  label: string;
  mime: string;
  base64: string;
}): Promise<Review | null> {
  const key = process.env.XAI_API_KEY?.trim();
  if (!key) return null;
  if (opts.mime !== "image/jpeg" && opts.mime !== "image/png") return null;
  const bytes = Math.ceil((opts.base64.length * 3) / 4);
  if (bytes > MAX_IMAGE_BYTES) return null;

  const spec = specFor(opts.requirementId);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25_000);
  try {
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "grok-4.7",
        temperature: 0,
        max_completion_tokens: 500,
        messages: [
          {
            role: "system",
            content:
              "You check one visa-file scan against one packet note. You do not approve a visa. Reply with JSON only: {\"verdict\":\"looks-aligned\"|\"check\"|\"missing\"|\"unreadable\",\"summary\":\"one sentence\",\"findings\":[{\"id\":\"string\",\"severity\":\"ok\"|\"warn\"|\"block\",\"title\":\"short\",\"detail\":\"one sentence\"}]}. If you cannot read the page, verdict is unreadable.",
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: `data:${opts.mime};base64,${opts.base64}`, detail: "high" },
              },
              {
                type: "text",
                text: `Packet item: ${opts.label}. It should show: ${spec.expect.join(", ") || "the document named in the note"}. It must not be: ${spec.reject.join(", ") || "nothing specific"}. Note: ${spec.note}`,
              },
            ],
          },
        ],
      }),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = body.choices?.[0]?.message?.content ?? "";
    return parseReview(raw);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function parseReview(raw: string): Review | null {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    const parsed = JSON.parse(raw.slice(start, end + 1)) as Review;
    if (!parsed.verdict || !parsed.summary) return null;
    return {
      verdict: parsed.verdict,
      summary: parsed.summary,
      findings: Array.isArray(parsed.findings) ? parsed.findings.slice(0, 6) : [],
    };
  } catch {
    return null;
  }
}
