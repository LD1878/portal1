import { specFor } from "./specs";

export type Verdict = "looks-aligned" | "check" | "missing" | "empty" | "unreadable";

export interface Finding {
  id: string;
  severity: "ok" | "warn" | "block";
  title: string;
  detail: string;
}

export interface Review {
  verdict: Verdict;
  summary: string;
  findings: Finding[];
}

function has(text: string, needle: string) {
  return text.toLowerCase().includes(needle.toLowerCase());
}

/** Compare what the applicant typed with the packet note. Not a filing decision. */
export function reviewAnswer(requirementId: string, raw: string): Review {
  const text = raw.replace(/\s+/g, " ").trim();
  const spec = specFor(requirementId);
  if (text.length < 12) {
    return {
      verdict: "empty",
      summary: "Nothing useful typed yet.",
      findings: [],
    };
  }

  const hits = spec.expect.filter((n) => has(text, n));
  const rejects = spec.reject.filter((n) => has(text, n));
  const findings: Finding[] = [];

  if (hits.length) {
    findings.push({
      id: "signals",
      severity: "ok",
      title: "Expected details are in what you typed",
      detail: hits.slice(0, 5).join(", "),
    });
  } else if (spec.expect.length) {
    findings.push({
      id: "no-signals",
      severity: "block",
      title: "This does not mention what the packet asks for",
      detail: `Looked for: ${spec.expect.slice(0, 4).join(", ")}. ${spec.note}`,
    });
  }

  for (const bad of rejects) {
    findings.push({
      id: `reject-${bad}`,
      severity: "block",
      title: "A phrase that fails this item is in the note",
      detail: `“${bad}”. ${spec.note}`,
    });
  }

  if (text.length < 40) {
    findings.push({
      id: "short",
      severity: "warn",
      title: "Too short to check",
      detail: "Add the dates, names and the line the packet actually asks for.",
    });
  }

  const blocks = findings.filter((f) => f.severity === "block").length;
  const warns = findings.filter((f) => f.severity === "warn").length;
  let verdict: Verdict = "looks-aligned";
  if (blocks && hits.length === 0) verdict = "missing";
  else if (blocks || warns) verdict = "check";

  const summary =
    verdict === "looks-aligned"
      ? "What you typed lines up with this packet item. It is a check, not a filing."
      : verdict === "missing"
        ? "This does not look like the document the packet wants. Read the note and try again."
        : "Readable, but something here needs another look before you treat the slot as ready.";

  return { verdict, summary, findings };
}
