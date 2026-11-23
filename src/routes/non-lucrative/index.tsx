import { createFileRoute, Link } from "@tanstack/react-router";
import { GuideLayout, JourneyJump } from "@/components/codex/guide-layout";
import { Button } from "@/components/ui/button";
import { requirementsFor } from "@/lib/codex/catalog";
import { RequirementsByJourney, stagesPresent } from "@/lib/codex/guide";

export const Route = createFileRoute("/non-lucrative/")({
  component: Page,
});

function Page() {
  const reqs = requirementsFor({ track: "non-lucrative", actor: "principal" });
  return (
    <GuideLayout
      track="non-lucrative"
      kicker="RD 1155/2024 · arts. 61–64"
      title="Non-lucrative temporary residence"
      lede="Residence without labour or professional activity. The initial authorisation is a consular visa from the country of origin. Means are a formula in IPREM, proved to a documentary standard that the regulation now spells out for foreign accounts. Renewal is with extranjería, lasts two years, and requires more than 183 days of real residence in the calendar year."
      toc={[
        { href: "/non-lucrative/consulate", label: "Consular visa" },
        { href: "/non-lucrative/family", label: "Family" },
        { href: "/non-lucrative/checklist", label: "Packet" },
        { href: "/formulas", label: "Funds formula" },
      ]}
    >
      <div className="mt-8 flex flex-wrap gap-2">
        <Button asChild>
          <Link to="/non-lucrative/consulate">Build the consular file</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/non-lucrative/family">Family chapter</Link>
        </Button>
      </div>
      <JourneyJump stages={stagesPresent(reqs)} />
      <RequirementsByJourney reqs={reqs} />
    </GuideLayout>
  );
}
