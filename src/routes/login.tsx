import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient, signIn } from "@/lib/auth/client";

function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.6 9.2c0-.6-.1-1.2-.2-1.8H9v3.4h4.8a4.1 4.1 0 0 1-1.8 2.7v2.2h2.9c1.7-1.6 2.7-3.9 2.7-6.5z" />
      <path fill="#34A853" d="M9 18c2.4 0 4.5-.8 6-2.2l-2.9-2.2c-.8.6-1.9.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H.9v2.3A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.9 10.7a5.4 5.4 0 0 1 0-3.4V5H.9a9 9 0 0 0 0 8l3-2.3z" />
      <path fill="#EA4335" d="M9 3.6c1.3 0 2.5.5 3.4 1.3l2.6-2.6A9 9 0 0 0 .9 5l3 2.3C4.6 5.2 6.6 3.6 9 3.6z" />
    </svg>
  );
}

export const Route = createFileRoute("/login")({
  validateSearch: (raw: Record<string, unknown>) => ({
    next: typeof raw.next === "string" && raw.next.startsWith("/") ? raw.next : "/desk",
  }),
  component: LoginPage,
});

function LoginPage() {
  const { next } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      if (mode === "up") {
        const { error: err } = await authClient.signUp.email({
          name: name.trim() || email.split("@")[0] || "Applicant",
          email: email.trim(),
          password,
          callbackURL: next,
        });
        if (err) throw new Error(err.message ?? "Could not create the account");
      } else {
        const { error: err } = await authClient.signIn.email({
          email: email.trim(),
          password,
          callbackURL: next,
        });
        if (err) throw new Error(err.message ?? "Email or password did not match");
      }
      await navigate({ to: next as "/desk" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto grid max-w-[1100px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <section>
        <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-oxblood">
          Your file, on your login
        </p>
        <h1 className="mt-3 max-w-xl font-display text-5xl leading-[0.95] font-bold tracking-tight">
          Start the desk.
        </h1>
        <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-soft">
          The manual stays open. The desk is where you type each packet item and
          get a check before you treat it as ready. Nothing here is sent to a
          consulate or to UGE-CE.
        </p>
        <ul className="mt-8 space-y-3 text-sm text-ink-soft">
          <li className="flex gap-3">
            <span className="mt-1 size-2 shrink-0 rounded-full bg-gold" />
            Digital nomad or non-lucrative, holder and family.
          </li>
          <li className="flex gap-3">
            <span className="mt-1 size-2 shrink-0 rounded-full bg-gold" />
            Each line is checked against the packet note already in the manual.
          </li>
          <li className="flex gap-3">
            <span className="mt-1 size-2 shrink-0 rounded-full bg-gold" />
            Monthly plan when you want the desk kept on your account.
          </li>
        </ul>
      </section>

      <form
        onSubmit={submit}
        className="rounded-lg bg-paper-elev p-6 hairline sm:p-8"
      >
        <button
          type="button"
          onClick={() => {
            void signIn("grok-google", { callbackURL: next }).catch((err: unknown) => {
              setError(err instanceof Error ? err.message : "Google sign-in did not start");
            });
          }}
          className="flex min-h-11 w-full items-center justify-center gap-3 rounded-md border-2 border-ink bg-paper font-display text-sm font-semibold uppercase tracking-[0.08em] text-ink hover:border-oxblood hover:text-oxblood"
        >
          <GoogleMark />
          Continue with Google
        </button>
        <p className="my-4 text-center font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-faint">
          or email
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode("up")}
            className={
              mode === "up"
                ? "min-h-11 flex-1 rounded-md bg-oxblood font-display text-sm font-semibold uppercase tracking-[0.08em] text-on-brand"
                : "min-h-11 flex-1 rounded-md font-display text-sm font-semibold uppercase tracking-[0.08em] text-ink"
            }
          >
            Create account
          </button>
          <button
            type="button"
            onClick={() => setMode("in")}
            className={
              mode === "in"
                ? "min-h-11 flex-1 rounded-md bg-oxblood font-display text-sm font-semibold uppercase tracking-[0.08em] text-on-brand"
                : "min-h-11 flex-1 rounded-md font-display text-sm font-semibold uppercase tracking-[0.08em] text-ink"
            }
          >
            Sign in
          </button>
        </div>

        {mode === "up" ? (
          <label className="mt-6 block">
            <span className="font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
              Name
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="mt-2 h-11 w-full rounded-md border border-rule bg-paper px-3 text-ink"
            />
          </label>
        ) : null}

        <label className="mt-4 block">
          <span className="font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
            Email
          </span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="mt-2 h-11 w-full rounded-md border border-rule bg-paper px-3 text-ink"
          />
        </label>
        <label className="mt-4 block">
          <span className="font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
            Password
          </span>
          <input
            required
            type="password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "up" ? "new-password" : "current-password"}
            className="mt-2 h-11 w-full rounded-md border border-rule bg-paper px-3 text-ink"
          />
        </label>

        {error ? (
          <p className="mt-4 text-sm text-oxblood" role="alert">
            {error}
          </p>
        ) : null}

        <Button type="submit" disabled={pending} className="mt-6 w-full">
          {pending ? "Working…" : mode === "up" ? "Create account" : "Sign in"}
        </Button>
        <p className="mt-4 text-xs leading-relaxed text-muted">
          Eight characters minimum. The desk does not submit your file. Access is
          €300 a month for three months, or €600 prepaid.{" "}
          <Link to="/plans" className="text-oxblood">
            See monthly plans
          </Link>
          .
        </p>
      </form>
    </main>
  );
}
