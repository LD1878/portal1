import { createFileRoute, Link } from "@tanstack/react-router";
import { AppPage } from "@/components/codex/app-shell";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/client";
import { useCurrentUser } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/desk/settings")({ component: SettingsPage });

function SettingsPage() {
  const user = useCurrentUser();
  return (
    <AppPage kicker="Account" title="Settings">
      <div className="max-w-xl space-y-4">
        <section className="rounded-2xl bg-white p-6 hairline">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">Signed in</p>
          <p className="mt-2 font-display text-2xl text-ink">{user?.displayName ?? "Your file"}</p>
          <p className="mt-1 text-sm text-muted">{user?.primaryEmail ?? "No email on this session"}</p>
          <Button
            type="button"
            variant="quiet"
            className="mt-5"
            onClick={() => {
              void signOut().catch(() => undefined);
            }}
          >
            Log out
          </Button>
        </section>
        <section className="rounded-2xl bg-white p-6 hairline">
          <p className="font-display text-xl text-ink">Plans</p>
          <p className="mt-2 text-sm text-muted">Desk access is three months. The sources stay free.</p>
          <Button asChild className="mt-4">
            <Link to="/desk/products">See services</Link>
          </Button>
        </section>
      </div>
    </AppPage>
  );
}
