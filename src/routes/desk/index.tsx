import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Flag, Headset, MapPin, Plus, UserRound } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { AppPage } from "@/components/codex/app-shell";
import { StatusPill } from "@/components/codex/status-pill";
import { Button } from "@/components/ui/button";
import { packetsForCase, programLabel, routeLabel } from "@/lib/account/case-packets";
import { listCases, type CaseRow } from "@/lib/account/server";
import { useCurrentUser } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/desk/")({ component: DeskHome });

function DeskHome() {
  const user = useCurrentUser();
  const name = user?.displayName?.split(" ")[0] ?? "there";
  const [cases, setCases] = useState<CaseRow[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    listCases()
      .then((rows) => {
        if (!cancelled) setCases(rows);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load cases");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppPage
      kicker="Dashboard"
      title={`Welcome, ${name}.`}
      actions={
        <Button asChild>
          <Link to="/desk/new">
            <Plus className="size-4" />
            New application
          </Link>
        </Button>
      }
    >
      {error ? (
        <p className="mb-4 text-sm text-oxblood" role="alert">
          {error}
        </p>
      ) : null}

      <section className="rounded-[22px] bg-paper-inset p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex size-10 items-center justify-center rounded-xl bg-gold">
              <Flag className="size-4" />
            </span>
            <div>
              <h2 className="font-display text-2xl text-ink">Active applications</h2>
              <p className="text-sm text-muted">Track the file. Nothing here is lodged with a consulate.</p>
            </div>
          </div>
          <Button asChild variant="gold" className="hidden sm:inline-flex">
            <Link to="/desk/new">
              <Plus className="size-4" />
              New application
            </Link>
          </Button>
        </div>

        <div className="mt-5 space-y-3">
          {cases === null ? (
            <p className="rounded-2xl bg-white px-5 py-8 text-sm text-muted">Loading cases…</p>
          ) : cases.length === 0 ? (
            <div className="rounded-2xl bg-white px-5 py-10 text-center">
              <p className="font-display text-xl text-ink">No file open yet</p>
              <p className="mt-2 text-sm text-muted">Open a digital nomad or non-lucrative case. The checklist is built from the law, not a blog.</p>
              <Button asChild className="mt-5">
                <Link to="/desk/new">Start an application</Link>
              </Button>
            </div>
          ) : (
            cases.map((row) => <CaseCard key={row.id} row={row} />)
          )}
        </div>
      </section>

      <section className="mt-6 flex flex-col items-start justify-between gap-4 rounded-[22px] bg-paper-inset p-5 sm:flex-row sm:items-center sm:p-6">
        <div>
          <h2 className="font-display text-2xl text-ink">Need a second pair of eyes?</h2>
          <p className="mt-1 max-w-xl text-sm text-muted">
            The desk checks what you upload. The sources stay open. Plans keep the file on your account for three months.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/desk/help">
              <Headset className="size-4" />
              Help
            </Link>
          </Button>
          <Button asChild variant="quiet">
            <Link to="/sources">
              <BookOpen className="size-4" />
              Read the sources
            </Link>
          </Button>
        </div>
      </section>
    </AppPage>
  );
}

function CaseCard({ row }: { row: CaseRow }) {
  const count = packetsForCase(row).reduce((n, p) => n + p.items.length, 0);
  const title = row.displayName.trim() || (row.track === "digital-nomad" ? "Digital nomad" : "Non-lucrative");
  return (
    <Link
      to="/desk/$caseId"
      params={{ caseId: row.id }}
      className="block rounded-2xl bg-white p-5 text-ink no-underline hairline hover:border-gold"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-xl text-ink">{title}</p>
          <p className="mt-1 text-sm text-muted">{count} items in the packet · not submitted</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusPill tone="idle">Not started</StatusPill>
          <span className="flex size-9 items-center justify-center rounded-full bg-paper-inset text-ink">
            <ArrowRight className="size-4" />
          </span>
        </div>
      </div>
      <dl className="mt-5 grid gap-4 sm:grid-cols-3">
        <Meta icon={<span className="text-base">🇪🇸</span>} label="Country" value="Spain" />
        <Meta icon={<MapPin className="size-4" />} label="Program" value={programLabel(row)} />
        <Meta icon={<UserRound className="size-4" />} label="Route" value={routeLabel(row)} />
      </dl>
    </Link>
  );
}

function Meta({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex size-8 items-center justify-center rounded-full bg-paper-inset text-ink">
        {icon}
      </span>
      <div>
        <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">{label}</dt>
        <dd className="text-sm font-semibold text-ink">{value}</dd>
      </div>
    </div>
  );
}
