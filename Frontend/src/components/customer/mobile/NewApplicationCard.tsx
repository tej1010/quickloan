import { useNavigate } from "react-router";

export default function NewApplicationCard() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/customer/apply?new=1")}
      className="w-full text-left p-5 rounded-3xl bg-gradient-to-br from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-500/25 active:scale-[0.99] transition-transform"
    >
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 text-2xl shrink-0">
          📱
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/80">New Application</p>
          <p className="mt-1 text-lg font-bold">Apply for a Device Loan</p>
          <p className="mt-1 text-sm text-white/80">
            Start a fresh application — choose your device, upload KYC, and get an EMI plan.
          </p>
        </div>
        <svg className="w-5 h-5 text-white shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}
