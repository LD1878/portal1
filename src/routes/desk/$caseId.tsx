import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Check,
  CircleAlert,
  FileText,
  Languages,
  Send,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { StatusPill, type StatusTone } from "@/components/codex/status-pill";
import { Button } from "@/components/ui/button";
import { itemKind, itemNote, packetsForCase, programLabel } from "@/lib/account/case-packets";
import { loadAddons, loadAccess } from "@/lib/account/checkout";
import { textFromFile } from "@/lib/account/extract";
import type { Review } from "@/lib/account/review";
import { getCase, saveAnswer, type AnswerRow, type CaseRow } from "@/lib/account/server";
import { specFor } from "@/lib/account/specs";
import { reqsById } from "@/lib/codex/catalog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/desk/$caseId")({ component: CaseFile });

type Tab = "documents" | "forms" | "files";

const AI_PASSES = [
  "Document type and legibility",
  "Names and dates match the packet note",
  "Issue date inside the validity window",
  "Apostille or legalisation present",
  "Sworn translation required or not",
  "Funds against the current formula",
];

function CaseFile() {
  const { caseId } = Route.useParams();
  const [file, setFile] = useState<CaseRow | null>(null);
  const [answers, setAnswers] = useState<Record<string, AnswerRow>>({});
  const [tab, setTab] = useState<Tab>("documents");
  const [openId, setOpenId] = useState<string | null>(null);
  const [addons, setAddons] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    setFile(null);
    getCase({ data: { id: caseId } }).then((res) => {
      if (cancelled || !res) return;
      setFile(res.file);
      setAnswers(Object.fromEntries(res.answers.map((a) => [a.requirementId, a])));
    });
    setAddons(loadAddons());
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
  const checked = items.filter((i) => answers[i.requirementId]?.verdict).length;
  const missing = items.length - aligned;
  const percent = items.length ? Math.round((aligned / items.length) * 100) : 0;
  const complete = percent === 100;
  const hasTranslation = addons.includes("translation");
  const hasFiling = addons.includes("filing");
  const access = typeof window === "undefined" ? null : loadAccess();

  if (!file) {
    return <p className="px-8 py-16 text-sm text-muted">Loading the case…</p>;
  }

  const title = file.displayName.trim() || (file.track === "digital-nomad" ? "Digital nomad" : "Non-lucrative");
  const shown =
    tab === "documents"
      ? documents
      : tab === "forms"
        ? forms
        : files.length
          ? files
          : documents.filter((i) => answers[i.requirementId]?.fileName);

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="px-4 py-8 sm:px-8">
        <p className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-oxblood">
          <span>🇪🇸</span>
          Spain · {programLabel(file)} · Main applicant
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-tight text-ink">{title}</h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Upload each scan. The AI checker reads it against the packet note — names, dates, apostille,
          formula. It does not lodge the file.
        </p>

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

      <aside className="space-y-4 bg-ink p-5 text-on-brand lg:min-h-dvh">
        <section className="rounded-2xl bg-white/8 p-5 ring-1 ring-gold/40">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">Status</p>
            <span className="rounded-full bg-gold px-2.5 py-1 text-[11px] font-semibold text-ink">
              {complete ? "Ready to review" : "In progress"}
            </span>
          </div>
          <p className="mt-3 font-display text-4xl tabular-nums text-gold">{percent}%</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-gold" style={{ width: `${percent}%` }} />
          </div>
          <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
            <Stat k="Aligned" v={String(aligned)} />
            <Stat k="Checked" v={String(checked)} />
            <Stat k="Open" v={String(missing)} />
          </dl>
          <p className="mt-3 text-xs leading-relaxed text-on-brand/55">
            {items.length} items in the packet · not submitted
          </p>
        </section>

        <section className="rounded-2xl bg-white/8 p-5 ring-1 ring-white/10">
          <div className="flex items-center gap-2 text-gold">
            <Sparkles className="size-4" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">AI checker</p>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-on-brand/75">
            First pass in about a second. A dummy run until a vision key is connected — then it
            reads the scan itself.
          </p>
          <ol className="mt-4 space-y-2">
            {AI_PASSES.map((line, i) => (
              <li key={line} className="flex gap-3 text-sm text-on-brand/85">
                <span className="font-mono text-[11px] tabular-nums text-gold">{String(i + 1).padStart(2, "0")}</span>
                {line}
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-2xl bg-white/8 p-5 ring-1 ring-white/10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">File notes</p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-on-brand/80">
            <li>Monthly plans do not include UGE-CE. Prepaid does.</li>
            <li>Nothing is lodged until you buy the €200 submit add-on.</li>
            <li>
              Desk: {access?.offer === "prepaid" ? "three months prepaid" : access?.offer === "monthly" ? "monthly" : "not purchased yet"}.
            </li>
          </ul>
        </section>

        <section className="rounded-2xl bg-gold p-5 text-ink">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">When the file is 100%</p>
          <div className="mt-3 space-y-3">
            <AddonRow
              icon={<Languages className="size-4" />}
              title="Sworn translations"
              price="€1.000"
              body="EN → ES, every document in this case."
              ready={complete}
              done={hasTranslation}
              to="/checkout"
              offer="translation"
              need="Finish every item first."
            />
            <AddonRow
              icon={<Send className="size-4" />}
              title="We submit the file"
              price="€200"
              body="Lodging after translation is on the case."
              ready={complete && hasTranslation}
              done={hasFiling}
              to="/checkout"
              offer="filing"
              need={hasTranslation ? "Packet is ready." : "Needs the €1.000 translation first."}
            />
          </div>
        </section>
      </aside>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl bg-white/5 py-2">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-on-brand/45">{k}</dt>
      <dd className="font-display text-lg tabular-nums text-gold">{v}</dd>
    </div>
  );
}

function AddonRow({
  icon,
  title,
  price,
  body,
  ready,
  done,
  to,
  offer,
  need,
}: {
  icon: ReactNode;
  title: string;
  price: string;
  body: string;
  ready: boolean;
  done: boolean;
  to: "/checkout";
  offer: "translation" | "filing";
  need: string;
}) {
  return (
    <div className="rounded-xl bg-ink/8 p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-semibold">
          {icon}
          {title}
        </p>
        <span className="font-display text-lg">{price}</span>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-ink/70">{body}</p>
      {done ? (
        <p className="mt-2 text-xs font-semibold">On this case</p>
      ) : ready ? (
        <Link
          to={to}
          search={{ offer }}
          className="mt-2 inline-flex min-h-9 items-center rounded-full bg-ink px-3 text-xs font-semibold text-gold no-underline"
        >
          Add to this file
        </Link>
      ) : (
        <p className="mt-2 text-xs text-ink/60">{need}</p>
      )}
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

  async function onFile(picked: File | undefined) {
    if (!picked) return;
    setFileName(picked.name);
    const extracted = await textFromFile(picked);
    if (extracted) setText(extracted.slice(0, 4000));
    if (picked.type === "image/jpeg" || picked.type === "image/png") {
      if (picked.size > 4 * 1024 * 1024) {
        setImage(null);
        return;
      }
      const base64 = await fileToBase64(picked);
      setImage({ mime: picked.type, base64 });
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
    <li className={cn("rounded-2xl bg-white p-4 hairline sm:p-5", open && "ring-1 ring-gold")}>
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
          {tone === "ok" ? (
            <Check className="size-3.5" strokeWidth={2.6} />
          ) : tone === "missing" ? (
            <X className="size-3.5" strokeWidth={2.6} />
          ) : (
            <CircleAlert className="size-3.5" />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-start justify-between gap-2">
            <span>
              <span className="block font-sans text-[15px] font-semibold text-ink">{label}</span>
              <span className="mt-0.5 block text-sm text-muted">{fileName ? fileName : "Not uploaded yet"}</span>
            </span>
            <StatusPill tone={tone}>{badge}</StatusPill>
          </span>
        </span>
      </button>

      {open ? (
        <div className="mt-4 border-t border-rule pt-4">
          <p className="text-sm leading-relaxed text-muted">{req?.packetItem ?? spec.note}</p>
          {req?.legalFormula ? (
            <p className="mt-2 rounded-xl bg-paper-inset px-3 py-2 font-mono text-xs text-ink-soft">
              Formula: {req.legalFormula}
            </p>
          ) : null}
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
                <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">
                  <Sparkles className="size-3.5" />
                  AI checker
                </p>
                <p className="text-sm tabular-nums text-gold">{sweep}%</p>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/15">
                <div className="h-full bg-gold" style={{ width: `${sweep}%` }} />
              </div>
              <p className="mt-1.5 text-[11px] text-on-brand/55">Reading names, dates, apostille and the formula</p>
            </div>
          ) : null}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Button type="button" onClick={check} disabled={pending || (text.trim().length < 12 && !image)}>
              <Sparkles className="size-4" />
              {pending ? "Reading…" : "Run AI checker"}
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
          <p className="mt-3 font-mono text-[11px] text-faint">
            {String(order).padStart(2, "0")} · {itemNote(requirementId).slice(0, 90)}
          </p>
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
