export type UserRole = "admin" | "vendor" | "customer";

export type LeadStatus =
  | "new"
  | "kyc_pending"
  | "cibil_pending"
  | "consent_pending"
  | "disbursement_pending"
  | "disbursed"
  | "rejected";

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "rejected"
  | "consent_pending"
  | "disbursement_pending"
  | "disbursed";

export type ApplicationTabStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "rejected"
  | "disbursed";

export type EmiStatus = "paid" | "pending" | "overdue" | "upcoming";

export type LoanStatus = "active" | "closed" | "foreclosed";

export type PaymentMethod = "upi" | "net_banking" | "debit_card";

export type NotificationType =
  | "loan_update"
  | "approval_update"
  | "disbursement_update"
  | "emi_alert"
  | "emi_reminder"
  | "payment_update"
  | "noc";
