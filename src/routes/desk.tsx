import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { packets, reqsById } from "@/lib/codex/catalog";
import { cn } from "@/lib/utils";
import {
  getCase,
  listCases,
  openCase,
  saveAnswer,
  type AnswerRow,
  type CaseRow,
} from "@/lib/account/server";
import { specFor } from "@/lib/account/specs";
import { textFromFile } from "@/lib/account/extract";
import type { Review } from "@/lib/account/review";

export const Route = createFileRoute("/desk")({ component: DeskPage });

function DeskPage() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-sm text-muted">
        Opening your desk…
      </main>
    );
  }
  if (!user) return <RedirectToSignIn />;
  return <Desk userName={user.displayName ?? user.primaryEmail ?? "Your file"} />;
}

function Desk({ userName }: { userName: string }) {
  const [cases, setCases] = useState<CaseRow[] | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    listCases()
      .then((rows) => {
        if (cancelled) return;
        setCases(rows);
        setActiveId(rows[0]?.id ?? null);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load cases");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-oxblood">
            File desk · {userName}
          </p>
          <h1 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">
            Your case, checked before you file.
          </h1>
        </div>
        <Button asChild variant="outline">
          <Link to="/plans">Monthly plans</Link>
        </Button>
      </div>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft">
        Upload the PDF or scan for each item, or type the key lines. A PDF with
        selectable text is checked here. A photo is stored by name and read only
        when a vision key is connected. Nothing is submitted.
      </p>
      {error ? (
        <p className="mt-4 text-sm text-oxblood" role="alert">
          {error}
        </p>
      ) : null}

      {cases === null ? (
        <p className="mt-10 text-sm text-muted">Loading cases…</p>
      ) : activeId ? (
        <CaseView
          caseId={activeId}
          cases={cases}
          onPick={setActiveId}
          onCreated={(row) => {
            setCases((prev) => [row, ...(prev ?? [])]);
            setActiveId(row.id);
          }}
        />
      ) : (
        <NewCase
          onCreated={(row) => {
            setCases([row]);
            setActiveId(row.id);
          }}
        />
      )}
    </main>
  );
}

function NewCase({ onCreated }: { onCreated: (row: CaseRow) => void }) {
  const [track, setTrack] = useState<CaseRow["track"]>("digital-nomad");
  const [route, setRoute] = useState<CaseRow["route"]>("consulate");
  const [includeFamily, setIncludeFamily] = useState(false);
  const [familyCount, setFamilyCount] = useState(1);
  const [displayName, setDisplayName] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    try {
      const row = await openCase({
        data: {
          track,
          route,
          includeFamily,
          familyCount: includeFamily ? familyCount : 0,
          displayName: displayName.trim(),
        },
      });
      onCreated(row);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open the case");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-10 max-w-xl rounded-lg bg-paper-elev p-6 hairline">
      <h2 className="gold-rule font-display text-2xl">Open a case</h2>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <Pick
          selected={track === "digital-nomad"}
          onClick={() => setTrack("digital-nomad")}
          label="Digital nomad"
        />
        <Pick
          selected={track === "non-lucrative"}
          onClick={() => setTrack("non-lucrative")}
          label="Non-lucrative"
        />
      </div>
      {track === "digital-nomad" ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Pick selected={route === "consulate"} onClick={() => setRoute("consulate")} label="From abroad" />
          <Pick selected={route === "uge-ce"} onClick={() => setRoute("uge-ce")} label="Already in Spain" />
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted">Non-lucrative starts at the consulate, from origin.</p>
      )}
      <label className="mt-4 flex min-h-11 items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={includeFamily}
          onChange={(e) => setIncludeFamily(e.target.checked)}
        />
        Family members in the same file
      </label>
      {includeFamily ? (
        <label className="mt-2 block text-sm">
          How many, besides you
          <input
            type="number"
            min={1}
            max={12}
            value={familyCount}
            onChange={(e) => setFamilyCount(Math.max(1, Number(e.target.value) || 1))}
            className="mt-1 h-11 w-24 rounded-md border border-rule bg-paper px-3 font-mono"
          />
        </label>
      ) : null}
      <label className="mt-4 block">
        <span className="font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
          Case name
        </span>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="e.g. Madrid 2026"
          className="mt-2 h-11 w-full rounded-md border border-rule bg-paper px-3"
        />
      </label>
      {error ? <p className="mt-3 text-sm text-oxblood">{error}</p> : null}
      <Button type="submit" disabled={pending} className="mt-5">
        {pending ? "Opening…" : "Open the desk"}
      </Button>
    </form>
  );
}

function CaseView({
  caseId,
  cases,
  onPick,
  onCreated,
}: {
  caseId: string;
  cases: CaseRow[];
  onPick: (id: string) => void;
  onCreated: (row: CaseRow) => void;
}) {
  const [file, setFile] = useState<CaseRow | null>(null);
  const [answers, setAnswers] = useState<Record<string, AnswerRow>>({});
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setFile(null);
    getCase({ data: { id: caseId } }).then((res) => {
      if (cancelled || !res) return;
      setFile(res.file);
      setAnswers(Object.fromEntries(res.answers.map((a) => [a.requirementId, a])));
    });
    return () => {
      cancelled = true;
    };
  }, [caseId]);

  const packetList = useMemo(() => {
    if (!file) return [];
    return packets.filter((p) => {
      if (p.track !== file.track) return false;
      if (p.actor === "family") return file.includeFamily;
      if (file.track === "digital-nomad") return p.route === file.route;
      return p.route === "consulate";
    });
  }, [file]);

  const items = packetList.flatMap((p) => p.items);
  const aligned = items.filter((i) => answers[i.requirementId]?.verdict === "looks-aligned").length;
  const percent = items.length ? Math.round((aligned / items.length) * 100) : 0;

  if (!file) return <p className="mt-10 text-sm text-muted">Loading the case…</p>;

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center gap-2">
        {cases.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onPick(c.id)}
            className={cn(
              "min-h-11 rounded-full px-4 text-sm",
              c.id === caseId ? "bg-oxblood text-on-brand" : "bg-paper-elev text-ink hairline",
            )}
          >
            {c.displayName || (c.track === "digital-nomad" ? "Digital nomad" : "Non-lucrative")}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          className="min-h-11 rounded-full px-4 text-sm text-oxblood"
        >
          New case
        </button>
      </div>
      {adding ? (
        <NewCase
          onCreated={(row) => {
            setAdding(false);
            onCreated(row);
          }}
        />
      ) : null}

      <section className="mt-6 rounded-lg bg-ink p-5 text-on-brand sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
              Case review
            </p>
            <p className="mt-1 font-display text-3xl">
              {percent === 100 ? "Ready to review" : "Still assembling"}
            </p>
            <p className="mt-1 text-sm text-on-brand/70">
              {aligned} of {items.length} items look aligned · not submitted
            </p>
          </div>
          <p className="font-display text-5xl tabular-nums text-gold">{percent}%</p>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/15">
          <div className="h-full bg-gold" style={{ width: `${percent}%` }} />
        </div>
      </section>

      <div className="mt-6 space-y-8">
        {packetList.map((packet) => (
          <section key={packet.id}>
            <h2 className="gold-rule font-display text-2xl">{packet.title}</h2>
            <ol className="mt-4 space-y-4">
              {packet.items.map((item) => (
                <AnswerSlot
                  key={item.requirementId}
                  caseId={file.id}
                  order={item.order}
                  label={item.label}
                  requirementId={item.requirementId}
                  saved={answers[item.requirementId]}
                  onSaved={(row) =>
                    setAnswers((prev) => ({ ...prev, [item.requirementId]: row }))
                  }
                />
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}

function AnswerSlot({
  caseId,
  order,
  label,
  requirementId,
  saved,
  onSaved,
}: {
  caseId: string;
  order: number;
  label: string;
  requirementId: string;
  saved?: AnswerRow;
  onSaved: (row: AnswerRow) => void;
}) {
  const req = reqsById[requirementId];
  const spec = specFor(requirementId);
  const [text, setText] = useState(saved?.textValue ?? "");
  const [fileName, setFileName] = useState(saved?.fileName ?? "");
  const [image, setImage] = useState<{ mime: "image/jpeg" | "image/png"; base64: string } | null>(
    null,
  );
  const [pending, setPending] = useState(false);
  const [sweep, setSweep] = useState(8);
  const [local, setLocal] = useState<Review | null>(null);

  useEffect(() => {
    setText(saved?.textValue ?? "");
    setFileName(saved?.fileName ?? "");
    setImage(null);
    setLocal(null);
  }, [saved?.textValue, saved?.fileName, requirementId]);

  const verdict = local?.verdict ?? saved?.verdict ?? null;
  const summary = local?.summary ?? saved?.summary ?? null;
  const findings = local?.findings ?? saved?.findings ?? [];

  async function onFile(file: File | undefined) {
    if (!file) return;
    setFileName(file.name);
    const extracted = await textFromFile(file);
    if (extracted) setText(extracted.slice(0, 4000));
    if (file.type === "image/jpeg" || file.type === "image/png") {
      if (file.size > 4 * 1024 * 1024) {
        setImage(null);
        return;
      }
      const base64 = await fileToBase64(file);
      setImage({ mime: file.type, base64 });
    } else {
      setImage(null);
    }
  }

  async function check() {
    setPending(true);
    setSweep(8);
    const started = Date.now();
    const ticker = window.setInterval(() => {
      const elapsed = Date.now() - started;
      setSweep(Math.min(92, 8 + Math.round((elapsed / 1400) * 84)));
    }, 80);
    try {
      const [review] = await Promise.all([
        saveAnswer({
          data: {
            caseId,
            requirementId,
            textValue: text,
            fileName: fileName || undefined,
            imageMime: image?.mime,
            imageBase64: image?.base64,
          },
        }),
        new Promise((resolve) => window.setTimeout(resolve, 1400)),
      ]);
      setSweep(100);
      setImage(null);
      setLocal(review);
      onSaved({
        requirementId,
        textValue: text,
        fileName: fileName || null,
        verdict: review.verdict,
        summary: review.summary,
        findings: review.findings,
      });
    } finally {
      window.clearInterval(ticker);
      setPending(false);
    }
  }

  return (
    <li className="rounded-lg bg-paper-elev p-5 hairline">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-mono text-[11px] tabular-nums text-faint">
          {String(order).padStart(2, "0")}
        </p>
        <VerdictPill verdict={verdict} />
      </div>
      <h3 className="mt-1 font-display text-xl text-ink">{label}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{req?.packetItem ?? spec.note}</p>
      <label className="mt-3 flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-md border border-dashed border-rule-strong bg-paper px-3 text-sm">
        <span className="truncate text-ink-soft">{fileName || "PDF, JPEG or PNG"}</span>
        <span className="shrink-0 font-display text-[11px] font-semibold uppercase tracking-[0.12em] text-oxblood">
          Upload
        </span>
        <input
          type="file"
          accept="application/pdf,image/jpeg,image/png,.pdf,.txt"
          className="sr-only"
          onChange={(e) => {
            void onFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="Type the dates, names and the line on the document. Do not paste a whole passport number if you can avoid it."
        className="mt-3 w-full rounded-md border border-rule bg-paper px-3 py-2 text-sm leading-relaxed text-ink"
      />
      {pending ? <ScanBar percent={sweep} /> : null}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          onClick={check}
          disabled={pending || (text.trim().length < 12 && !image)}
        >
          {pending ? "Reading the page…" : "Check this item"}
        </Button>
        {summary && !pending ? <p className="text-sm text-ink-soft">{summary}</p> : null}
      </div>
      {findings.length ? (
        <ul className="mt-3 space-y-1">
          {findings.map((f) => (
            <li key={f.id} className="text-sm text-ink-soft">
              <span
                className={cn(
                  "font-medium",
                  f.severity === "block" && "text-oxblood",
                  f.severity === "ok" && "text-ink",
                )}
              >
                {f.title}.{" "}
              </span>
              {f.detail}
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function ScanBar({ percent }: { percent: number }) {
  return (
    <div className="mt-3 rounded-md bg-ink px-3 py-2.5 text-on-brand" role="status">
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">
          AI case review
        </p>
        <p className="font-display text-sm tabular-nums text-gold">{percent}%</p>
      </div>
      <div className="relative mt-2 h-1.5 overflow-hidden rounded-full bg-white/15">
        <div
          className="h-full bg-gold transition-[width] duration-100 ease-linear"
          style={{ width: `${percent}%` }}
        />
        <span
          className="pointer-events-none absolute inset-y-0 w-10 bg-gradient-to-r from-transparent via-white/70 to-transparent"
          style={{ left: `${Math.max(0, percent - 8)}%` }}
        />
      </div>
      <p className="mt-1.5 text-[11px] text-on-brand/60">Reading the page against the packet note</p>
    </div>
  );
}

function VerdictPill({ verdict }: { verdict: string | null }) {
  const label =
    verdict === "looks-aligned"
      ? "Looks aligned"
      : verdict === "check"
        ? "Check"
        : verdict === "missing"
          ? "Does not match"
          : verdict === "unreadable"
            ? "Not read"
            : "Not checked";
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.12em]",
        verdict === "looks-aligned" && "bg-gold text-ink",
        verdict === "check" && "bg-warn-paper text-warn-ink",
        (verdict === "missing" || verdict === "unreadable") && "bg-oxblood-soft text-oxblood",
        !verdict && "bg-paper-inset text-muted",
      )}
    >
      {label}
    </span>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const raw = String(reader.result ?? "");
      resolve(raw.slice(raw.indexOf(",") + 1));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function Pick({
  selected,
  onClick,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-12 rounded-md px-4 text-left text-sm",
        selected
          ? "border-2 border-oxblood bg-oxblood text-on-brand"
          : "bg-paper text-ink hairline",
      )}
    >
      {label}
    </button>
  );
}
