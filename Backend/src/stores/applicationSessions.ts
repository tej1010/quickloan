import type { SharedApplicationSession } from "../types/applicationSession";

const sessions = new Map<string, SharedApplicationSession>();

export function getApplicationSession(sessionId: string): SharedApplicationSession | null {
  return sessions.get(sessionId) ?? null;
}

export function upsertApplicationSession(
  input: Partial<SharedApplicationSession> & { sessionId: string; customerMobile: string },
): SharedApplicationSession {
  const existing = sessions.get(input.sessionId);
  const now = new Date().toISOString();

  const session: SharedApplicationSession = {
    sessionId: input.sessionId,
    applicationNo: input.applicationNo ?? existing?.applicationNo ?? `APP-${Date.now().toString().slice(-8)}`,
    productName: input.productName ?? existing?.productName ?? "",
    productModel: input.productModel ?? existing?.productModel ?? "",
    loanAmount: input.loanAmount ?? existing?.loanAmount ?? 0,
    tenure: input.tenure ?? existing?.tenure ?? 12,
    emiAmount: input.emiAmount ?? existing?.emiAmount ?? 0,
    interestRate: input.interestRate ?? existing?.interestRate ?? 18,
    vendorName: input.vendorName ?? existing?.vendorName ?? "Mobile World Electronics",
    customerProgressStep: input.customerProgressStep ?? existing?.customerProgressStep ?? 0,
    vendorStep: input.vendorStep ?? existing?.vendorStep ?? 0,
    customerMobile: input.customerMobile.replace(/\D/g, ""),
    customerName: input.customerName ?? existing?.customerName ?? "",
    customerDetails: input.customerDetails ?? existing?.customerDetails ?? {
      name: "",
      mobile: input.customerMobile.replace(/\D/g, ""),
      email: "",
      pan: "",
      aadhaar: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    },
    loanId: input.loanId ?? existing?.loanId,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  sessions.set(input.sessionId, session);
  return session;
}
