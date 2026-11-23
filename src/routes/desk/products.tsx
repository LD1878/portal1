import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { AppPage } from "@/components/codex/app-shell";
import { Button } from "@/components/ui/button";
import { loadAccess } from "@/lib/account/checkout";
import { OFFERS } from "@/lib/account/plans";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/desk/products")({ component: ProductsPage });

function ProductsPage() {
  const access = typeof window === "undefined" ? null : loadAccess();
  return (
    <AppPage kicker="Buy packages or individual services" title="Products & services">
      <p className="max-w-2xl text-sm text-muted">
        The manual stays open. The desk — your case, the uploads, the check — needs three months.
        Nothing here is lodged with a consulate.
      </p>
      {access ? (
        <p className="mt-4 rounded-2xl bg-gold/30 px-4 py-3 text-sm text-ink">
          {access.offer === "prepaid" ? "Three months prepaid" : "Monthly desk"} is already on this account.
        </p>
      ) : null}
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
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
                Most popular
              </span>
            ) : null}
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
              {offer.featured ? "Prepaid" : "Billed monthly"}
            </p>
            <h2 className="mt-2 font-display text-3xl text-ink">{offer.name}</h2>
            <p className="mt-4 font-display text-5xl tabular-nums text-ink">
              {offer.price}
              <span className="ml-2 font-sans text-base font-normal text-muted">{offer.period}</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{offer.blurb}</p>
            <ul className="mt-5 flex-1 space-y-2.5 text-sm text-ink">
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
    </AppPage>
  );
}
