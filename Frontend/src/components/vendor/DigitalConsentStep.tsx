import { useState } from "react";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Badge from "../ui/badge/Badge";
import {
  sendConsentOtp,
  verifyConsentOtp,
  createConsentAuditLog,
  type ConsentAuditLog,
} from "../../services/loanApplicationService";

const DEMO_OTP = "123456";

interface DigitalConsentStepProps {
  loanId: string;
  customerName: string;
  mobile: string;
  onConsentComplete: (log: ConsentAuditLog) => void;
}

export default function DigitalConsentStep({
  loanId,
  customerName,
  mobile,
  onConsentComplete,
}: DigitalConsentStepProps) {
  const [phase, setPhase] = useState<"idle" | "otp_sent" | "verified">("idle");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [auditLog, setAuditLog] = useState<ConsentAuditLog | null>(null);

  const handleSendOtp = async () => {
    setError("");
    setLoading(true);
    const result = await sendConsentOtp(mobile);
    setLoading(false);
    if (!result.sent) {
      setError(result.message);
      return;
    }
    setPhase("otp_sent");
  };

  const handleVerifyOtp = async () => {
    setError("");
    if (otp.length !== 6) {
      setError("Enter a valid 6-digit OTP");
      return;
    }
    setLoading(true);
    const valid = await verifyConsentOtp(otp);
    if (!valid) {
      setLoading(false);
      setError(`Invalid OTP. Use ${DEMO_OTP} for demo.`);
      return;
    }
    const log = await createConsentAuditLog(loanId, customerName, mobile, otp);
    setAuditLog(log);
    setPhase("verified");
    setLoading(false);
    onConsentComplete(log);
  };

  if (phase === "verified" && auditLog) {
    return (
      <div className="space-y-4 max-w-lg">
        <div className="p-4 rounded-xl bg-success-50 dark:bg-success-500/10 text-center">
          <Badge color="success" size="sm">Consent Recorded</Badge>
          <p className="text-sm font-medium text-success-700 dark:text-success-500 mt-2">
            Digital consent verified successfully
          </p>
        </div>

        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 space-y-3">
          <p className="text-xs font-medium text-gray-500 uppercase">Consent Audit Log</p>
          {[
            ["Customer", auditLog.customerName],
            ["Loan ID", auditLog.loanId],
            ["Mobile", `+91 ${auditLog.mobile}`],
            ["OTP Hash", auditLog.otpHash],
            ["Timestamp", new Date(auditLog.timestamp).toLocaleString("en-IN")],
            ["Timezone", auditLog.timezone],
            ["IP Address", auditLog.ipAddress],
            ["Browser", auditLog.browser],
            ["OS", auditLog.os],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between text-sm gap-4">
              <span className="text-gray-500 shrink-0">{label}</span>
              <span className="font-medium text-gray-800 dark:text-white/90 text-right break-all">
                {value}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500 text-center">
          This log serves as legally admissible proof of customer agreement to KFS and Terms &amp; Conditions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-md">
      <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Collect the customer&apos;s legally binding digital consent. An OTP will be sent to their registered mobile number for verification.
        </p>
      </div>

      <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 space-y-2">
        <p className="text-xs text-gray-500">Customer</p>
        <p className="font-medium text-gray-800 dark:text-white/90">{customerName}</p>
        <p className="text-sm text-gray-500">+91 {mobile.replace(/\D/g, "")}</p>
        <p className="text-xs text-gray-400">Loan ID: {loanId}</p>
      </div>

      {error && <p className="text-sm text-error-500">{error}</p>}

      {phase === "idle" && (
        <Button onClick={handleSendOtp} disabled={loading} className="w-full">
          {loading ? "Sending OTP..." : "I Agree and Confirm"}
        </Button>
      )}

      {phase === "otp_sent" && (
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-success-50 dark:bg-success-500/10">
            <p className="text-sm text-success-700 dark:text-success-500">
              OTP sent to +91 {mobile.replace(/\D/g, "")}
            </p>
            <p className="text-xs text-gray-500 mt-1">Demo OTP: {DEMO_OTP}</p>
          </div>
          <div>
            <Label>Enter OTP <span className="text-error-500">*</span></Label>
            <Input
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            />
          </div>
          <Button onClick={handleVerifyOtp} disabled={loading || otp.length !== 6} className="w-full">
            {loading ? "Verifying..." : "Verify OTP & Confirm Consent"}
          </Button>
        </div>
      )}
    </div>
  );
}
