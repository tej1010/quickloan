import { useEffect, useState } from "react";
import { Link } from "react-router";
import PageMeta from "../../../components/common/PageMeta";
import StatusChip from "../../../components/customer/mobile/StatusChip";
import IncompleteApplicationCard from "../../../components/customer/mobile/IncompleteApplicationCard";
import { LoanListSkeleton } from "../../../components/customer/mobile/Skeleton";
import { formatINR } from "../../../components/customer/mobile/utils";
import { useAuth } from "../../../context/AuthContext";
import { customerService } from "../../../services/customerService";
import { customerApplicationService } from "../../../services/customerApplicationService";
import type { CustomerLoan, IncompleteLoanApplication } from "../../../types";

function getLoanChip(loan: CustomerLoan) {
  if (loan.status === "closed") return "closed" as const;
  if ((loan.lateCharges ?? 0) > 0) return "overdue" as const;
  return "active" as const;
}

export default function CustomerLoans() {
  const { user } = useAuth();
  const [loans, setLoans] = useState<CustomerLoan[]>([]);
  const [incompleteApp, setIncompleteApp] = useState<IncompleteLoanApplication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [data, incomplete] = await Promise.all([
        customerService.getLoans(),
        user?.mobile
          ? customerApplicationService.getIncompleteApplication(user.mobile)
          : Promise.resolve(null),
      ]);
      setLoans(data);
      setIncompleteApp(incomplete);
      setLoading(false);
    };
    load();
  }, [user?.mobile]);

  return (
    <>
      <PageMeta title="My Loans | Quick Loan" description="Your loans" />
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">My Loans</h1>
        <p className="text-sm text-gray-500 mt-1">{loans.length} loan{loans.length !== 1 ? "s" : ""} found</p>
      </div>

      {incompleteApp && (
        <div className="px-5 mb-4">
          <IncompleteApplicationCard application={incompleteApp} compact />
        </div>
      )}

      {loading ? (
        <LoanListSkeleton />
      ) : loans.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
          <span className="text-5xl mb-4">📱</span>
          <p className="font-semibold text-gray-900">No loans yet</p>
          <p className="text-sm text-gray-500 mt-1">Your device loans will appear here</p>
        </div>
      ) : (
        <div className="px-5 space-y-4">
          {loans.map((loan) => (
            <Link
              key={loan.id}
              to={`/customer/loans/${loan.id}`}
              className="block p-4 bg-white rounded-3xl shadow-sm ring-1 ring-gray-100 active:scale-[0.99] transition-transform"
            >
              <div className="flex gap-4">
                <div className="w-16 h-16 shrink-0 overflow-hidden rounded-2xl bg-gray-50">
                  {loan.device?.image ? (
                    <img src={loan.device.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-2xl">📱</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-gray-900 truncate">{loan.productName}</p>
                    <StatusChip variant={getLoanChip(loan)} />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{loan.loanNo}</p>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase">Loan Amount</p>
                      <p className="text-sm font-semibold text-gray-800">{formatINR(loan.loanAmount)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase">Outstanding</p>
                      <p className="text-sm font-semibold text-gray-800">{formatINR(loan.outstandingAmount)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase">EMI</p>
                      <p className="text-sm font-semibold text-brand-600">{formatINR(loan.emiAmount)}/mo</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase">Progress</p>
                      <p className="text-sm font-semibold text-gray-800">{loan.paidEmis}/{loan.tenure} paid</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
