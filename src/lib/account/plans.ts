export const CHECKOUT_MAIL = "hola@jurospain.com";

export type OfferId = "monthly" | "prepaid" | "whitelabel" | "translation" | "filing";

export interface Offer {
  id: OfferId;
  name: string;
  price: string;
  period: string;
  kicker: string;
  blurb: string;
  points: string[];
  notIncluded?: string[];
  featured?: boolean;
  kind: "desk" | "firm" | "addon";
  checkout: boolean;
}

export const OFFERS: Offer[] = [
  {
    id: "monthly",
    kind: "desk",
    kicker: "Billed monthly",
    name: "Monthly desk",
    price: "€300",
    period: "a month, 3 months minimum",
    blurb:
      "One file on the desk. You upload, the AI checker reads each scan against the packet note. Consular digital nomad and non-lucrative only.",
    points: [
      "€900 across the first three months",
      "One case: holder and family",
      "Digital nomad from abroad (consulate) and non-lucrative",
      "AI checker on every upload: names, dates, apostille, formula",
      "Cancel after month three",
    ],
    notIncluded: [
      "UGE-CE in-Spain residence is not on this plan",
      "Sworn translations",
      "We do not lodge the file",
    ],
    checkout: true,
  },
  {
    id: "prepaid",
    kind: "desk",
    kicker: "Prepaid",
    name: "Three months",
    price: "€600",
    period: "paid once, for 3 months",
    blurb:
      "The same desk, paid up front. Both doors for digital nomad, including UGE-CE if you are already lawfully in Spain.",
    points: [
      "€200 a month, prepaid",
      "One case: holder and family",
      "Consular visa and UGE-CE residence",
      "Non-lucrative from origin",
      "AI checker on every upload",
    ],
    notIncluded: ["Sworn translations", "Lodging is a separate €200 add-on"],
    featured: true,
    checkout: true,
  },
  {
    id: "whitelabel",
    kind: "firm",
    kicker: "For firms",
    name: "Whitelabel",
    price: "€2.000",
    period: "a month",
    blurb:
      "Unlimited cases for a practice that outsources the desk. Your logo on the product instead of JUROSpain. The platform is not built out yet — this is the place in the list.",
    points: [
      "Unlimited cases for your clients",
      "Your logo in place of JUROSpain",
      "AI checker on every file",
      "Desk for consular, UGE-CE and non-lucrative",
      "Talk to us before this goes live",
    ],
    checkout: false,
  },
  {
    id: "translation",
    kind: "addon",
    kicker: "When the file is 100%",
    name: "Sworn translations",
    price: "€1.000",
    period: "once, all documents in the case",
    blurb:
      "English into Spanish, sworn (traducción jurada), for every document already on this file. Available once the packet is complete.",
    points: [
      "EN → ES sworn, the whole case",
      "One price, not per page",
      "Unlocks after every item looks aligned",
    ],
    checkout: true,
  },
  {
    id: "filing",
    kind: "addon",
    kicker: "After 100% and translation",
    name: "We submit the file",
    price: "€200",
    period: "once, when the packet is ready",
    blurb:
      "We lodge the assembled file. This add-on opens only when the case is 100% checked and the sworn translations are on it.",
    points: [
      "Lodging after the packet is complete",
      "Requires the €1.000 translation add-on first",
      "The authority still decides",
    ],
    checkout: true,
  },
];

export const DESK_OFFERS = OFFERS.filter((o) => o.kind === "desk" || o.kind === "firm");
export const ADDON_OFFERS = OFFERS.filter((o) => o.kind === "addon");

export function offerById(id: OfferId) {
  return OFFERS.find((o) => o.id === id);
}
