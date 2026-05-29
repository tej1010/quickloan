import { Link, useLocation } from "react-router";
import PageMeta from "../../../components/common/PageMeta";
import { formatINR, formatDateShort, formatDateTime } from "../../../components/customer/mobile/utils";
import type { PaymentReceipt } from "../../../types";

export default function CustomerPaymentSuccess() {
  const { state } = useLocation();
  const receipt = state as PaymentReceipt | undefined;

  if (!receipt) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center">
        <p className="text-gray-500">No payment data found</p>
        <Link to="/customer/dashboard" className="mt-4 text-brand-600 font-semibold">Go to Home</Link>
      </div>
    );
  }

  return (
    <>
      <PageMeta title="Payment Success | Fintech" description="Payment successful" />
      <div className="flex flex-col items-center min-h-screen px-5 pt-16 pb-8 bg-gradient-to-b from-emerald-50 to-[#f5f6fa]">
        <div className="customer-success-pop flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-emerald-100">
          <svg className="w-12 h-12 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">Payment Successful!</h1>
        <p className="mt-1 text-4xl font-bold text-emerald-600">{formatINR(receipt.amount)}</p>

        <div className="w-full p-5 mt-8 space-y-4 bg-white rounded-3xl shadow-sm ring-1 ring-gray-100">
          {[
            ["Transaction ID", receipt.transactionId],
            ["Date & Time", formatDateTime(receipt.paymentDate)],
            ["Payment Method", receipt.paymentMethod.replace("_", " ").toUpperCase()],
            ["Loan", receipt.loanNo],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-gray-500">{label}</span>
              <span className="font-semibold text-gray-900 text-right max-w-[60%] truncate">{value}</span>
            </div>
          ))}
        </div>

        {receipt.nextEmiDate && (
          <div className="w-full p-4 mt-4 text-center bg-brand-50 rounded-2xl ring-1 ring-brand-100">
            <p className="text-xs text-brand-600 font-medium uppercase">Next EMI</p>
            <p className="text-sm font-semibold text-gray-900 mt-1">{formatDateShort(receipt.nextEmiDate)}</p>
          </div>
        )}

        <div className="w-full mt-auto space-y-3 pt-8">
          <button
            onClick={() => alert("Downloading receipt...")}
            className="w-full py-4 text-sm font-semibold text-brand-600 bg-white rounded-2xl ring-1 ring-brand-200"
          >
            Download Receipt
          </button>
          <Link
            to="/customer/dashboard"
            className="block w-full py-4 text-sm font-semibold text-center text-white rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </>
  );
}
