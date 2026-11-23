import { createFileRoute, Link } from "@tanstack/react-router";
import { AppPage } from "@/components/codex/app-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/desk/help")({ component: HelpPage });

function HelpPage() {
  return (
    <AppPage kicker="Help" title="How the desk works.">
      <div className="max-w-2xl space-y-4">
        <section className="rounded-2xl bg-white p-6 hairline">
          <h2 className="font-display text-2xl text-ink">Upload, then check</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Each packet item is a document or a form. Upload a PDF with selectable text, or type the
            dates and names. The desk reads it against the packet note already in the manual. It does
            not lodge the file.
          </p>
        </section>
        <section className="rounded-2xl bg-white p-6 hairline">
          <h2 className="font-display text-2xl text-ink">Two residencies</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            International telework (Ley 14/2013) and non-lucrative (RD 1155/2024 arts. 61–64). If you
            are not sure which, use the decision tree first.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/decide">Which visa</Link>
            </Button>
            <Button asChild variant="quiet">
              <Link to="/sources">Sources</Link>
            </Button>
          </div>
        </section>
      </div>
    </AppPage>
  );
}
