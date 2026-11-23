import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Sparkles, X } from "lucide-react";
import { AppPage } from "@/components/codex/app-shell";
import { Button } from "@/components/ui/button";
import { loadAccess } from "@/lib/account/checkout";
import { ADDON_OFFERS, DESK_OFFERS, type Offer } from "@/lib/account/plans";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/desk/products")({ component: ServicesPage });

function ServicesPage() {
  const access = typeof window === "undefined" ? null : loadAccess();
  return (
    <AppPage kicker="Buy packages or individual services" title="Services">
      <p className="max-w-2xl text-sm text-muted">
        The desk checks what you upload. AI reads names, dates, apostilles and the funds formula
        against the packet note. Lodging and sworn translations are add-ons, not the monthly plan.
      </p>
      {access ? (
        <p className="mt-4 rounded-2xl bg-gold px-4 py-3 text-sm font-semibold text-ink">
          {access.offer === "prepaid" ? "Three months prepaid" : access.offer === "whitelabel" ? "Whitelabel" : "Monthly desk"} is on this account.
        </p>
      ) : null}

      <h2 className="mt-10 font-display text-2xl text-ink">Desk access</h2>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        {DESK_OFFERS.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>

      <h2 className="mt-12 font-display text-2xl text-ink">When the file is ready</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Translation and lodging open after every item on the case looks aligned. Filing needs the
        sworn translations first.
      </p>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {ADDON_OFFERS.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </AppPage>
  );
}

function OfferCard({ offer }: { offer: Offer }) {
  return (
    <article
      className={cn(
        "relative flex flex-col rounded-[22px] bg-white p-6 hairline",
        offer.featured && "ring-2 ring-gold",
        offer.id === "whitelabel" && "bg-ink text-on-brand ring-0",
      )}
    >
      {offer.featured ? (
        <span className="absolute -top-3 left-6 rounded-full bg-gold px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink">
          Most popular
        </span>
      ) : null}
      {offer.id === "whitelabel" ? (
        <span className="absolute -top-3 left-6 rounded-full bg-gold px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink">
          For firms
        </span>
      ) : null}
      <p
        className={cn(
          "text-[11px] font-semibold uppercase tracking-[0.14em]",
          offer.id === "whitelabel" ? "text-gold" : "text-faint",
        )}
      >
        {offer.kicker}
      </p>
      <h2 className={cn("mt-2 font-display text-3xl", offer.id === "whitelabel" ? "text-on-brand" : "text-ink")}>
        {offer.name}
      </h2>
      <p className={cn("mt-4 font-display text-5xl tabular-nums", offer.id === "whitelabel" ? "text-gold" : "text-ink")}>
        {offer.price}
      </p>
      <p className={cn("mt-1 font-sans text-sm", offer.id === "whitelabel" ? "text-on-brand/60" : "text-muted")}>
        {offer.period}
      </p>
      <p className={cn("mt-3 text-sm leading-relaxed", offer.id === "whitelabel" ? "text-on-brand/80" : "text-ink-soft")}>
        {offer.blurb}
      </p>
      <ul className="mt-5 flex-1 space-y-2.5 text-sm">
        {offer.points.map((point) => (
          <li key={point} className="flex gap-2">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-gold text-ink">
              <Check className="size-3" strokeWidth={2.6} />
            </span>
            <span className={offer.id === "whitelabel" ? "text-on-brand/90" : "text-ink"}>{point}</span>
          </li>
        ))}
        {offer.notIncluded?.map((point) => (
          <li key={point} className="flex gap-2">
            <span
              className={cn(
                "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
                offer.id === "whitelabel" ? "bg-white/10 text-on-brand/50" : "bg-paper-inset text-muted",
              )}
            >
              <X className="size-3" strokeWidth={2.6} />
            </span>
            <span className={offer.id === "whitelabel" ? "text-on-brand/55" : "text-muted"}>{point}</span>
          </li>
        ))}
      </ul>
      {offer.checkout ? (
        <Button asChild className="mt-6" variant={offer.featured ? "primary" : offer.id === "whitelabel" ? "gold" : "outline"}>
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
