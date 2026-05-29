import { formatINR, formatDateShort } from "../../../components/customer/mobile/utils";
import type { CustomerLoan } from "../../../types";

function DetailRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span className={`font-semibold text-right ${highlight ? "text-brand-600" : "text-gray-900"}`}>
        {value}
      </span>
    </div>
  );
}

export default function LoanDetailsBreakdown({ loan }: { loan: CustomerLoan }) {
  const totalOtherCharges = loan.otherCharges.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="space-y-4">
      <div className="p-4 bg-white rounded-2xl ring-1 ring-gray-100">
        <p className="mb-3 text-xs font-medium tracking-wide text-gray-400 uppercase">Product</p>
        <p className="text-base font-bold text-gray-900">{loan.productName}</p>
        <p className="text-sm text-gray-500">{loan.productModel}</p>
      </div>

      <div className="p-4 space-y-3 bg-white rounded-2xl ring-1 ring-gray-100">
        <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">Loan Amount (MRP)</p>
        <DetailRow label="Product Price (MRP)" value={formatINR(loan.loanAmount)} />
        <DetailRow label="Processing Fee" value={formatINR(loan.processingFee)} />

        <div className="pt-2 border-t border-gray-100">
          <p className="mb-2 text-xs text-gray-400">Other Charges</p>
          <div className="space-y-2">
            {loan.otherCharges.map((charge) => (
              <DetailRow key={charge.label} label={charge.label} value={formatINR(charge.amount)} />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-gray-500">Total Other Charges</span>
            <span className="font-semibold text-gray-900">{formatINR(totalOtherCharges)}</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3 bg-white rounded-2xl ring-1 ring-gray-100">
        <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">Repayment Terms</p>
        <DetailRow label="Monthly EMI" value={formatINR(loan.emiAmount)} />
        <DetailRow label="Loan Tenure" value={`${loan.tenure} months`} />
        <DetailRow label="Annual Interest Rate" value={`${loan.interestRate}% p.a.`} />
        <DetailRow label="Effective APR" value={`${loan.effectiveApr}%`} />
        <DetailRow label="First EMI Date" value={formatDateShort(loan.firstEmiDate)} />
        <DetailRow label="Final EMI Date" value={formatDateShort(loan.finalEmiDate)} />
      </div>

      <div className="p-4 bg-brand-50 rounded-2xl ring-1 ring-brand-100">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Total Amount Payable</span>
          <span className="text-lg font-bold text-brand-600">{formatINR(loan.totalPayable)}</span>
        </div>
        <p className="mt-1 text-xs text-gray-500">Principal + interest + all fees</p>
      </div>

      <div className="p-4 space-y-3 bg-amber-50 rounded-2xl ring-1 ring-amber-100">
        <p className="text-xs font-medium tracking-wide text-amber-700 uppercase">Late Payment Charges</p>
        <DetailRow label="Per Day" value={formatINR(loan.latePaymentChargePerDay)} />
        <DetailRow label="Per Month" value={formatINR(loan.latePaymentChargePerMonth)} />
      </div>
    </div>
  );
}
