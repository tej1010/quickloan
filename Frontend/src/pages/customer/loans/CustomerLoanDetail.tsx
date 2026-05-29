import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../../components/common/PageMeta";
import MobileHeader from "../../../components/customer/mobile/MobileHeader";
import ProgressRing from "../../../components/customer/mobile/ProgressRing";
import StatusChip from "../../../components/customer/mobile/StatusChip";
import LoanDetailsBreakdown from "../../../components/customer/mobile/LoanDetailsBreakdown";
import { formatINR, formatDateShort } from "../../../components/customer/mobile/utils";
import { customerService } from "../../../services/customerService";
import type { CustomerLoan } from "../../../types";

export default function CustomerLoanDetail() {
  const { id } = useParams();
  const [loan, setLoan] = useState<CustomerLoan | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) customerService.getLoanById(id).then((l) => setLoan(l || null));
  }, [id]);

  if (!loan) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 rounded-full border-brand-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const chipVariant = loan.status === "closed" ? "closed" : "active";

  return (
    <>
      <PageMeta title={`${loan.productName} | Loan`} description="Loan details" />
      <MobileHeader title="Loan Details" showBack />

      <div className="px-5 -mt-2">
        <div className="flex items-center gap-4 p-5 bg-white rounded-3xl shadow-sm ring-1 ring-gray-100">
          {loan.device?.image && (
            <img src={loan.device.image} alt="" className="w-20 h-20 object-cover rounded-2xl" />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">{loan.productName}</h2>
              <StatusChip variant={chipVariant} />
            </div>
            <p className="text-sm text-gray-500">{loan.loanNo}</p>
            <p className="text-2xl font-bold text-brand-600 mt-1">{formatINR(loan.outstandingAmount)}</p>
            <p className="text-xs text-gray-400">outstanding</p>
          </div>
        </div>
      </div>

      <div className="px-5 mt-5">
        <p className="mb-3 text-sm font-semibold text-gray-900">Complete Loan Details</p>
        <LoanDetailsBreakdown loan={loan} />
      </div>

      {loan.device && (
        <div className="px-5 mt-5">
          <p className="mb-3 text-sm font-semibold text-gray-900">Device Details</p>
          <div className="p-4 space-y-3 bg-white rounded-2xl ring-1 ring-gray-100">
            {[
              ["Brand", loan.device.brand],
              ["Model", loan.device.model],
              ["IMEI", loan.device.imei],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-gray-500">{k}</span>
                <span className="font-medium text-gray-900">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-5 mt-5">
        <p className="mb-3 text-sm font-semibold text-gray-900">Repayment Summary</p>
        <div className="flex items-center gap-4 p-4 bg-white rounded-2xl ring-1 ring-gray-100">
          <ProgressRing value={loan.paidEmis} max={loan.tenure} size={72} stroke={7} />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Paid</span>
              <span className="font-semibold">{formatINR(loan.paidAmount ?? loan.emiAmount * loan.paidEmis)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Outstanding</span>
              <span className="font-semibold text-brand-600">{formatINR(loan.outstandingAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Next EMI</span>
              <span className="font-semibold">{formatINR(loan.emiAmount)} · {formatDateShort(loan.nextEmiDate)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 mt-6 pb-8 space-y-3">
        {loan.status === "active" && (
          <button
            onClick={() => navigate("/customer/pay-emi")}
            className="w-full py-4 text-sm font-semibold text-white rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500"
          >
            Pay EMI
          </button>
        )}
        <button
          onClick={() => navigate(`/customer/loans/${loan.id}/schedule`)}
          className="w-full py-4 text-sm font-semibold text-brand-600 bg-brand-50 rounded-2xl"
        >
          View EMI Schedule
        </button>
        <button
          onClick={() => navigate("/customer/documents")}
          className="w-full py-4 text-sm font-semibold text-gray-700 bg-gray-100 rounded-2xl"
        >
          Download Documents
        </button>
      </div>
    </>
  );
}
