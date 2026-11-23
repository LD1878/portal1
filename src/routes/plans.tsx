import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OFFERS } from "@/lib/account/plans";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/plans")({ component: PlansPage });

function PlansPage() {
  return (
    <main className="mx-auto max-w-[900px] px-4 py-12 sm:px-6">
      <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-oxblood">Access</p>
      <h1 className="mt-3 font-display text-5xl leading-[0.95] font-bold tracking-tight text-ink">
        Three months. Two ways to pay.
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
        The manual stays open. The desk — your case, the uploads, the check — needs three months.
        Nothing here is lodged with a consulate.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {OFFERS.map((offer) => (
          <article
            key={offer.id}
            className={cn(
              "relative flex flex-col rounded-[22px] bg-white p-6 hairline",
              offer.featured && "ring-2 ring-gold",
            )}
          >
            {offer.featured ? (
              <span className="absolute -top-3 left-6 rounded-full bg-gold px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink">
                Recommended
              </span>
            ) : null}
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
              {offer.featured ? "Prepaid" : "Billed monthly"}
            </p>
            <h2 className="mt-2 font-display text-3xl text-ink">{offer.name}</h2>
            <p className="mt-4 font-display text-5xl tabular-nums text-oxblood">{offer.price}</p>
            <p className="mt-1 text-sm text-muted">{offer.period}</p>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">{offer.blurb}</p>
            <ul className="mt-5 flex-1 space-y-2 text-sm text-ink">
              {offer.points.map((point) => (
                <li key={point} className="flex gap-2">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-gold/40">
                    <Check className="size-3" strokeWidth={2.6} />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-6" variant={offer.featured ? "primary" : "outline"}>
              <Link to="/checkout" search={{ offer: offer.id }}>
                Continue to payment
              </Link>
            </Button>
          </article>
        ))}
      </div>

      <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted">
        The sources, the formula desk and the decision tree stay free. The check on a scan is a
        reading aid, not a decision by the consulate, UGE-CE or extranjería.
      </p>
    </main>
  );
}
