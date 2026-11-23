import { cn } from "@/lib/utils";

export type StatusTone = "idle" | "missing" | "check" | "ok" | "live";

const TONE: Record<StatusTone, string> = {
  idle: "bg-paper-inset text-muted",
  missing: "bg-oxblood-soft text-oxblood",
  check: "bg-warn-paper text-warn-ink",
  ok: "bg-ok-paper text-ink",
  live: "bg-gold text-ink",
};

export function StatusPill({
  tone,
  children,
  className,
}: {
  tone: StatusTone;
  children: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 font-sans text-[11px] font-semibold tracking-[0.02em]",
        TONE[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
