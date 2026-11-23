import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { LEGAL_DISCLAIMER } from "@/lib/codex/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavLeaf = {
  to:
    | "/"
    | "/decide"
    | "/digital-nomad"
    | "/digital-nomad/consulate"
    | "/digital-nomad/uge"
    | "/digital-nomad/family"
    | "/digital-nomad/checklist"
    | "/non-lucrative"
    | "/non-lucrative/consulate"
    | "/non-lucrative/family"
    | "/non-lucrative/checklist"
    | "/formulas"
    | "/sources";
  label: string;
};
type NavItem = NavLeaf & { children?: NavLeaf[] };

const NAV: NavItem[] = [
  { to: "/", label: "Codex" },
  { to: "/decide", label: "Decide" },
  {
    to: "/digital-nomad",
    label: "Digital nomad",
    children: [
      { to: "/digital-nomad", label: "Architecture" },
      { to: "/digital-nomad/consulate", label: "Consular visa" },
      { to: "/digital-nomad/uge", label: "UGE-CE residence" },
      { to: "/digital-nomad/family", label: "Family" },
      { to: "/digital-nomad/checklist", label: "Packets" },
    ],
  },
  {
    to: "/non-lucrative",
    label: "Non-lucrative",
    children: [
      { to: "/non-lucrative", label: "Architecture" },
      { to: "/non-lucrative/consulate", label: "Consular visa" },
      { to: "/non-lucrative/family", label: "Family" },
      { to: "/non-lucrative/checklist", label: "Packet" },
    ],
  },
  { to: "/formulas", label: "Formulas" },
  { to: "/sources", label: "Sources" },
];

function isActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group flex min-h-11 items-center gap-3 no-underline">
      <img
        src="/logo.png"
        alt="JUROSpain"
        className="h-8 w-auto sm:h-10"
        width={220}
        height={44}
      />
      {compact ? null : (
        <span className="hidden border-l border-rule pl-3 font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-muted lg:block">
          Living Visa Codex
        </span>
      )}
    </Link>
  );
}

function DesktopNav({ pathname }: { pathname: string }) {
  return (
    <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary">
      {NAV.map((item) => {
        const active = isActive(pathname, item.to);
        if (!item.children) {
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "rounded-md px-3 py-2 font-display text-[0.95rem] font-semibold uppercase tracking-[0.5px] no-underline transition-colors duration-200",
                active ? "text-oxblood" : "text-ink hover:text-oxblood",
              )}
            >
              {item.label}
            </Link>
          );
        }
        return (
          <div
            key={item.to}
            className="group relative flex items-center py-3"
          >
            <Link
              to={item.to}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-2 font-display text-[0.95rem] font-semibold uppercase tracking-[0.5px] no-underline transition-colors duration-200",
                active ? "text-oxblood" : "text-ink group-hover:text-oxblood",
              )}
            >
              {item.label}
              <ChevronDown className="size-3.5 opacity-70" strokeWidth={2.5} />
            </Link>
            <div className="invisible absolute top-full left-1/2 z-50 min-w-56 -translate-x-1/2 rounded-md border border-rule bg-paper-elev py-2 opacity-0 shadow-[var(--shadow-elev-3)] transition-[opacity,visibility] duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              {item.children.map((child) => (
                <Link
                  key={child.to}
                  to={child.to}
                  className={cn(
                    "block border-b border-rule px-6 py-3 font-sans text-[0.95rem] text-ink no-underline last:border-b-0 hover:bg-paper hover:text-oxblood",
                    isActive(pathname, child.to) && child.to !== item.to
                      ? "text-oxblood"
                      : "",
                  )}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </nav>
  );
}

export function CodexShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <div className="paper-grain min-h-dvh">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="sticky top-0 z-50 border-b-[3px] border-gold bg-paper-elev/98 shadow-[var(--shadow-border)] backdrop-blur-[12px]">
        <div className="mx-auto flex h-[90px] max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
          <Wordmark />
          <DesktopNav pathname={pathname} />
          <div className="flex items-center gap-2">
            <Button asChild className="hidden lg:inline-flex">
              <Link to="/decide">Start a file</Link>
            </Button>
            <button
              type="button"
              className="relative flex size-11 items-center justify-center rounded-md text-ink xl:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
        {open ? (
          <nav
            className="border-t border-rule border-b-[5px] border-b-oxblood bg-paper-elev px-4 py-4 shadow-[var(--shadow-elev-3)] xl:hidden"
            aria-label="Mobile"
          >
            <ul className="flex flex-col">
              {NAV.map((item) => (
                <li key={item.to} className="border-b border-rule">
                  <Link
                    to={item.to}
                    className={cn(
                      "flex min-h-11 items-center justify-center font-display text-base font-semibold uppercase tracking-[0.5px] no-underline",
                      isActive(pathname, item.to) ? "text-oxblood" : "text-ink",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {item.children ? (
                    <ul className="bg-paper pb-2">
                      {item.children.map((child) => (
                        <li key={child.to}>
                          <Link
                            to={child.to}
                            className="flex min-h-11 items-center justify-center text-sm text-ink-soft no-underline hover:text-oxblood"
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
            <div className="mt-4 flex justify-center pb-2">
              <Button asChild>
                <Link to="/decide" onClick={() => setOpen(false)}>
                  Start a file
                </Link>
              </Button>
            </div>
          </nav>
        ) : null}
      </header>
      <div id="main">{children}</div>
      <footer className="mt-20 border-t border-rule bg-paper-elev">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Wordmark compact />
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted">
              English operating manual for two Spanish residencies only:
              international telework (Ley 14/2013) and non-lucrative temporary
              residence (LO 4/2000 + RD 1155/2024 arts. 61–64). Generated from
              structured official records. No sales copy in the body of the guide.
            </p>
            <p className="mt-4 max-w-xl text-xs leading-relaxed text-faint">
              {LEGAL_DISCLAIMER} This publication is not legal advice and is not a
              substitute for the competent consulate, UGE-CE or extranjería file.
            </p>
          </div>
          <div>
            <h3 className="font-display text-lg font-bold uppercase tracking-[0.5px]">
              Codex
            </h3>
            <ul className="mt-3 space-y-2">
              {NAV.filter((i) => !i.children).map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-ink no-underline opacity-80 hover:text-oxblood hover:opacity-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/digital-nomad"
                  className="text-sm text-ink no-underline opacity-80 hover:text-oxblood hover:opacity-100"
                >
                  Digital nomad
                </Link>
              </li>
              <li>
                <Link
                  to="/non-lucrative"
                  className="text-sm text-ink no-underline opacity-80 hover:text-oxblood hover:opacity-100"
                >
                  Non-lucrative
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-display text-lg font-bold uppercase tracking-[0.5px]">
              File to build?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              The codex is the operating manual. Engagements are with JUROSpain.
            </p>
            <Button asChild className="mt-5">
              <a href="https://jurospain.com/" target="_blank" rel="noreferrer">
                JUROSpain
              </a>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
