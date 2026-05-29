import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import PageMeta from "../../../components/common/PageMeta";
import PageHeader from "../../../components/fintech/PageHeader";
import StepWizard from "../../../components/fintech/StepWizard";
import CustomerDetailsForm, { validateCustomerDetails } from "../../../components/vendor/CustomerDetailsForm";
import DeviceDetailsForm, { validateDeviceDetails } from "../../../components/vendor/DeviceDetailsForm";
import EmploymentDetailsForm from "../../../components/vendor/EmploymentDetailsForm";
import LoanSummaryStep from "../../../components/vendor/LoanSummaryStep";
import KfsReviewStep from "../../../components/vendor/KfsReviewStep";
import TermsConditionsStep from "../../../components/vendor/TermsConditionsStep";
import DigitalConsentStep from "../../../components/vendor/DigitalConsentStep";
import CustomerApplicationLinkShare from "../../../components/vendor/CustomerApplicationLinkShare";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import FileInput from "../../../components/form/input/FileInput";
import Badge from "../../../components/ui/badge/Badge";
import { formatCurrency } from "../../../components/fintech/StatusBadge";
import {
  emptyCustomerDetails,
  mergeCustomerDetails,
  fetchCustomerByMobile,
  extractKycFromDocuments,
  verifyKycDocuments,
  generateCibilReport,
  validateEmploymentDetails,
  generateLoanId,
  generateApplicationSessionId,
  buildCustomerApplicationLink,
  calculateLoanSummary,
  generateKfsDocument,
  type CustomerApplicationDetails,
  type KycDocumentUpload,
  type CibilReport,
  type DeviceDetails,
  type EmploymentDetails,
  type LoanSummary,
  type ConsentAuditLog,
  emptyDeviceDetails,
  emptyEmploymentDetails,
} from "../../../services/loanApplicationService";
import { vendorService } from "../../../services/vendorService";
import { useAuth } from "../../../context/AuthContext";
import { saveVendorApplicationSession } from "../../../services/applicationSessionApi";
import { buildVendorSessionPayload } from "../../../services/vendorApplicationSession";

const loanSteps = [
  { id: 1, title: "Employment", description: "Customer employment and income details" },
  { id: 2, title: "Mobile", description: "Verify customer mobile number" },
  { id: 3, title: "OTP", description: "Verify OTP sent to customer mobile" },
  { id: 4, title: "KYC Upload", description: "Upload Aadhaar, PAN and address proof" },
  { id: 5, title: "Details", description: "Review details and verify KYC documents" },
  { id: 6, title: "CIBIL", description: "CIBIL report generated after KYC" },
  { id: 7, title: "Product", description: "Enter device purchase details" },
  { id: 8, title: "EMI Plan", description: "Choose EMI tenure based on invoice amount" },
  { id: 9, title: "Loan Summary", description: "Review product, charges, EMI and total payable" },
  { id: 10, title: "KFS Review", description: "Review Key Fact Statement as per RBI guidelines" },
  { id: 11, title: "Terms", description: "Read and accept loan agreement terms" },
  { id: 12, title: "Consent", description: "Digital consent via OTP verification" },
  { id: 13, title: "NACH", description: "NACH mandate setup" },
];

const DEMO_OTP = "123456";

export default function NewLoanApplication() {
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get("draft");
  const [step, setStep] = useState(0);
  const [employment, setEmployment] = useState<EmploymentDetails>(emptyEmploymentDetails());
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [kycDocs, setKycDocs] = useState<KycDocumentUpload[]>([
    { type: "aadhaar", fileName: "", uploaded: false },
    { type: "pan", fileName: "", uploaded: false },
    { type: "address_proof", fileName: "", uploaded: false },
  ]);
  const [customerDetails, setCustomerDetails] = useState<CustomerApplicationDetails>(emptyCustomerDetails());
  const [kycMessage, setKycMessage] = useState("");
  const [cibilReport, setCibilReport] = useState<CibilReport | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [device, setDevice] = useState<DeviceDetails>(emptyDeviceDetails());
  const [tenure, setTenure] = useState("12");
  const [loanId, setLoanId] = useState("");
  const [loanSummary, setLoanSummary] = useState<LoanSummary | null>(null);
  const [kfsScrolled, setKfsScrolled] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [consentComplete, setConsentComplete] = useState(false);
  const [consentLog, setConsentLog] = useState<ConsentAuditLog | null>(null);
  const [resumeApplicationNo, setResumeApplicationNo] = useState("");
  const [applicationSessionId, setApplicationSessionId] = useState("");
  const [initializing, setInitializing] = useState(!!draftId);
  const navigate = useNavigate();
  const { user: vendorUser } = useAuth();

  useEffect(() => {
    if (!applicationSessionId || !otpVerified || mobile.replace(/\D/g, "").length !== 10) return;

    saveVendorApplicationSession(
      buildVendorSessionPayload({
        sessionId: applicationSessionId,
        mobile,
        vendorName: vendorUser?.name ?? "Mobile World Electronics",
        vendorStep: step,
        applicationNo: resumeApplicationNo || undefined,
        customerDetails,
        device,
        tenure,
        loanSummary,
        loanId: loanId || undefined,
      }),
    );
  }, [
    applicationSessionId,
    otpVerified,
    mobile,
    step,
    customerDetails,
    device,
    tenure,
    loanSummary,
    loanId,
    resumeApplicationNo,
    vendorUser?.name,
  ]);

  useEffect(() => {
    if (!draftId) return;
    let active = true;
    vendorService.getDraftForResume(draftId).then((draft) => {
      if (!active) return;
      if (!draft) {
        setError("Draft application not found or no longer editable");
        setInitializing(false);
        return;
      }
      setEmployment(draft.employment);
      setMobile(draft.mobile);
      setOtpVerified(draft.otpVerified);
      if (draft.otpVerified) {
        setApplicationSessionId(generateApplicationSessionId());
      }
      setKycDocs(draft.kycDocs);
      setCustomerDetails(draft.customerDetails);
      setDevice(draft.device);
      setTenure(draft.tenure);
      setStep(draft.step);
      setResumeApplicationNo(draft.applicationNo);
      setInitializing(false);
    });
    return () => { active = false; };
  }, [draftId]);

  const loanAmount = Number(device.invoiceAmount) || 0;

  const kfsContent = useMemo(() => {
    if (!loanSummary) return "";
    return generateKfsDocument(loanSummary, customerDetails);
  }, [loanSummary, customerDetails]);

  const customerApplicationLink = useMemo(() => {
    if (!applicationSessionId || !mobile) return "";
    return buildCustomerApplicationLink(applicationSessionId, mobile);
  }, [applicationSessionId, mobile]);

  const handleKycUpload = (type: KycDocumentUpload["type"], file?: File) => {
    setKycDocs((docs) =>
      docs.map((d) =>
        d.type === type
          ? { ...d, uploaded: !!file, fileName: file?.name || "" }
          : d,
      ),
    );
  };

  const buildLoanSummary = () => {
    const id = loanId || generateLoanId();
    if (!loanId) setLoanId(id);
    const summary = calculateLoanSummary(device, Number(tenure), id);
    setLoanSummary(summary);
    return summary;
  };

  const handleNext = async () => {
    setError("");

    if (step === 0) {
      const empError = validateEmploymentDetails(employment);
      if (empError) {
        setError(empError);
        return;
      }
      setStep(1);
      return;
    }

    if (step === 1) {
      if (!/^\d{10}$/.test(mobile.replace(/\D/g, ""))) {
        setError("Enter a valid 10-digit mobile number");
        return;
      }
      setCustomerDetails(emptyCustomerDetails(mobile.replace(/\D/g, "")));
      setStep(2);
      return;
    }

    if (step === 2) {
      if (otp !== DEMO_OTP) {
        setError(`Invalid OTP. Use ${DEMO_OTP} for demo.`);
        return;
      }
      setLoading(true);
      const existing = await fetchCustomerByMobile(mobile.replace(/\D/g, ""));
      const base = emptyCustomerDetails(mobile.replace(/\D/g, ""));
      if (existing) {
        setCustomerDetails(mergeCustomerDetails(base, existing));
      } else {
        setCustomerDetails(base);
      }
      setOtpVerified(true);
      if (!applicationSessionId) {
        setApplicationSessionId(generateApplicationSessionId());
      }
      setLoading(false);
      setStep(3);
      return;
    }

    if (step === 3) {
      if (!kycDocs.every((d) => d.uploaded)) {
        setError("Please upload all KYC documents");
        return;
      }
      setExtracting(true);
      const extracted = await extractKycFromDocuments(kycDocs, mobile.replace(/\D/g, ""));
      setCustomerDetails((prev) => mergeCustomerDetails(prev, extracted));
      setExtracting(false);
      setStep(4);
      return;
    }

    if (step === 4) {
      const validationError = validateCustomerDetails(customerDetails);
      if (validationError) {
        setError(validationError);
        return;
      }
      setLoading(true);
      const result = await verifyKycDocuments(kycDocs);
      setLoading(false);
      if (!result.verified) {
        setError(result.message);
        return;
      }
      setKycMessage(result.message);
      setStep(5);
      return;
    }

    if (step === 5) {
      if (!cibilReport) {
        setLoading(true);
        const report = await generateCibilReport(customerDetails);
        setCibilReport(report);
        setLoading(false);
        return;
      }
      setStep(6);
      return;
    }

    if (step === 6) {
      if (!cibilReport) {
        setError("Generate CIBIL report before entering product details");
        return;
      }
      const deviceError = validateDeviceDetails(device, cibilReport.eligibleAmount);
      if (deviceError) {
        setError(deviceError);
        return;
      }
      setStep(7);
      return;
    }

    if (step === 7) {
      if (loanAmount <= 0) {
        setError("Complete device details with invoice amount first");
        return;
      }
      buildLoanSummary();
      setStep(8);
      return;
    }

    if (step === 8) {
      buildLoanSummary();
      setStep(9);
      return;
    }

    if (step === 9) {
      if (!kfsScrolled) {
        setError("Please scroll to the bottom of the KFS before proceeding");
        return;
      }
      setStep(10);
      return;
    }

    if (step === 10) {
      if (!termsAccepted) {
        setError("Please accept the Terms & Conditions and KFS");
        return;
      }
      setStep(11);
      return;
    }

    if (step === 11) {
      if (!consentComplete) {
        setError("Complete digital consent via OTP verification");
        return;
      }
      setStep(12);
      return;
    }

    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setError("");
    if (step === 9) setKfsScrolled(false);
    setStep((s) => Math.max(0, s - 1));
  };

  const handleSubmit = () => navigate("/vendor/applications");

  const getNextLabel = () => {
    if (step === 2) return "Verify OTP";
    if (step === 3) return extracting ? "Extracting..." : "Extract & Continue";
    if (step === 4) return loading ? "Verifying..." : "Verify & Continue";
    if (step === 5) {
      if (cibilReport) return "Continue";
      return loading ? "Generating..." : "Generate CIBIL";
    }
    if (step === 9) return "Proceed";
    if (step === 11 && consentComplete) return "Continue to NACH";
    return "Next";
  };

  return (
    <>
      <PageMeta
        title={draftId ? "Resume Application | Vendor" : "New Loan Application | Vendor"}
        description="Create new loan application"
      />
      <PageHeader title={draftId ? "Resume Application" : "New Loan Application"} />
      {initializing ? (
        <div className="py-20 text-center text-gray-500">Loading draft application...</div>
      ) : (
      <StepWizard
        steps={loanSteps}
        currentStep={step}
        onNext={handleNext}
        onBack={handleBack}
        isLastStep={step === loanSteps.length - 1}
        onSubmit={handleSubmit}
        nextLabel={getNextLabel()}
        isNextLoading={loading || extracting}
        nextDisabled={
          (step === 3 && !kycDocs.every((d) => d.uploaded)) ||
          (step === 9 && !kfsScrolled) ||
          (step === 10 && !termsAccepted) ||
          (step === 11 && !consentComplete) ||
          extracting
        }
      >
        {error && (
          <p className="mb-4 text-sm text-error-500">{error}</p>
        )}

        {resumeApplicationNo && (
          <div className="mb-4 p-3 rounded-lg bg-brand-50 dark:bg-brand-500/10">
            <p className="text-sm text-brand-700 dark:text-brand-400">
              Resuming draft <span className="font-semibold">{resumeApplicationNo}</span>
            </p>
          </div>
        )}

        {step === 0 && (
          <EmploymentDetailsForm employment={employment} onChange={setEmployment} />
        )}

        {step === 1 && (
          <div className="max-w-sm space-y-4">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Customer mobile will be verified via OTP. The same number will be linked to the application and auto-filled after KYC extraction.
              </p>
            </div>
            <div>
              <Label>Mobile Number <span className="text-error-500">*</span></Label>
              <Input
                type="tel"
                placeholder="9876543210"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-sm space-y-4">
            <div className="p-4 rounded-xl bg-success-50 dark:bg-success-500/10">
              <p className="text-sm text-success-700 dark:text-success-500">
                OTP sent to <span className="font-semibold">+91 {mobile}</span>
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
            {otpVerified && (
              <p className="text-xs text-success-600">Mobile verified. Share the customer link below or continue on this device.</p>
            )}
            {otpVerified && customerApplicationLink && (
              <CustomerApplicationLinkShare link={customerApplicationLink} mobile={mobile} />
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            {customerApplicationLink && (
              <CustomerApplicationLinkShare link={customerApplicationLink} mobile={mobile} />
            )}
            <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-500/10">
              <p className="text-sm text-brand-700 dark:text-brand-400">
                Upload KYC documents. Name, address, PAN and Aadhaar will be auto-extracted on the next step.
              </p>
            </div>
            {kycDocs.map((doc) => (
              <div key={doc.type}>
                <div className="flex items-center justify-between mb-1.5">
                  <Label className="capitalize">{doc.type.replace("_", " ")}</Label>
                  {doc.uploaded && <Badge color="success" size="sm">Uploaded</Badge>}
                </div>
                <FileInput
                  onChange={(e) => handleKycUpload(doc.type, e.target.files?.[0])}
                />
                {doc.fileName && (
                  <p className="mt-1 text-xs text-gray-500">{doc.fileName}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <p className="mb-3 text-sm font-medium text-gray-800 dark:text-white/90">KYC Documents</p>
              <div className="space-y-2">
                {kycDocs.map((doc) => (
                  <div
                    key={doc.type}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-800"
                  >
                    <div>
                      <span className="text-sm capitalize text-gray-800 dark:text-white/90">
                        {doc.type.replace("_", " ")}
                      </span>
                      {doc.fileName && (
                        <p className="text-xs text-gray-400 mt-0.5">{doc.fileName}</p>
                      )}
                    </div>
                    <Badge color="success" size="sm">Uploaded</Badge>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Review customer details below. KYC will be verified when you continue.
              </p>
            </div>
            <CustomerDetailsForm
              details={customerDetails}
              onChange={setCustomerDetails}
            />
            {kycMessage && (
              <p className="text-sm text-success-600">{kycMessage}</p>
            )}
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            {!cibilReport ? (
              <div className="py-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-brand-50">
                  <svg className="w-6 h-6 text-brand-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">Ready to generate CIBIL report</p>
                <p className="text-xs text-gray-500 mt-1">CIBIL is generated only after KYC verification is complete</p>
              </div>
            ) : (
              <>
                <div className="p-3 rounded-lg bg-success-50 dark:bg-success-500/10">
                  <p className="text-xs text-success-600">Report ID: {cibilReport.reportId}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                    <p className="text-xs text-gray-500">CIBIL Score</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white/90">{cibilReport.score}</p>
                  </div>
                  <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                    <p className="text-xs text-gray-500">Risk Category</p>
                    <p className="text-lg font-bold text-success-600">{cibilReport.riskCategory}</p>
                  </div>
                  <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                    <p className="text-xs text-gray-500">Eligible Amount</p>
                    <p className="text-lg font-bold">{formatCurrency(cibilReport.eligibleAmount)}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 text-center">
                  Generated for {customerDetails.name.value} · PAN {customerDetails.pan.value}
                </p>
              </>
            )}
          </div>
        )}

        {step === 6 && (
          <DeviceDetailsForm
            device={device}
            onChange={setDevice}
            eligibleAmount={cibilReport?.eligibleAmount}
          />
        )}

        {step === 7 && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs text-gray-500">Device</p>
              <p className="font-semibold text-gray-900 dark:text-white/90">
                {device.brand} {device.model}
              </p>
              <p className="text-sm text-brand-600 font-medium mt-1">
                Loan amount: {formatCurrency(loanAmount)}
              </p>
            </div>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">Select EMI Tenure</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {["6", "12", "18", "24"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTenure(t)}
                  className={`p-4 rounded-xl border text-left transition-colors ${
                    tenure === t ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10" : "border-gray-200 dark:border-gray-800"
                  }`}
                >
                  <p className="font-medium">{t} Months</p>
                  <p className="text-sm text-gray-500">
                    EMI: {formatCurrency(loanAmount > 0 ? Math.round((loanAmount / Number(t)) * 1.15) : 0)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 8 && loanSummary && (
          <LoanSummaryStep summary={loanSummary} />
        )}

        {step === 9 && loanSummary && (
          <KfsReviewStep
            kfsContent={kfsContent}
            loanId={loanSummary.loanId}
            onScrolledToBottom={setKfsScrolled}
          />
        )}

        {step === 10 && (
          <TermsConditionsStep accepted={termsAccepted} onChange={setTermsAccepted} />
        )}

        {step === 11 && loanSummary && (
          <DigitalConsentStep
            loanId={loanSummary.loanId}
            customerName={customerDetails.name.value}
            mobile={customerDetails.mobile.value}
            onConsentComplete={(log) => {
              setConsentLog(log);
              setConsentComplete(true);
            }}
          />
        )}

        {step === 12 && (
          <div className="space-y-4">
            {consentLog && (
              <div className="p-3 rounded-lg bg-success-50 dark:bg-success-500/10">
                <p className="text-xs text-success-600">
                  Consent recorded for {consentLog.customerName} · Loan {consentLog.loanId}
                </p>
              </div>
            )}
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800">
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">NACH Mandate Setup</p>
              <p className="text-xs text-gray-500 mt-1">
                Customer will receive a link to set up auto-debit mandate for EMI of{" "}
                {loanSummary ? formatCurrency(loanSummary.monthlyEmi) : "—"}/month
              </p>
              <Input className="mt-4" placeholder="Customer bank account (last 4 digits)" />
            </div>
          </div>
        )}
      </StepWizard>
      )}
    </>
  );
}
