import { createFileRoute, Link } from "@tanstack/react-router";
import { GuideLayout, JourneyJump } from "@/components/codex/guide-layout";
import { PacketChecklist } from "@/components/codex/checklist";
import { Button } from "@/components/ui/button";
import { packetById, requirementsFor } from "@/lib/codex/catalog";
import { RequirementsByJourney, stagesPresent } from "@/lib/codex/guide";

export const Route = createFileRoute("/non-lucrative/consulate")({
  component: Page,
});

function Page() {
  const reqs = requirementsFor({
    track: "non-lucrative",
    route: "consulate",
    actor: "principal",
  });
  const packet = packetById("nlv-consulate");
  return (
    <GuideLayout
      track="non-lucrative"
      kicker="Arts. 38–39 and 63 · Consulate"
      title="From origin: the non-lucrative visa"
      lede="The visa application is the authorisation application. The consulate weighs the visa requirements plus means and insurance; extranjería weighs the remaining art. 61.2 points. Initial silence is negative at one month. Collect the visa in one month, enter within its validity (maximum three months), then TIE within one month of entry."
      toc={[
        { href: "#eligibility", label: "Eligibility" },
        { href: "#route", label: "Where to file" },
        { href: "#packet", label: "Packet" },
      ]}
    >
      <div className="mt-6 flex flex-wrap gap-2">
        <Button asChild variant="outline">
          <Link to="/non-lucrative/checklist" search={{ packet: "nlv-consulate" }}>
            Checklist only
          </Link>
        </Button>
        <Button asChild variant="ghost">
          <Link to="/non-lucrative/family">Family annex</Link>
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
