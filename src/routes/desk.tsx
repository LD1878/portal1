import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/codex/app-shell";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/desk")({ component: DeskLayout });

function DeskLayout() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return (
      <main className="flex min-h-dvh items-center justify-center text-sm text-muted">
        Opening your desk…
      </main>
    );
  }
  if (!user) return <RedirectToSignIn />;
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
