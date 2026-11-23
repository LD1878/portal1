import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppPage } from "@/components/codex/app-shell";
import { Button } from "@/components/ui/button";
import { openCase, type CaseRow } from "@/lib/account/server";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/desk/new")({ component: NewApplication });

function NewApplication() {
  const navigate = useNavigate();
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
          route: track === "non-lucrative" ? "consulate" : route,
          includeFamily,
          familyCount: includeFamily ? familyCount : 0,
          displayName: displayName.trim(),
        },
      });
      await navigate({ to: "/desk/$caseId", params: { caseId: row.id } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open the case");
    } finally {
      setPending(false);
    }
  }

  return (
    <AppPage kicker="New application" title="Open a Spanish file.">
      <form onSubmit={submit} className="max-w-xl rounded-[22px] bg-white p-6 hairline sm:p-8">
        <p className="text-sm text-muted">
          Two residencies only. The checklist is generated from the packet already in the manual.
        </p>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <Pick selected={track === "digital-nomad"} onClick={() => setTrack("digital-nomad")} label="Digital nomad" hint="International telework" />
          <Pick selected={track === "non-lucrative"} onClick={() => setTrack("non-lucrative")} label="Non-lucrative" hint="Live on your own means" />
        </div>
        {track === "digital-nomad" ? (
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <Pick selected={route === "consulate"} onClick={() => setRoute("consulate")} label="From abroad" hint="Consular visa" />
            <Pick selected={route === "uge-ce"} onClick={() => setRoute("uge-ce")} label="Already in Spain" hint="UGE-CE residence" />
          </div>
        ) : (
          <p className="mt-3 rounded-xl bg-paper-inset px-4 py-3 text-sm text-muted">
            Non-lucrative starts at the consulate, from origin. There is no UGE-CE initial path.
          </p>
        )}
        <label className="mt-5 flex min-h-11 items-center gap-3 text-sm">
          <input
            type="checkbox"
            className="size-5 rounded border-rule-strong accent-oxblood"
            checked={includeFamily}
            onChange={(e) => setIncludeFamily(e.target.checked)}
          />
          Family members in the same file
        </label>
        {includeFamily ? (
          <label className="mt-3 block text-sm">
            How many, besides you
            <input
              type="number"
              min={1}
              max={12}
              value={familyCount}
              onChange={(e) => setFamilyCount(Math.max(1, Number(e.target.value) || 1))}
              className="mt-1 h-11 w-24 rounded-xl border border-rule bg-paper px-3 font-mono"
            />
          </label>
        ) : null}
        <label className="mt-4 block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">Case name</span>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g. Owen — Madrid 2026"
            className="mt-2 h-11 w-full rounded-xl border border-rule bg-paper px-3"
          />
        </label>
        {error ? <p className="mt-3 text-sm text-oxblood">{error}</p> : null}
        <Button type="submit" disabled={pending} className="mt-6">
          {pending ? "Opening…" : "Create application"}
        </Button>
      </form>
    </AppPage>
  );
}

function Pick({
  selected,
  onClick,
  label,
  hint,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-16 rounded-2xl px-4 py-3 text-left",
        selected ? "border-2 border-oxblood bg-oxblood text-on-brand" : "bg-paper text-ink hairline",
      )}
    >
      <span className="block text-sm font-semibold">{label}</span>
      <span className={cn("block text-xs", selected ? "text-on-brand/80" : "text-muted")}>{hint}</span>
    </button>
  );
}
