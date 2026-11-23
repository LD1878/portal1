import { createFileRoute, Link } from "@tanstack/react-router";
import { GuideLayout, JourneyJump } from "@/components/codex/guide-layout";
import { PacketChecklist } from "@/components/codex/checklist";
import { ConflictBanner } from "@/components/codex/conflict-banner";
import { Button } from "@/components/ui/button";
import { packetById, requirementsFor } from "@/lib/codex/catalog";
import { RequirementsByJourney, stagesPresent } from "@/lib/codex/guide";

export const Route = createFileRoute("/digital-nomad/consulate")({
  component: Page,
});

function Page() {
  const reqs = requirementsFor({
    track: "digital-nomad",
    route: "consulate",
    actor: "principal",
  });
  const packet = packetById("dn-consulate");
  return (
    <GuideLayout
      track="digital-nomad"
      kicker="Art. 74 quater · Consular visa"
      title="From abroad: the international-telework visa"
      lede="If you are not resident in Spain, you apply for the visa at the competent Spanish consulate. The visa itself is a title to reside and work remotely for up to one year. You cannot file the UGE-CE residence from abroad. Sixty days before the visa expires, file the three-year residence."
      toc={[
        { href: "#eligibility", label: "Eligibility" },
        { href: "#route", label: "Where to file" },
        { href: "#packet", label: "Packet" },
        { href: "/digital-nomad/family", label: "Family" },
      ]}
    >
      <div className="mt-8">
        <ConflictBanner conflictId="consular-local-addenda" />
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <Button asChild variant="outline">
          <Link to="/digital-nomad/checklist" search={{ packet: "dn-consulate" }}>
            Checklist only
          </Link>
        </Button>
        <Button asChild variant="ghost">
          <Link to="/digital-nomad/uge">If already in Spain</Link>
        </Button>
      </div>
      <JourneyJump stages={stagesPresent(reqs)} />
      <RequirementsByJourney reqs={reqs} />
      {packet ? (
        <section id="packet" className="mt-12 scroll-mt-24">
          <PacketChecklist packet={packet} />
        </section>
      ) : null}
    </GuideLayout>
  );
}
