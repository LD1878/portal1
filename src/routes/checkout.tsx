import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { saveAccess, type OfferId } from "@/lib/account/checkout";


export const Route = createFileRoute("/checkout")({
  validateSearch: (raw: Record<string, unknown>): { offer: OfferId } => ({
    offer: raw.offer === "monthly" ? "monthly" : "prepaid",
  }),
  component: CheckoutPage,
});

const COPY = {
  prepaid: {
    name: "Three months",
    price: "€600",
    line: "Paid once. Access for three months.",
    due: "€600.00",
  },
  monthly: {
    name: "Monthly",
    price: "€300",
    line: "Billed monthly. Three months minimum, €900 in total.",
    due: "€300.00",
  },
} as const;

function CheckoutPage() {
  const { offer } = Route.useSearch();
  const navigate = useNavigate();
  const plan = COPY[offer];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function pay(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const digits = number.replace(/\s/g, "");
    if (digits.length < 15 || !/^\d{2}\/\d{2}$/.test(expiry) || cvc.length < 3) {
      setError("Check the card number, expiry and CVC.");
      return;
    }
    setPending(true);
    window.setTimeout(() => {
      saveAccess({ offer, startedAt: new Date().toISOString(), email: email.trim() });
      setPending(false);
      setDone(true);
    }, 900);
  }

  if (done) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-oxblood">
          Payment received
        </p>
        <h1 className="mt-3 font-display text-5xl leading-[0.95] text-ink">You are in.</h1>
        <p className="mt-4 text-ink-soft">
          {plan.name} is active on {email}. The desk is open. Nothing has been filed.
        </p>
        <Button
          className="mt-8"
          onClick={() => {
            void navigate({ to: "/desk" });
          }}
        >
          Open the desk
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto grid max-w-[1000px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.85fr]">
      <form onSubmit={pay} className="rounded-lg bg-paper-elev p-6 hairline sm:p-8">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-oxblood">
          Checkout
        </p>
        <h1 className="mt-2 font-display text-4xl text-ink">{plan.name}</h1>
        <p className="mt-2 text-sm text-muted">{plan.line}</p>

        <label className="mt-6 block">
          <FieldLabel>Name on card</FieldLabel>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="cc-name"
            className="mt-2 h-11 w-full rounded-md border border-rule bg-paper px-3"
          />
        </label>
        <label className="mt-4 block">
          <FieldLabel>Email for the receipt</FieldLabel>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="mt-2 h-11 w-full rounded-md border border-rule bg-paper px-3"
          />
        </label>
        <label className="mt-4 block">
          <FieldLabel>Card number</FieldLabel>
          <input
            required
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="4242 4242 4242 4242"
            value={number}
            onChange={(e) => setNumber(formatCard(e.target.value))}
            className="mt-2 h-11 w-full rounded-md border border-rule bg-paper px-3 font-mono tracking-wider"
          />
        </label>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <label>
            <FieldLabel>Expiry</FieldLabel>
            <input
              required
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              className="mt-2 h-11 w-full rounded-md border border-rule bg-paper px-3 font-mono"
            />
          </label>
          <label>
            <FieldLabel>CVC</FieldLabel>
            <input
              required
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="123"
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
              className="mt-2 h-11 w-full rounded-md border border-rule bg-paper px-3 font-mono"
            />
          </label>
        </div>
        {error ? (
          <p className="mt-4 text-sm text-oxblood" role="alert">
            {error}
          </p>
        ) : null}
        <Button type="submit" disabled={pending} className="mt-6 w-full">
          {pending ? "Taking payment…" : `Pay ${plan.due}`}
        </Button>
        <p className="mt-3 text-xs leading-relaxed text-muted">
          Card processing is shown here so you can walk the flow. Stripe is not
          connected yet, so this payment is not charged.
        </p>
      </form>

      <aside className="rounded-lg bg-ink p-6 text-on-brand">
        <p className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
          Order
        </p>
        <p className="mt-3 font-display text-3xl">{plan.name}</p>
        <p className="mt-2 text-sm text-on-brand/75">{plan.line}</p>
        <dl className="mt-6 space-y-2 border-t border-white/15 pt-4 text-sm">
          <Row k="Desk access" v={plan.price} />
          <Row k="Due today" v={plan.due} />
        </dl>
        <p className="mt-6 text-xs leading-relaxed text-on-brand/60">
          Includes both visas, family annex, document upload and the check. The
          sources stay free.{" "}
          <Link to="/plans" className="text-gold">
            Change plan
          </Link>
        </p>
      </aside>
    </main>
  );
}

function FieldLabel({ children }: { children: string }) {
  return (
    <span className="font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
      {children}
    </span>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-on-brand/70">{k}</dt>
      <dd className="font-mono tabular-nums">{v}</dd>
    </div>
  );
}

function formatCard(raw: string) {
  return raw
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();
}

function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}


