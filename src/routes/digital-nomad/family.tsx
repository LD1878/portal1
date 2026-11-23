import { createFileRoute, Link } from "@tanstack/react-router";
import { GuideLayout } from "@/components/codex/guide-layout";
import { PacketChecklist } from "@/components/codex/checklist";
import { RequirementCard } from "@/components/codex/requirement-card";
import { Button } from "@/components/ui/button";
import { packetById, requirementsFor } from "@/lib/codex/catalog";

export const Route = createFileRoute("/digital-nomad/family")({
  component: Page,
});

function Page() {
  const reqs = requirementsFor({ track: "digital-nomad", actor: "family" });
  const packet = packetById("dn-family");
  return (
    <GuideLayout
      track="digital-nomad"
      kicker="Art. 62.4 · Family"
      title="Family of the international teleworker"
      lede="Spouse or analogous affective relationship, minor children, economically dependent adult children who have not formed their own family unit, and dependent ascendants. They may file jointly, simultaneously or successively. Simultaneous filing is decided with the holder. Means use the 75% / 25% SMI add-on — a formula, not a frozen euro amount."
      toc={[
        { href: "#who", label: "Who qualifies" },
        { href: "#packet", label: "Family annex" },
        { href: "/digital-nomad", label: "Holder chapter" },
      ]}
    >
      <div className="mt-6 flex flex-wrap gap-2">
        <Button asChild variant="outline">
          <Link to="/digital-nomad/consulate">Attach to consular visa</Link>
        </Button>
        <Link to="/digital-nomad/uge" className="inline-flex min-h-11 items-center px-2 text-sm font-semibold text-ink no-underline hover:text-oxblood">
          Attach to UGE-CE file
        </Link>
      </div>
      <div id="who" className="mt-10 space-y-4 scroll-mt-24">
        {reqs.map((r, i) => (
          <RequirementCard key={r.id} req={r} index={i + 1} />
        ))}
      </div>
      {packet ? (
        <section id="packet" className="mt-12 scroll-mt-24">
          <PacketChecklist packet={packet} />
        </section>
      ) : null}
    </GuideLayout>
  );
}
