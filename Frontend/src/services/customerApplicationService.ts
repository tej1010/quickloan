import type { IncompleteLoanApplication, User } from "../types";
import { mockIncompleteApplication } from "./mockData";
import { generateApplicationSessionId } from "./loanApplicationService";

const COMPLETED_KEY_PREFIX = "quickloan_incomplete_application_done";
const DRAFT_KEY = "quickloan_customer_application_draft";

function normalizeMobile(mobile: string) {
  return mobile.replace(/\D/g, "");
}

function completedKey(mobile: string) {
  return `${COMPLETED_KEY_PREFIX}_${normalizeMobile(mobile)}`;
}

function isApplicationCompleted(mobile: string) {
  const key = completedKey(mobile);
  if (localStorage.getItem(key) === "true") return true;
  if (localStorage.getItem(COMPLETED_KEY_PREFIX) === "true") {
    localStorage.removeItem(COMPLETED_KEY_PREFIX);
  }
  return false;
}

export const customerApplicationService = {
  async getIncompleteApplication(mobile: string): Promise<IncompleteLoanApplication | null> {
    await delay(300);
    const clean = normalizeMobile(mobile);
    if (isApplicationCompleted(clean)) return null;

    const draft = readDraft(clean);
    if (draft) return draft;

    if (clean !== mockIncompleteApplication.customerMobile) return null;
    return { ...mockIncompleteApplication };
  },

  async createNewApplication(user: Pick<User, "name" | "mobile" | "email">): Promise<IncompleteLoanApplication> {
    await delay(200);
    localStorage.removeItem(completedKey(user.mobile));
    const app: IncompleteLoanApplication = {
      sessionId: generateApplicationSessionId(),
      applicationNo: `APP-${Date.now().toString().slice(-8)}`,
      productName: "",
      productModel: "",
      loanAmount: 0,
      tenure: 12,
      emiAmount: 0,
      interestRate: 18,
      vendorName: "Quick Loan",
      progressStep: 0,
      customerMobile: user.mobile.replace(/\D/g, ""),
      customerName: user.name,
      isSelfInitiated: true,
      customerDetails: {
        name: user.name,
        mobile: user.mobile.replace(/\D/g, ""),
        email: user.email || "",
        pan: "",
        aadhaar: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
      },
    };
    saveDraft(app);
    return app;
  },

  async saveDraft(application: IncompleteLoanApplication): Promise<void> {
    await delay(100);
    saveDraft(application);
  },

  async markApplicationComplete(mobile?: string): Promise<void> {
    await delay(200);
    if (mobile) localStorage.setItem(completedKey(mobile), "true");
    localStorage.removeItem(DRAFT_KEY);
  },

  async getIncompleteBySession(sessionId: string, mobile?: string): Promise<IncompleteLoanApplication | null> {
    await delay(300);
    if (mobile && isApplicationCompleted(mobile)) return null;

    const draft = readDraft();
    if (draft?.sessionId === sessionId) return draft;

    if (sessionId === mockIncompleteApplication.sessionId) {
      return { ...mockIncompleteApplication };
    }
    return null;
  },
};

function readDraft(mobile?: string): IncompleteLoanApplication | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const app = JSON.parse(raw) as IncompleteLoanApplication;
    if (mobile && normalizeMobile(app.customerMobile) !== normalizeMobile(mobile)) return null;
    return app;
  } catch {
    return null;
  }
}

function saveDraft(application: IncompleteLoanApplication) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(application));
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
