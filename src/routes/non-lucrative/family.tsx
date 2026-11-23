import { createFileRoute, Link } from "@tanstack/react-router";
import { GuideLayout } from "@/components/codex/guide-layout";
import { PacketChecklist } from "@/components/codex/checklist";
import { RequirementCard } from "@/components/codex/requirement-card";
import { Button } from "@/components/ui/button";
import { packetById, requirementsFor } from "@/lib/codex/catalog";

export const Route = createFileRoute("/non-lucrative/family")({
  component: Page,
});

function Page() {
  const reqs = requirementsFor({ track: "non-lucrative", actor: "family" });
  const packet = packetById("nlv-family");
  return (
    <GuideLayout
      track="non-lucrative"
      kicker="Art. 61.3 · Family"
      title="Family of the non-lucrative resident"
      lede="The family circle is narrower than Ley 14/2013. Spouse, registered partner or stable partner; unmarried minor children who have not formed their own family unit; certain adult children who cannot self-provide. Dependent ascendants are not in this list. Each member files from origin. Means add 100% IPREM per person."
      toc={[
        { href: "#who", label: "Who qualifies" },
        { href: "#packet", label: "Family annex" },
      ]}
    >
      <div className="mt-6">
        <Button asChild variant="outline">
          <Link to="/non-lucrative/consulate">Holder’s consular journey</Link>
        </Button>
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
