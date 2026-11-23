import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, CircleAlert, FileText, ShoppingCart, Upload, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { StatusPill, type StatusTone } from "@/components/codex/status-pill";
import { Button } from "@/components/ui/button";
import { itemKind, itemNote, packetsForCase, programLabel } from "@/lib/account/case-packets";
import { loadAccess } from "@/lib/account/checkout";
import { textFromFile } from "@/lib/account/extract";
import type { Review } from "@/lib/account/review";
import { getCase, saveAnswer, type AnswerRow, type CaseRow } from "@/lib/account/server";
import { specFor } from "@/lib/account/specs";
import { reqsById } from "@/lib/codex/catalog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/desk/$caseId")({ component: CaseFile });

type Tab = "documents" | "forms" | "files";

function CaseFile() {
  const { caseId } = Route.useParams();
  const [file, setFile] = useState<CaseRow | null>(null);
  const [answers, setAnswers] = useState<Record<string, AnswerRow>>({});
  const [tab, setTab] = useState<Tab>("documents");
  const [openId, setOpenId] = useState<string | null>(null);

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

  const packetList = useMemo(() => (file ? packetsForCase(file) : []), [file]);
  const items = packetList.flatMap((p) => p.items);
  const documents = items.filter((i) => itemKind(i.requirementId) === "document");
  const forms = items.filter((i) => itemKind(i.requirementId) === "form");
  const files = items.filter((i) => answers[i.requirementId]?.fileName);
  const aligned = items.filter((i) => answers[i.requirementId]?.verdict === "looks-aligned").length;
  const percent = items.length ? Math.round((aligned / items.length) * 100) : 0;
  const access = typeof window === "undefined" ? null : loadAccess();

  if (!file) {
    return <p className="px-8 py-16 text-sm text-muted">Loading the case…</p>;
  }

  const title = file.displayName.trim() || (file.track === "digital-nomad" ? "Digital nomad" : "Non-lucrative");
  const shown = tab === "documents" ? documents : tab === "forms" ? forms : files.length ? files : documents.filter((i) => answers[i.requirementId]?.fileName);

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="px-4 py-8 sm:px-8">
        <p className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-oxblood">
          <span>🇪🇸</span>
          Spain · {programLabel(file)} · Main applicant
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-tight text-ink">{title}</h1>

        <div className="mt-6 inline-flex flex-wrap gap-1 rounded-full bg-paper-inset p-1">
          <TabBtn current={tab} id="documents" count={documents.length} onClick={setTab} label="Documents" />
          <TabBtn current={tab} id="forms" count={forms.length} onClick={setTab} label="Forms" />
          <TabBtn current={tab} id="files" count={files.length} onClick={setTab} label="Files" />
        </div>

        <ol className="mt-5 space-y-3">
          {shown.map((item) => (
            <ItemCard
              key={item.requirementId}
              caseId={file.id}
              order={item.order}
              label={item.label}
              requirementId={item.requirementId}
              saved={answers[item.requirementId]}
              open={openId === item.requirementId}
              onToggle={() => setOpenId((id) => (id === item.requirementId ? null : item.requirementId))}
              onSaved={(row) => setAnswers((prev) => ({ ...prev, [item.requirementId]: row }))}
            />
          ))}
          {shown.length === 0 ? (
            <li className="rounded-2xl bg-white px-5 py-8 text-center text-sm text-muted hairline">
              Nothing in this tab yet.
            </li>
          ) : null}
        </ol>
      </div>

      <aside className="border-t border-rule bg-paper-inset p-5 lg:border-t-0 lg:border-l">
        <div className="rounded-2xl bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">Status</p>
            <StatusPill tone={percent === 100 ? "ok" : "idle"}>{percent === 100 ? "Ready to review" : "Not started"}</StatusPill>
          </div>
          <div className="mt-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Progress</span>
              <span className="font-semibold tabular-nums">
                {aligned} / {items.length}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-paper-inset">
              <div className="h-full bg-oxblood" style={{ width: `${percent}%` }} />
            </div>
            <p className="mt-1 text-xs text-faint">{percent}% complete · not submitted</p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">Products</p>
            <Link
              to="/desk/products"
              className="inline-flex items-center gap-1 rounded-full border border-rule px-3 py-1 text-xs font-semibold text-ink no-underline hover:border-ink"
            >
              <ShoppingCart className="size-3.5" />
              Buy
            </Link>
          </div>
          {access ? (
            <p className="mt-3 text-sm text-ink-soft">
              {access.offer === "prepaid" ? "Three months prepaid" : "Monthly desk"} is on this account.
            </p>
          ) : (
            <p className="mt-3 text-sm text-muted">You have no products purchased yet.</p>
          )}
        </div>

        <Link
          to="/desk/settings"
          className="mt-4 flex min-h-11 items-center justify-center gap-2 rounded-full bg-white text-sm font-semibold text-ink no-underline hairline"
        >
          Settings
        </Link>
      </aside>
    </div>
  );
}

function TabBtn({
  current,
  id,
  count,
  label,
  onClick,
}: {
  current: Tab;
  id: Tab;
  count: number;
  label: string;
  onClick: (id: Tab) => void;
}) {
  const active = current === id;
  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className={cn(
        "inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold",
        active ? "bg-white text-ink shadow-sm ring-1 ring-gold" : "text-muted",
      )}
    >
      {label}
      <span className={cn("rounded-full px-1.5 py-0.5 text-[11px] tabular-nums", count ? "bg-oxblood text-on-brand" : "bg-paper text-muted")}>
        {count}
      </span>
    </button>
  );
}

function ItemCard({
  caseId,
  order,
  label,
  requirementId,
  saved,
  open,
  onToggle,
  onSaved,
}: {
  caseId: string;
  order: number;
  label: string;
  requirementId: string;
  saved?: AnswerRow;
  open: boolean;
  onToggle: () => void;
  onSaved: (row: AnswerRow) => void;
}) {
  const req = reqsById[requirementId];
  const spec = specFor(requirementId);
  const [text, setText] = useState(saved?.textValue ?? "");
  const [fileName, setFileName] = useState(saved?.fileName ?? "");
  const [image, setImage] = useState<{ mime: "image/jpeg" | "image/png"; base64: string } | null>(null);
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
  const tone = toneFor(verdict);
  const badge = badgeFor(verdict, fileName);

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
    <li
      className={cn(
        "rounded-2xl bg-white p-4 hairline sm:p-5",
        open && "ring-1 ring-gold",
      )}
    >
      <button type="button" onClick={onToggle} className="flex w-full items-start gap-3 text-left">
        <span
          className={cn(
            "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full",
            tone === "ok" && "bg-gold text-ink",
            tone === "missing" && "bg-oxblood text-on-brand",
            tone === "check" && "bg-warn-paper text-warn-ink",
            (tone === "idle" || tone === "live") && "bg-paper-inset text-muted",
          )}
        >
          {tone === "ok" ? <Check className="size-3.5" strokeWidth={2.6} /> : tone === "missing" ? <X className="size-3.5" strokeWidth={2.6} /> : <CircleAlert className="size-3.5" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-start justify-between gap-2">
            <span>
              <span className="block font-sans text-[15px] font-semibold text-ink">{label}</span>
              <span className="mt-0.5 block text-sm text-muted">
                {fileName ? fileName : "Not uploaded yet"}
              </span>
            </span>
            <StatusPill tone={tone}>{badge}</StatusPill>
          </span>
        </span>
      </button>

      {open ? (
        <div className="mt-4 border-t border-rule pt-4">
          <p className="text-sm leading-relaxed text-muted">{req?.packetItem ?? spec.note}</p>
          <label className="mt-3 flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-rule-strong bg-paper px-3 text-sm">
            <span className="flex min-w-0 items-center gap-2 truncate text-ink-soft">
              <FileText className="size-4 shrink-0" />
              {fileName || "PDF, JPEG or PNG"}
            </span>
            <span className="inline-flex items-center gap-1 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-oxblood">
              <Upload className="size-3.5" />
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
            placeholder="Type the dates, names and the line on the document."
            className="mt-3 w-full rounded-xl border border-rule bg-paper px-3 py-2 text-sm leading-relaxed text-ink"
          />
          {pending ? (
            <div className="mt-3 rounded-xl bg-ink px-3 py-2.5 text-on-brand" role="status">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">AI case review</p>
                <p className="text-sm tabular-nums text-gold">{sweep}%</p>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/15">
                <div className="h-full bg-gold" style={{ width: `${sweep}%` }} />
              </div>
            </div>
          ) : null}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Button type="button" onClick={check} disabled={pending || (text.trim().length < 12 && !image)}>
              {pending ? "Reading…" : "Check this item"}
            </Button>
            {summary && !pending ? <p className="text-sm text-ink-soft">{summary}</p> : null}
          </div>
          {findings.length ? (
            <ul className="mt-3 space-y-1">
              {findings.map((f) => (
                <li key={f.id} className="text-sm text-ink-soft">
                  <span className={cn("font-medium", f.severity === "block" && "text-oxblood")}>{f.title}. </span>
                  {f.detail}
                </li>
              ))}
            </ul>
          ) : null}
          <p className="mt-3 font-mono text-[11px] text-faint">{String(order).padStart(2, "0")} · {itemNote(requirementId).slice(0, 80)}</p>
        </div>
      ) : null}
    </li>
  );
}

function toneFor(verdict: string | null): StatusTone {
  if (verdict === "looks-aligned") return "ok";
  if (verdict === "check") return "check";
  if (verdict === "missing" || verdict === "unreadable") return "missing";
  return "idle";
}

function badgeFor(verdict: string | null, fileName: string | null) {
  if (verdict === "looks-aligned") return "Looks aligned";
  if (verdict === "check") return "Check";
  if (verdict === "missing") return "Does not match";
  if (verdict === "unreadable") return "Not read";
  if (fileName) return "Uploaded";
  return "Missing document";
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
