import { createFileRoute, Link } from "@tanstack/react-router";
import { AppPage } from "@/components/codex/app-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/desk/archive")({ component: ArchivePage });

function ArchivePage() {
  return (
    <AppPage kicker="Archive" title="Closed files.">
      <div className="rounded-[22px] bg-white px-6 py-12 text-center hairline">
        <p className="font-display text-2xl text-ink">Nothing archived yet</p>
        <p className="mt-2 text-sm text-muted">Open files stay on Applications until you close them.</p>
        <Button asChild className="mt-5">
          <Link to="/desk">Back to applications</Link>
        </Button>
      </div>
    </AppPage>
  );
}
