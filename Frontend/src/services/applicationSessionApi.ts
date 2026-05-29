import type { IncompleteLoanApplication } from "../types";
import type { SharedApplicationSession, UpsertApplicationSessionInput } from "../types/applicationSession";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

function isNetlifyHost() {
  return typeof window !== "undefined" && window.location.hostname.includes("netlify.app");
}

function sessionsBaseUrl() {
  if (API_BASE) return `${API_BASE}/api/applications/sessions`;
  if (isNetlifyHost()) return "/.netlify/functions/application-session";
  return "/api/applications/sessions";
}

async function parseResponse<T>(res: Response): Promise<T | null> {
  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed (${res.status})`);
  }
  const json = await res.json();
  return json.data as T;
}

export function sharedSessionToIncompleteApplication(
  session: SharedApplicationSession,
): IncompleteLoanApplication {
  return {
    sessionId: session.sessionId,
    applicationNo: session.applicationNo,
    productName: session.productName,
    productModel: session.productModel,
    loanAmount: session.loanAmount,
    tenure: session.tenure,
    emiAmount: session.emiAmount,
    interestRate: session.interestRate,
    vendorName: session.vendorName,
    progressStep: session.customerProgressStep,
    customerMobile: session.customerMobile,
    customerName: session.customerName,
    isSelfInitiated: false,
    customerDetails: session.customerDetails,
  };
}

export const applicationSessionApi = {
  async getSession(sessionId: string): Promise<SharedApplicationSession | null> {
    const base = sessionsBaseUrl();
    const url = base.includes("netlify/functions")
      ? `${base}?sessionId=${encodeURIComponent(sessionId)}`
      : `${base}/${encodeURIComponent(sessionId)}`;

    const res = await fetch(url);
    return parseResponse<SharedApplicationSession>(res);
  },

  async createSession(input: UpsertApplicationSessionInput): Promise<SharedApplicationSession> {
    const base = sessionsBaseUrl();
    const res = await fetch(base, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Request failed (${res.status})`);
    }
    const json = await res.json();
    return json.data as SharedApplicationSession;
  },

  async updateSession(
    sessionId: string,
    input: Partial<UpsertApplicationSessionInput>,
  ): Promise<SharedApplicationSession> {
    const base = sessionsBaseUrl();
    const url = base.includes("netlify/functions")
      ? `${base}?sessionId=${encodeURIComponent(sessionId)}`
      : `${base}/${encodeURIComponent(sessionId)}`;

    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...input, sessionId }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Request failed (${res.status})`);
    }
    const json = await res.json();
    return json.data as SharedApplicationSession;
  },
};

export async function saveVendorApplicationSession(
  input: UpsertApplicationSessionInput,
): Promise<void> {
  try {
    const existing = await applicationSessionApi.getSession(input.sessionId);
    if (existing) {
      await applicationSessionApi.updateSession(input.sessionId, input);
    } else {
      await applicationSessionApi.createSession(input);
    }
  } catch {
    // Demo fallback when API is unavailable (offline local dev without backend)
  }
}

export async function loadVendorApplicationForCustomer(
  sessionId: string,
  customerMobile?: string,
): Promise<IncompleteLoanApplication | null> {
  try {
    const session = await applicationSessionApi.getSession(sessionId);
    if (!session) return null;
    if (customerMobile && session.customerMobile !== customerMobile.replace(/\D/g, "")) {
      return null;
    }
    return sharedSessionToIncompleteApplication(session);
  } catch {
    return null;
  }
}
