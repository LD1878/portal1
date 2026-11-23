import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ADDON_OFFERS, DESK_OFFERS, type Offer } from "@/lib/account/plans";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/plans")({ component: PlansPage });

function PlansPage() {
  return (
    <main className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6">
      <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-oxblood">Services</p>
      <h1 className="mt-3 max-w-3xl font-display text-5xl leading-[0.95] font-bold tracking-tight text-ink">
        The desk, the checker, and what happens when the file is ready.
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
        Monthly is consular only — no UGE-CE. Prepaid opens both doors. Firms who outsource cases
        take Whitelabel. Translation and lodging are add-ons after 100%.
      </p>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {DESK_OFFERS.map((offer) => (
          <Card key={offer.id} offer={offer} />
        ))}
      </div>

      <h2 className="mt-14 font-display text-3xl text-ink">Add-ons</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {ADDON_OFFERS.map((offer) => (
          <Card key={offer.id} offer={offer} />
        ))}
      </div>
    </main>
  );
}

function Card({ offer }: { offer: Offer }) {
  const dark = offer.id === "whitelabel";
  return (
    <article
      className={cn(
        "relative flex flex-col rounded-[22px] p-6 hairline",
        dark ? "bg-ink text-on-brand" : "bg-white",
        offer.featured && "ring-2 ring-gold",
      )}
    >
      {offer.featured ? (
        <span className="absolute -top-3 left-6 rounded-full bg-gold px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink">
          Recommended
        </span>
      ) : null}
      <p className={cn("text-[11px] font-semibold uppercase tracking-[0.14em]", dark ? "text-gold" : "text-muted")}>
        {offer.kicker}
      </p>
      <h2 className={cn("mt-2 font-display text-3xl", dark ? "text-on-brand" : "text-ink")}>{offer.name}</h2>
      <p className={cn("mt-4 font-display text-5xl tabular-nums", dark ? "text-gold" : "text-oxblood")}>{offer.price}</p>
      <p className={cn("mt-1 text-sm", dark ? "text-on-brand/60" : "text-muted")}>{offer.period}</p>
      <p className={cn("mt-4 text-sm leading-relaxed", dark ? "text-on-brand/80" : "text-ink-soft")}>{offer.blurb}</p>
      <ul className="mt-5 flex-1 space-y-2 text-sm">
        {offer.points.map((point) => (
          <li key={point} className="flex gap-2">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-gold text-ink">
              <Check className="size-3" strokeWidth={2.6} />
            </span>
            <span className={dark ? "text-on-brand/90" : "text-ink"}>{point}</span>
          </li>
        ))}
        {offer.notIncluded?.map((point) => (
          <li key={point} className="flex gap-2">
            <span className={cn("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full", dark ? "bg-white/10 text-on-brand/50" : "bg-paper-inset text-muted")}>
              <X className="size-3" strokeWidth={2.6} />
            </span>
            <span className={dark ? "text-on-brand/50" : "text-muted"}>{point}</span>
          </li>
        ))}
      </ul>
      {offer.checkout ? (
        <Button asChild className="mt-6" variant={offer.featured ? "primary" : dark ? "gold" : "outline"}>
          <Link to="/checkout" search={{ offer: offer.id as "monthly" | "prepaid" | "translation" | "filing" }}>
            Continue to payment
          </Link>
        </Button>
      ) : (
        <p className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-gold px-4 text-sm font-semibold text-ink">
          <Sparkles className="size-4" />
          Enquire — not live yet
        </p>
      )}
    </article>
  );
}
