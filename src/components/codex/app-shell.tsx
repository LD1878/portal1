import { Link, useRouterState } from "@tanstack/react-router";
import {
  Archive,
  CircleHelp,
  FilePlus,
  FolderKanban,
  LogOut,
  Menu,
  Package,
  Receipt,
  Settings,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Logo } from "@/components/brand/logo";
import { signOut } from "@/lib/auth/client";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/desk" as const, label: "Applications", icon: FolderKanban, exact: true },
  { to: "/desk/new" as const, label: "New application", icon: FilePlus },
  { to: "/desk/products" as const, label: "Services", icon: Package },
  { to: "/desk/settings" as const, label: "Settings", icon: Settings },
  { to: "/desk/help" as const, label: "Help", icon: CircleHelp },
  { to: "/desk/archive" as const, label: "Archive", icon: Archive },
];

function isActive(pathname: string, to: string, exact?: boolean) {
  if (exact) return pathname === "/desk" || pathname === "/desk/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const user = useCurrentUser();
  const [open, setOpen] = useState(false);
  const name = user?.displayName ?? user?.primaryEmail ?? "Your file";
  const initial = name.slice(0, 1).toUpperCase();

  return (
    <div className="min-h-dvh bg-paper">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
        <aside className="hidden min-h-dvh flex-col border-r border-rule bg-white lg:flex">
          <div className="px-4 py-5">
            <Logo to="/desk" compact />
          </div>
          <nav className="flex flex-1 flex-col gap-0.5 px-3" aria-label="Desk">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.to, item.exact);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex min-h-11 items-center gap-3 rounded-full px-3 text-sm font-semibold no-underline transition-colors",
                    active ? "bg-gold text-ink" : "text-ink-soft hover:bg-paper hover:text-ink",
                  )}
                >
                  <Icon className="size-4 shrink-0" strokeWidth={2} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="m-3 rounded-2xl border border-rule bg-paper p-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-gold font-display text-lg text-ink">
                {initial}
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">
                  Logged in as
                </p>
                <p className="truncate text-sm font-semibold text-ink">{name}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                void signOut().catch(() => undefined);
              }}
              className="mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-rule bg-white text-sm font-semibold text-ink hover:border-ink"
            >
              <LogOut className="size-4" />
              Log out
            </button>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-rule bg-white px-4 lg:hidden">
            <Logo to="/desk" compact />
            <button
              type="button"
              className="flex size-11 items-center justify-center rounded-xl"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </header>
          {open ? (
            <nav className="border-b border-rule bg-white px-3 py-3 lg:hidden" aria-label="Desk mobile">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-ink no-underline"
                  onClick={() => setOpen(false)}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          ) : null}
          <div id="main">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function AppPage({
  kicker,
  title,
  actions,
  children,
}: {
  kicker?: string;
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          {kicker ? (
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-oxblood">
              {kicker}
            </p>
          ) : null}
          <h1 className="mt-1 font-display text-4xl tracking-tight text-ink sm:text-[2.6rem]">{title}</h1>
        </div>
        {actions}
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}

export function QuietLink({
  to,
  children,
}: {
  to: "/plans" | "/sources" | "/decide" | "/formulas";
  children: string;
}) {
  return (
    <Link to={to} className="inline-flex items-center gap-2 text-sm font-semibold text-ink no-underline hover:text-oxblood">
      <Receipt className="size-4" />
      {children}
    </Link>
  );
}
