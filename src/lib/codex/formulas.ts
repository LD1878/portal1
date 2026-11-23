import { indices } from "./catalog";

export type SmiBasis = "gazette-monthly-14" | "annual-over-12";

/** Legal formulas. Euro arithmetic is illustration of the current index, never the statute. */
export function nlvMonthly(familyMembers: number): {
  formula: string;
  holderUnits: number;
  familyUnits: number;
  totalUnits: number;
  ipremMonthly: number;
  illustrativeMonthly: number;
  illustrativeAnnual: number;
} {
  const holderUnits = 4;
  const familyUnits = familyMembers;
  const totalUnits = holderUnits + familyUnits;
  const iprem = indices.iprem.values.monthly;
  return {
    formula: "400% IPREM (holder) + 100% IPREM × each family member, monthly, × months of validity",
    holderUnits,
    familyUnits,
    totalUnits,
    ipremMonthly: iprem,
    illustrativeMonthly: totalUnits * iprem,
    illustrativeAnnual: totalUnits * iprem * 12,
  };
}

export function dnMonthly(
  extraFamilyMembers: number,
  basis: SmiBasis,
): {
  formula: string;
  holderUnits: number;
  familyUnits: number;
  totalUnits: number;
  smiUsed: number;
  basisLabel: string;
  illustrativeMonthly: number;
} {
  const holderUnits = 2;
  const familyUnits =
    extraFamilyMembers <= 0 ? 0 : 0.75 + Math.max(0, extraFamilyMembers - 1) * 0.25;
  const totalUnits = holderUnits + familyUnits;
  const smiUsed =
    basis === "gazette-monthly-14"
      ? indices.smi.values.monthly14
      : indices.smi.values.annual / 12;
  return {
    formula: "200% SMI (holder) + 75% SMI (first family member) + 25% SMI × each additional",
    holderUnits,
    familyUnits,
    totalUnits,
    smiUsed,
    basisLabel:
      basis === "gazette-monthly-14"
        ? "Illustration A — gazette monthly figure (14 payments)"
        : "Illustration B — annual floor ÷ 12",
    illustrativeMonthly: totalUnits * smiUsed,
  };
}

export function formatEur(n: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(n);
}
