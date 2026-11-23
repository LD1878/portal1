export type OfferId = "monthly" | "prepaid" | "whitelabel" | "translation" | "filing";

const KEY = "jurospain-access-v1";
const ADDONS_KEY = "jurospain-addons-v1";

export interface Access {
  offer: OfferId;
  startedAt: string;
  email: string;
}

export function loadAccess(): Access | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Access;
    if (parsed.offer !== "monthly" && parsed.offer !== "prepaid" && parsed.offer !== "whitelabel") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveAccess(access: Access) {
  window.localStorage.setItem(KEY, JSON.stringify(access));
}

export function clearAccess() {
  window.localStorage.removeItem(KEY);
}

export type AddonId = "translation" | "filing";

export function loadAddons(): AddonId[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ADDONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is AddonId => id === "translation" || id === "filing");
  } catch {
    return [];
  }
}

export function saveAddon(id: AddonId) {
  const next = Array.from(new Set([...loadAddons(), id]));
  window.localStorage.setItem(ADDONS_KEY, JSON.stringify(next));
}
