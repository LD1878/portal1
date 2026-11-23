import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { JOURNEY_STAGES, type JourneyStage, type Track } from "@/lib/codex/types";
import { cn } from "@/lib/utils";

export function GuideLayout({
  track,
  title,
  kicker,
  lede,
  toc,
  children,
}: {
  track: Track;
  title: string;
  kicker: string;
  lede: string;
  toc: { href: string; label: string }[];
  children: ReactNode;
}) {
  const other =
    track === "digital-nomad"
      ? { to: "/non-lucrative", label: "Non-lucrative" }
      : { to: "/digital-nomad", label: "Digital nomad" };

  return (
    <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <p className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
          {kicker}
        </p>
        <nav className="mt-4 hidden flex-col gap-1 lg:flex" aria-label="On this route">
          {toc.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-2 py-2 text-sm text-ink-soft no-underline hover:bg-paper-inset hover:text-oxblood"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <Link
          to={other.to}
          className="mt-6 inline-flex text-sm text-muted no-underline hover:text-oxblood"
        >
          Switch to {other.label}
        </Link>
      </aside>
      <div>
        <h1 className="font-display text-4xl leading-[1.1] font-bold tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft">{lede}</p>
        {children}
      </div>
    </div>
  );
}

export function JourneyJump({
  stages,
}: {
  stages?: JourneyStage[];
}) {
  const list = stages
    ? JOURNEY_STAGES.filter((s) => stages.includes(s.id))
    : JOURNEY_STAGES;
  return (
    <nav
      aria-label="Applicant journey"
      className="mt-8 flex gap-2 overflow-x-auto pb-2"
    >
      {list.map((s, i) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className={cn(
            "flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-rule bg-paper-elev px-3 text-xs text-ink-soft no-underline hover:border-oxblood hover:text-oxblood",
          )}
        >
          <span className="font-mono tabular-nums text-faint">
            {String(i + 1).padStart(2, "0")}
          </span>
          {s.label}
        </a>
      ))}
    </nav>
  );
}

export function StageBlock({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mt-12 scroll-mt-28">
      <h2 className="gold-rule mb-4 font-display text-2xl tracking-tight">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
