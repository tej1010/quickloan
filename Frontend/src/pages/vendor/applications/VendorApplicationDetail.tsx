import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../../components/common/PageMeta";
import PageHeader from "../../../components/fintech/PageHeader";
import ComponentCard from "../../../components/common/ComponentCard";
import {
  ApplicationStatusBadge,
  ApplicationTabStatusBadge,
  formatCurrency,
  formatDate,
  formatEmiPlan,
} from "../../../components/fintech/StatusBadge";
import Badge from "../../../components/ui/badge/Badge";
import Button from "../../../components/ui/button/Button";
import { vendorService } from "../../../services/vendorService";
import type { ApplicationDetail } from "../../../types";
import {
  applicationSubStatusLabels,
  applicationTabDescriptions,
  getApplicationTabStatus,
} from "../../../utils/applicationStatus";

const draftStepLabels = [
  "Employment",
  "Mobile",
  "OTP",
  "KYC Upload",
  "Details",
  "CIBIL",
  "Product",
  "EMI Plan",
  "Loan Summary",
  "KFS Review",
  "Terms",
  "Consent",
  "NACH",
];

export default function VendorApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState<ApplicationDetail | null>(null);

  useEffect(() => {
    if (id) vendorService.getApplicationById(id).then(setApp);
  }, [id]);

  if (!app) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        {id ? "Loading..." : "Application not found"}
      </div>
    );
  }

  const tabStatus = getApplicationTabStatus(app.status);
  const subStatus = applicationSubStatusLabels[app.status];

  return (
    <>
      <PageMeta title={`${app.applicationNo} | Application`} description="Application details" />
      <PageHeader
        title={app.applicationNo}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {app.status === "draft" && (
              <Button
                size="sm"
                onClick={() => navigate(`/vendor/applications/new?draft=${app.id}`)}
              >
                Resume Application
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => navigate("/vendor/applications")}>
              Back to Applications
            </Button>
          </div>
        }
      />

      <div className="mb-6 p-4 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-gray-800 dark:text-white/90">{app.customerName}</p>
            <p className="text-sm text-gray-500">{app.productName}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ApplicationTabStatusBadge status={app.status} />
            {subStatus && <Badge color="warning" size="sm">{subStatus}</Badge>}
          </div>
        </div>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          {applicationTabDescriptions[tabStatus]}
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <ComponentCard title="Application Summary">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-gray-500">Application Date</p>
                <p className="font-medium">{formatDate(app.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Loan Amount</p>
                <p className="font-medium">{formatCurrency(app.loanAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">EMI Plan</p>
                <p className="font-medium">{formatEmiPlan(app.emiAmount, app.tenure)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Interest Rate</p>
                <p className="font-medium">{app.interestRate}% p.a.</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Processing Fee</p>
                <p className="font-medium">{formatCurrency(app.product.processingFee)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <ApplicationStatusBadge status={app.status} />
              </div>
            </div>
          </ComponentCard>

          <ComponentCard title="Customer Information">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                ["Name", app.customer.name],
                ["Mobile", `+91 ${app.customer.mobile}`],
                ["Email", app.customer.email],
                ["PAN", app.customer.pan],
                ["Aadhaar", app.customer.aadhaar],
                ["Address", app.customer.address],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">{value}</p>
                </div>
              ))}
            </div>
          </ComponentCard>

          <ComponentCard title="KYC Documents">
            <div className="space-y-3">
              {app.kycDocuments.map((doc) => (
                <div
                  key={doc.name}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-800"
                >
                  <span className="text-sm text-gray-800 dark:text-white/90">{doc.name}</span>
                  <Badge color={doc.status === "verified" ? "success" : "warning"} size="sm">
                    {doc.status}
                  </Badge>
                </div>
              ))}
            </div>
          </ComponentCard>

          {app.consentLogs.length > 0 && (
            <ComponentCard title="Consent Logs">
              <div className="space-y-3">
                {app.consentLogs.map((log, i) => (
                  <div key={i} className="flex justify-between gap-4 text-sm">
                    <span className="text-gray-800 dark:text-white/90">{log.action}</span>
                    <div className="text-right shrink-0">
                      <p className="text-gray-500">{formatDate(log.timestamp)}</p>
                      <p className="text-xs text-gray-400">{log.ip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ComponentCard>
          )}
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          {app.status === "draft" && (
            <ComponentCard title="Continue Application">
              <p className="text-sm text-gray-500 mb-4">
                This application was saved as a draft. Resume where you left off to complete and submit.
              </p>
              {app.draftProgress && (
                <p className="text-xs text-gray-400 mb-4">
                  Last step: {draftStepLabels[app.draftProgress.step] || "In progress"}
                </p>
              )}
              <Button
                className="w-full"
                onClick={() => navigate(`/vendor/applications/new?draft=${app.id}`)}
              >
                Resume Application
              </Button>
            </ComponentCard>
          )}

          <ComponentCard title="Product">
            <p className="text-sm font-medium">{app.product.name}</p>
            <p className="text-xs text-gray-500 mt-1">{app.product.category}</p>
            <p className="text-sm font-semibold text-brand-600 mt-3">
              {formatCurrency(app.loanAmount)}
            </p>
          </ComponentCard>

          <ComponentCard title="NACH Status">
            <Badge color={app.nachStatus === "active" ? "success" : "warning"}>
              {app.nachStatus}
            </Badge>
          </ComponentCard>

          <ComponentCard title="Disbursement">
            <Badge
              color={
                app.disbursementStatus === "completed"
                  ? "success"
                  : app.disbursementStatus === "failed"
                    ? "error"
                    : "info"
              }
            >
              {app.disbursementStatus}
            </Badge>
            {app.disbursementUtr && (
              <p className="mt-2 text-xs text-gray-500">UTR: {app.disbursementUtr}</p>
            )}
            {app.status === "disbursed" && (
              <p className="mt-2 text-xs text-success-600">
                Loan amount credited to vendor&apos;s bank account
              </p>
            )}
          </ComponentCard>

          {app.status === "rejected" && (
            <ComponentCard title="Rejection">
              <p className="text-sm text-error-600">
                Application rejected due to CIBIL assessment or admin review.
              </p>
            </ComponentCard>
          )}
        </div>
      </div>
    </>
  );
}
