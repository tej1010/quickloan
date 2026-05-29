import Badge from "../ui/badge/Badge";
import type { ApplicationStatus, EmiStatus, LeadStatus } from "../../types";
import {
  getApplicationTabStatus,
  APPLICATION_TAB_STATUSES,
  applicationTabDescriptions,
} from "../../utils/applicationStatus";

export { APPLICATION_TAB_STATUSES, applicationTabDescriptions, getApplicationTabStatus };

const leadStatusConfig: Record<LeadStatus, { label: string; color: "primary" | "success" | "error" | "warning" | "info" }> = {
  new: { label: "New", color: "primary" },
  kyc_pending: { label: "KYC Pending", color: "warning" },
  cibil_pending: { label: "CIBIL Pending", color: "warning" },
  consent_pending: { label: "Consent Pending", color: "info" },
  disbursement_pending: { label: "Disbursement Pending", color: "info" },
  disbursed: { label: "Disbursed", color: "success" },
  rejected: { label: "Rejected", color: "error" },
};

const applicationStatusConfig: Record<ApplicationStatus, { label: string; color: "primary" | "success" | "error" | "warning" | "info" }> = {
  draft: { label: "Draft", color: "info" },
  submitted: { label: "Submitted", color: "primary" },
  approved: { label: "Approved", color: "success" },
  rejected: { label: "Rejected", color: "error" },
  consent_pending: { label: "Consent Pending", color: "warning" },
  disbursement_pending: { label: "Disbursement Pending", color: "info" },
  disbursed: { label: "Disbursed", color: "success" },
};

const emiStatusConfig: Record<EmiStatus, { label: string; color: "primary" | "success" | "error" | "warning" | "info" }> = {
  paid: { label: "Paid", color: "success" },
  pending: { label: "Pending", color: "warning" },
  overdue: { label: "Overdue", color: "error" },
  upcoming: { label: "Upcoming", color: "info" },
};

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const config = leadStatusConfig[status];
  return <Badge size="sm" color={config.color}>{config.label}</Badge>;
}

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  const config = applicationStatusConfig[status];
  return <Badge size="sm" color={config.color}>{config.label}</Badge>;
}

export function ApplicationTabStatusBadge({ status }: { status: ApplicationStatus }) {
  const tabStatus = getApplicationTabStatus(status);
  const config = applicationStatusConfig[tabStatus];
  return <Badge size="sm" color={config.color}>{config.label}</Badge>;
}

export function formatEmiPlan(emiAmount: number, tenure: number): string {
  return `${formatCurrency(emiAmount)}/mo × ${tenure} mo`;
}

export function EmiStatusBadge({ status }: { status: EmiStatus }) {
  const config = emiStatusConfig[status];
  return <Badge size="sm" color={config.color}>{config.label}</Badge>;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
