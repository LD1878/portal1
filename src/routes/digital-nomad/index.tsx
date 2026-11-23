import { createFileRoute, Link } from "@tanstack/react-router";
import { GuideLayout, JourneyJump } from "@/components/codex/guide-layout";
import { Button } from "@/components/ui/button";
import { requirementsFor } from "@/lib/codex/catalog";
import { RequirementsByJourney, stagesPresent } from "@/lib/codex/guide";

export const Route = createFileRoute("/digital-nomad/")({
  component: DigitalNomadHub,
});

function DigitalNomadHub() {
  const reqs = requirementsFor({ track: "digital-nomad", actor: "principal" });
  return (
    <GuideLayout
      track="digital-nomad"
      kicker="Ley 14/2013 · Capítulo V bis"
      title="International telework"
      lede="The residence commonly called digital nomad. Third-country nationals who work at a distance, exclusively by computer, telematic and telecommunication means, for companies established outside Spain. Two doors: a consular visa if you are not resident, a UGE-CE residence if you are already lawfully in Spain."
      toc={[
        { href: "/digital-nomad/consulate", label: "Consular visa" },
        { href: "/digital-nomad/uge", label: "UGE-CE residence" },
        { href: "/digital-nomad/family", label: "Family" },
        { href: "/digital-nomad/checklist", label: "Packets" },
        { href: "/formulas", label: "Funds formula" },
      ]}
    >
      <div className="mt-8 flex flex-wrap gap-2">
        <Button asChild>
          <Link to="/digital-nomad/consulate">From abroad</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/digital-nomad/uge">Already in Spain</Link>
        </Button>
        <Link to="/digital-nomad/family" className="inline-flex min-h-11 items-center px-2 text-sm font-semibold text-ink no-underline hover:text-oxblood">
          Family chapter
        </Link>
      </div>
      <JourneyJump stages={stagesPresent(reqs)} />
      <RequirementsByJourney reqs={reqs} />
    </GuideLayout>
  );
}
