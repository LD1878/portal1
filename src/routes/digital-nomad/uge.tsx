import { createFileRoute, Link } from "@tanstack/react-router";
import { GuideLayout, JourneyJump } from "@/components/codex/guide-layout";
import { PacketChecklist } from "@/components/codex/checklist";
import { Button } from "@/components/ui/button";
import { packetById, requirementsFor } from "@/lib/codex/catalog";
import { RequirementsByJourney, stagesPresent } from "@/lib/codex/guide";

export const Route = createFileRoute("/digital-nomad/uge")({
  component: Page,
});

function Page() {
  const reqs = requirementsFor({
    track: "digital-nomad",
    route: "uge-ce",
    actor: "principal",
  });
  const packet = packetById("dn-uge");
  return (
    <GuideLayout
      track="digital-nomad"
      kicker="Art. 74 quinquies · UGE-CE"
      title="Already lawfully in Spain: UGE-CE residence"
      lede="Foreigners in a regular situation in Spain, or holders of the telework visa, file electronically with the UGE-CE. Plataforma ONE is the public procedure page: MI-T, tasa 038 NRC, digital certificate or Cl@ve, sede of the UGE-CE. Maximum three years. Twenty days. Silence is positive."
      toc={[
        { href: "#route", label: "Channel" },
        { href: "#forms", label: "Forms & fees" },
        { href: "#pending", label: "Pending" },
        { href: "#packet", label: "Packet" },
      ]}
    >
      <div className="mt-6 flex flex-wrap gap-2">
        <Button asChild variant="outline">
          <Link to="/digital-nomad/checklist" search={{ packet: "dn-uge" }}>
            Checklist only
          </Link>
        </Button>
        <Button asChild variant="ghost">
          <Link to="/digital-nomad/consulate">If you are still abroad</Link>
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
