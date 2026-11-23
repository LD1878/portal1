import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { SignedIn, SignedOut } from "@/lib/auth/gates";
import { signOut } from "@/lib/auth/client";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";

type NavLeaf = {
  to:
    | "/"
    | "/decide"
    | "/desk"
    | "/plans"
    | "/digital-nomad"
    | "/digital-nomad/consulate"
    | "/digital-nomad/uge"
    | "/digital-nomad/family"
    | "/non-lucrative"
    | "/non-lucrative/consulate"
    | "/non-lucrative/family"
    | "/formulas"
    | "/sources";
  label: string;
};
type NavItem = NavLeaf & { children?: NavLeaf[] };

const NAV: NavItem[] = [
  { to: "/decide", label: "Decide" },
  {
    to: "/digital-nomad",
    label: "Digital nomad",
    children: [
      { to: "/digital-nomad", label: "The residence" },
      { to: "/digital-nomad/consulate", label: "From abroad" },
      { to: "/digital-nomad/uge", label: "Already in Spain" },
      { to: "/digital-nomad/family", label: "Family" },
    ],
  },
  {
    to: "/non-lucrative",
    label: "Non-lucrative",
    children: [
      { to: "/non-lucrative", label: "The residence" },
      { to: "/non-lucrative/consulate", label: "The consular file" },
      { to: "/non-lucrative/family", label: "Family" },
    ],
  },
  {
    to: "/sources",
    label: "Law",
    children: [
      { to: "/formulas", label: "Formulas" },
      { to: "/sources", label: "Sources" },
    ],
  },
];

function isActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  if (to === "/sources") return pathname === "/sources" || pathname === "/formulas";
  return pathname === to || pathname.startsWith(`${to}/`);
}

function AccountChip() {
  const user = useCurrentUser();
  return (
    <>
      <SignedOut>
        <Link
          to="/login"
          search={{ next: "/desk" }}
          className="hidden shrink-0 font-sans text-sm font-semibold text-ink no-underline hover:text-oxblood sm:inline"
        >
          Sign in
        </Link>
      </SignedOut>
      <SignedIn>
        <Link
          to="/desk"
          className="hidden max-w-36 truncate font-sans text-sm font-semibold text-muted no-underline hover:text-oxblood lg:inline"
        >
          {user?.displayName ?? user?.primaryEmail ?? "Desk"}
        </Link>
        <button
          type="button"
          onClick={() => {
            void signOut().catch(() => undefined);
          }}
          className="hidden font-sans text-sm font-semibold text-muted hover:text-oxblood sm:inline"
        >
          Sign out
        </button>
      </SignedIn>
    </>
  );
}

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-white/95 backdrop-blur-[12px]">
      <div className="h-[3px] bg-gold" />
      <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary">
          {NAV.map((item) => {
            const active = isActive(pathname, item.to);
            if (!item.children) {
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "rounded-full px-3 py-2 font-sans text-sm font-semibold no-underline transition-colors",
                    active ? "text-oxblood" : "text-ink hover:text-oxblood",
                  )}
                >
                  {item.label}
                </Link>
              );
            }
            return (
              <div key={item.to} className="group relative flex items-center">
                <Link
                  to={item.to}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-3 py-2 font-sans text-sm font-semibold no-underline transition-colors",
                    active ? "text-oxblood" : "text-ink group-hover:text-oxblood",
                  )}
                >
                  {item.label}
                  <ChevronDown className="size-3.5 opacity-60" strokeWidth={2.4} />
                </Link>
                <div className="invisible absolute top-full left-1/2 z-50 min-w-52 -translate-x-1/2 rounded-xl border border-rule bg-white py-2 opacity-0 shadow-[var(--shadow-elev-3)] transition-[opacity,visibility] duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  {item.children.map((child) => (
                    <Link
                      key={child.to}
                      to={child.to}
                      className="block px-4 py-2.5 font-sans text-sm text-ink no-underline last:border-0 hover:bg-paper hover:text-oxblood"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
        <div className="flex shrink-0 items-center gap-3">
          <AccountChip />
          <Button asChild className="hidden lg:inline-flex">
            <Link to="/desk">Open the desk</Link>
          </Button>
          <button
            type="button"
            className="relative flex size-11 items-center justify-center rounded-xl text-ink xl:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <nav className="border-t border-rule bg-white px-4 py-4 shadow-[var(--shadow-elev-3)] xl:hidden" aria-label="Mobile">
          <ul className="flex flex-col">
            {NAV.map((item) => (
              <li key={item.to} className="border-b border-rule">
                <Link
                  to={item.to}
                  className={cn(
                    "flex min-h-11 items-center font-sans text-base font-semibold no-underline",
                    isActive(pathname, item.to) ? "text-oxblood" : "text-ink",
                  )}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children ? (
                  <ul className="pb-2 pl-3">
                    {item.children.map((child) => (
                      <li key={child.to}>
                        <Link
                          to={child.to}
                          className="flex min-h-10 items-center text-sm text-ink-soft no-underline hover:text-oxblood"
                          onClick={() => setOpen(false)}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2 pb-2">
            <SignedOut>
              <Link
                to="/login"
                search={{ next: "/desk" }}
                className="flex min-h-11 items-center justify-center font-sans text-sm font-semibold text-ink no-underline"
                onClick={() => setOpen(false)}
              >
                Sign in
              </Link>
            </SignedOut>
            <Button asChild>
              <Link to="/desk" onClick={() => setOpen(false)}>
                Open the desk
              </Link>
            </Button>
          </div>
        </nav>
      ) : null}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-rule bg-white">
      <div className="mx-auto grid max-w-[1180px] gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Logo compact />
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted">
            Self-serve desk for two Spanish residencies: international telework
            and non-lucrative. The law stays sourced. You upload each document.
            The desk checks it. Nothing is filed for you.
          </p>
        </div>
        <div>
          <h3 className="gold-rule font-display text-lg font-bold uppercase tracking-[0.04em] text-ink">
            The desk
          </h3>
          <ul className="mt-4 space-y-2">
            {[
              { to: "/decide" as const, label: "Decide" },
              { to: "/desk" as const, label: "Your file" },
              { to: "/digital-nomad" as const, label: "Digital nomad" },
              { to: "/non-lucrative" as const, label: "Non-lucrative" },
              { to: "/plans" as const, label: "Plans" },
            ].map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-sm text-ink no-underline opacity-80 hover:text-oxblood hover:opacity-100">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="gold-rule font-display text-lg font-bold uppercase tracking-[0.04em] text-ink">
            Build a file
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Three months of desk access. The sources stay free.
          </p>
          <Button asChild className="mt-5">
            <Link to="/plans">See plans</Link>
          </Button>
        </div>
      </div>
    </footer>
  );
}
