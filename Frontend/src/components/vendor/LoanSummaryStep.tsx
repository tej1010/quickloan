import { formatCurrency } from "../fintech/StatusBadge";
import type { LoanSummary } from "../../services/loanApplicationService";

interface LoanSummaryStepProps {
  summary: LoanSummary;
}

export default function LoanSummaryStep({ summary }: LoanSummaryStepProps) {
  return (
    <div className="space-y-5 max-w-2xl">
      <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-500/10">
        <p className="text-xs text-gray-500 uppercase tracking-wide">Product</p>
        <p className="text-lg font-semibold text-gray-900 dark:text-white/90">
          {summary.productName} {summary.productModel}
        </p>
        <p className="text-sm text-brand-600 font-medium mt-1">
          MRP: {formatCurrency(summary.productPrice)}
        </p>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-500 uppercase mb-3">Applicable Charges</p>
        <div className="space-y-2">
          {summary.charges.map((charge) => (
            <div
              key={charge.label}
              className="flex justify-between text-sm p-3 rounded-lg border border-gray-100 dark:border-gray-800"
            >
              <span className="text-gray-600 dark:text-gray-400">{charge.label}</span>
              <span className="font-medium text-gray-800 dark:text-white/90">
                {formatCurrency(charge.amount)}
              </span>
            </div>
          ))}
          <div className="flex justify-between text-sm p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 font-medium">
            <span className="text-gray-700 dark:text-gray-300">Total Fees & Charges</span>
            <span>{formatCurrency(summary.totalFees)}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          ["Monthly EMI", formatCurrency(summary.monthlyEmi)],
          ["Loan Tenure", `${summary.tenureMonths} months`],
          ["Annual Interest Rate", `${summary.annualInterestRate}% p.a.`],
          ["Effective APR", `${summary.effectiveApr}%`],
          ["Total Interest", formatCurrency(summary.totalInterest)],
          ["First EMI Due Date", new Date(summary.firstEmiDueDate).toLocaleDateString("en-IN")],
        ].map(([label, value]) => (
          <div key={label} className="p-3 rounded-lg border border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-white/90 mt-0.5">{value}</p>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl border-2 border-brand-200 dark:border-brand-500/30 bg-brand-50/50 dark:bg-brand-500/5">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Total Amount Payable
          </span>
          <span className="text-xl font-bold text-brand-600">
            {formatCurrency(summary.totalPayable)}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Principal + interest + all fees</p>
      </div>

      <div className="p-4 rounded-xl bg-warning-50 dark:bg-warning-500/10">
        <p className="text-xs font-medium text-gray-500 uppercase mb-2">Late Payment Charges</p>
        <div className="grid gap-2 sm:grid-cols-2 text-sm">
          <div>
            <span className="text-gray-500">Per Day: </span>
            <span className="font-medium">{formatCurrency(summary.latePaymentChargePerDay)}</span>
          </div>
          <div>
            <span className="text-gray-500">Per Month: </span>
            <span className="font-medium">{formatCurrency(summary.latePaymentChargePerMonth)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
