export const CHECKOUT_MAIL = "hola@jurospain.com";

export interface Offer {
  id: "monthly" | "prepaid";
  name: string;
  price: string;
  period: string;
  blurb: string;
  points: string[];
  featured?: boolean;
}

/** One product. Three months is the minimum. */
export const OFFERS: Offer[] = [
  {
    id: "monthly",
    name: "Monthly",
    price: "€300",
    period: "a month, 3 months minimum",
    blurb: "The desk, billed monthly. You stay for at least a quarter.",
    points: [
      "€900 across the first three months",
      "Both visas, holder and family",
      "Document upload and a check on each item",
      "Cancel after month three. Nothing is filed for you",
    ],
  },
  {
    id: "prepaid",
    name: "Three months",
    price: "€600",
    period: "paid once, for 3 months",
    blurb: "The same desk, paid up front. Half the monthly rate.",
    points: [
      "€200 a month, prepaid",
      "Both visas, holder and family",
      "Document upload and a check on each item",
      "Access ends after three months unless you renew",
    ],
    featured: true,
  },
];
