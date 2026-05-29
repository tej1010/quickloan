import type { ApplicationStatus, ApplicationTabStatus } from "../types";

export const APPLICATION_TAB_STATUSES: ApplicationTabStatus[] = [
  "draft",
  "submitted",
  "approved",
  "rejected",
  "disbursed",
];

export const applicationTabDescriptions: Record<ApplicationTabStatus, string> = {
  draft: "Application started but not yet submitted",
  submitted: "Application submitted; awaiting CIBIL result",
  approved: "CIBIL approved; awaiting customer consent and disbursement",
  rejected: "CIBIL rejected or admin rejected",
  disbursed: "Loan amount credited to vendor's bank account",
};

export const applicationTabLabels: Record<ApplicationTabStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  approved: "Approved",
  rejected: "Rejected",
  disbursed: "Disbursed",
};

export function getApplicationTabStatus(status: ApplicationStatus): ApplicationTabStatus {
  if (status === "consent_pending" || status === "disbursement_pending") return "approved";
  return status;
}

export const applicationSubStatusLabels: Partial<Record<ApplicationStatus, string>> = {
  consent_pending: "Awaiting customer consent",
  disbursement_pending: "Awaiting disbursement",
};
