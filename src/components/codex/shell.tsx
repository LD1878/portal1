import { useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "./site-header";

export function CodexShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname.startsWith("/desk")) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-dvh bg-paper">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SiteHeader />
      <div id="main">{children}</div>
      <SiteFooter />
    </div>
  );
}
