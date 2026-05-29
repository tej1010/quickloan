import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../../context/AuthContext";

export default function CustomerLoginForm() {
  const [searchParams] = useSearchParams();
  const applyId = searchParams.get("apply");
  const mobileFromLink = searchParams.get("mobile") || "";
  const linkedMobile = mobileFromLink.replace(/\D/g, "").slice(0, 10);
  const isQrFlow = !!(applyId && linkedMobile);

  const [mobile, setMobile] = useState(linkedMobile);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"mobile" | "otp">(isQrFlow ? "otp" : "mobile");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { sendCustomerOtp, verifyCustomerOtp, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user?.role === "customer" && applyId) {
      navigate(`/customer/apply?apply=${applyId}`, { replace: true });
    }
  }, [isAuthenticated, user, applyId, navigate]);

  useEffect(() => {
    if (!isQrFlow || step !== "otp") return;
    sendCustomerOtp(linkedMobile).catch(() => {
      setStep("mobile");
    });
  }, [isQrFlow, linkedMobile, sendCustomerOtp, step]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (isQrFlow && mobile !== linkedMobile) {
      setError("Use the mobile number linked to this QR application");
      return;
    }
    setLoading(true);
    try {
      await sendCustomerOtp(mobile);
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (isQrFlow && mobile !== linkedMobile) {
      setError("This application link is for a different mobile number");
      return;
    }
    setLoading(true);
    try {
      await verifyCustomerOtp(mobile, otp);
      if (applyId) {
        navigate(`/customer/apply?apply=${applyId}`, { replace: true });
      } else {
        navigate("/customer/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-app flex flex-col min-h-screen bg-gradient-to-b from-brand-600 via-brand-500 to-[#f5f6fa]">
      <div className="flex-1 px-6 pt-16 pb-8">
        <div className="mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 mb-6 rounded-2xl bg-white/20 backdrop-blur">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Quick Loan</h1>
          <p className="mt-2 text-brand-100 text-sm">Manage your device loan & EMIs in one place</p>
        </div>

        <div className="p-6 bg-white rounded-3xl shadow-xl shadow-brand-900/10">
          {applyId && (
            <div className="p-3 mb-4 text-sm rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
              {isQrFlow
                ? `Continue your loan application for +91 ${linkedMobile}. Verify OTP to proceed.`
                : "Continue your loan application shared by the vendor."}
            </div>
          )}
          <h2 className="text-lg font-semibold text-gray-900">
            {step === "mobile" ? "Enter mobile number" : "Verify OTP"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {step === "mobile"
              ? "We'll send a 6-digit code to verify you"
              : `Code sent to +91 ${mobile}`}
          </p>

          {step === "mobile" ? (
            <form onSubmit={handleSendOtp} className="mt-6 space-y-5">
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Mobile</label>
                <div className="flex items-center gap-2 mt-2 px-4 py-3.5 bg-gray-50 rounded-2xl ring-1 ring-gray-100 focus-within:ring-brand-300">
                  <span className="text-gray-500 font-medium">+91</span>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={mobile}
                    readOnly={isQrFlow}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className={`flex-1 text-lg font-semibold text-gray-900 bg-transparent outline-none placeholder:text-gray-300 ${isQrFlow ? "opacity-80" : ""}`}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || mobile.length !== 10}
                className="w-full py-4 text-base font-semibold text-white rounded-2xl bg-brand-600 disabled:opacity-40 active:scale-[0.98] transition-transform"
              >
                {loading ? "Sending..." : "Continue"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="mt-6 space-y-5">
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">OTP</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="• • • • • •"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full mt-2 px-4 py-4 text-2xl font-bold tracking-[0.5em] text-center text-gray-900 bg-gray-50 rounded-2xl ring-1 ring-gray-100 outline-none focus:ring-brand-300"
                />
              </div>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-4 text-base font-semibold text-white rounded-2xl bg-brand-600 disabled:opacity-40"
              >
                {loading ? "Verifying..." : "Verify & Continue Application"}
              </button>
              {!isQrFlow && (
                <button type="button" onClick={() => setStep("mobile")} className="w-full text-sm text-brand-600 font-medium">
                  Change number
                </button>
              )}
            </form>
          )}
          <p className="mt-4 text-xs text-center text-gray-400">Demo OTP: 123456</p>
        </div>
      </div>
    </div>
  );
}
