import { Link } from "react-router";
import type { IncompleteLoanApplication } from "../../../types";
import { formatINR } from "./utils";

interface IncompleteApplicationCardProps {
  application: IncompleteLoanApplication;
  compact?: boolean;
}

const VENDOR_STEPS = ["KYC", "Details", "Summary", "KFS", "Terms", "Consent"];
const SELF_STEPS = ["Product", ...VENDOR_STEPS];

export default function IncompleteApplicationCard({ application, compact }: IncompleteApplicationCardProps) {
  const steps = application.isSelfInitiated ? SELF_STEPS : VENDOR_STEPS;
  const progress = Math.min(application.progressStep, steps.length - 1);
  const hasProduct = application.productName.trim() && application.productModel.trim();
  const resumePath = application.isSelfInitiated
    ? "/customer/apply"
    : `/customer/apply?apply=${application.sessionId}`;

  return (
    <Link
      to={resumePath}
      className={`block rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 ring-1 ring-amber-200 active:scale-[0.99] transition-transform ${
        compact ? "p-4" : "p-5"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-amber-100 text-xl shrink-0">
          ⚠️
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
            Loan Process Incomplete
          </p>
          <p className="mt-1 font-semibold text-gray-900 truncate">
            {hasProduct
              ? `${application.productName} ${application.productModel}`
              : "Device loan application in progress"}
          </p>
          <p className="text-sm text-gray-600 mt-0.5">
            {application.loanAmount > 0
              ? `${formatINR(application.loanAmount)} · ${application.tenure} mo EMI`
              : `${application.tenure} month tenure · add device details`}
          </p>
          {!compact && (
            <p className="text-xs text-gray-500 mt-2">
              {application.isSelfInitiated
                ? "Complete product details, KYC, and loan consent to submit."
                : `Started at ${application.vendorName}. Complete KYC, review loan terms, and confirm consent.`}
            </p>
          )}
          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-amber-700 mb-1">
              <span>Step {progress + 1} of {steps.length}</span>
              <span>Tap to continue</span>
            </div>
            <div className="h-1.5 rounded-full bg-amber-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-amber-500 transition-all"
                style={{ width: `${((progress + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
        <svg className="w-5 h-5 text-amber-600 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
