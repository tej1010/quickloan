import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../../components/common/PageMeta";
import MobileHeader from "../../../components/customer/mobile/MobileHeader";
import StickyCTA from "../../../components/customer/mobile/StickyCTA";
import { formatINR } from "../../../components/customer/mobile/utils";
import { customerService } from "../../../services/customerService";
import { mockCustomerLoans } from "../../../services/mockData";
import type { PaymentMethod } from "../../../types";

const methods: { id: PaymentMethod; label: string; icon: string }[] = [
  { id: "upi", label: "UPI", icon: "📲" },
  { id: "net_banking", label: "Net Banking", icon: "🏦" },
  { id: "debit_card", label: "Debit Card", icon: "💳" },
];

export default function CustomerPayEmi() {
  const loan = mockCustomerLoans[0];
  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [paymentType, setPaymentType] = useState<"emi" | "foreclosure">("emi");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const emiAmount = loan.emiAmount;
  const lateFee = loan.lateCharges ?? 0;
  const convenienceFee = 0;
  const total = paymentType === "emi" ? emiAmount + lateFee + convenienceFee : loan.outstandingAmount;

  const handlePay = async () => {
    setLoading(true);
    const receipt = await customerService.payEmi("1", total, method);
    setLoading(false);
    navigate("/customer/payment-success", { state: receipt });
  };

  return (
    <>
      <PageMeta title="Pay EMI | Fintech" description="Pay your EMI" />
      <MobileHeader title="Pay EMI" showBack />

      <div className="px-5 pb-32">
        <div className="flex gap-2 p-1 mb-6 bg-gray-100 rounded-2xl">
          {(["emi", "foreclosure"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setPaymentType(t)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
                paymentType === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
              }`}
            >
              {t === "emi" ? "EMI Payment" : "Foreclose"}
            </button>
          ))}
        </div>

        <div className="py-8 text-center">
          <p className="text-sm text-gray-500">Amount to pay</p>
          <p className="mt-1 text-5xl font-bold text-gray-900 tracking-tight">{formatINR(total)}</p>
        </div>

        <div className="p-4 mb-6 space-y-3 bg-white rounded-2xl ring-1 ring-gray-100">
          <p className="text-xs font-medium text-gray-400 uppercase">Breakdown</p>
          {paymentType === "emi" ? (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">EMI Amount</span>
                <span className="font-medium">{formatINR(emiAmount)}</span>
              </div>
              {lateFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Late Fee</span>
                  <span className="font-medium text-red-500">{formatINR(lateFee)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Convenience Fee</span>
                <span className="font-medium text-emerald-600">FREE</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Outstanding Amount</span>
              <span className="font-medium">{formatINR(loan.outstandingAmount)}</span>
            </div>
          )}
          <div className="pt-3 border-t border-gray-100 flex justify-between">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="font-bold text-brand-600">{formatINR(total)}</span>
          </div>
        </div>

        <p className="mb-3 text-sm font-semibold text-gray-900">Payment Method</p>
        <div className="space-y-3">
          {methods.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethod(m.id)}
              className={`flex items-center gap-4 w-full p-4 rounded-2xl ring-1 transition-all ${
                method === m.id
                  ? "bg-brand-50 ring-brand-300 shadow-sm"
                  : "bg-white ring-gray-100"
              }`}
            >
              <span className="text-2xl">{m.icon}</span>
              <span className="flex-1 text-left font-semibold text-gray-900">{m.label}</span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                method === m.id ? "border-brand-600 bg-brand-600" : "border-gray-300"
              }`}>
                {method === m.id && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      <StickyCTA label="Pay Now" onClick={handlePay} loading={loading} />
    </>
  );
}
