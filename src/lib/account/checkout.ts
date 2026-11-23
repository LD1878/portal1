export type OfferId = "monthly" | "prepaid";

const KEY = "jurospain-access-v1";

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
    if (parsed.offer !== "monthly" && parsed.offer !== "prepaid") return null;
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
