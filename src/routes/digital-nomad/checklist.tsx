import { createFileRoute, Link } from "@tanstack/react-router";
import { PacketChecklist } from "@/components/codex/checklist";
import { packets } from "@/lib/codex/catalog";
import { cn } from "@/lib/utils";

const OPTIONS = packets.filter((p) => p.track === "digital-nomad");

type Search = { packet?: string };

export const Route = createFileRoute("/digital-nomad/checklist")({
  validateSearch: (raw: Record<string, unknown>): Search => ({
    packet: typeof raw.packet === "string" ? raw.packet : "dn-consulate",
  }),
  component: Page,
});

function Page() {
  const { packet: packetId } = Route.useSearch();
  const packet = OPTIONS.find((p) => p.id === packetId) ?? OPTIONS[0];
  if (!packet) return null;
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-oxblood">
        Layer 3 · Checklist-first packet
      </p>
      <h1 className="mt-3 font-display text-4xl leading-tight">Digital nomad packets</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        Tick items as you assemble the file. Progress stays in this browser. The
        packet is generated from requirement records, not from hand-written law.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {OPTIONS.map((p) => (
          <Link
            key={p.id}
            to="/digital-nomad/checklist"
            search={{ packet: p.id }}
            className={cn(
              "inline-flex min-h-11 items-center rounded-full px-4 text-sm no-underline",
              p.id === packet.id
                ? "bg-oxblood text-on-brand"
                : "bg-paper-elev text-ink hairline",
            )}
          >
            {p.actor === "family"
              ? "Family annex"
              : p.route === "uge-ce"
                ? "UGE-CE"
                : "Consulate"}
          </Link>
        ))}
      </div>
      <div className="mt-8">
        <PacketChecklist packet={packet} />
      </div>
    </main>
  );
}
