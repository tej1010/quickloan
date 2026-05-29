import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import PageMeta from "../../../components/common/PageMeta";
import MobileHeader from "../../../components/customer/mobile/MobileHeader";
import KfsReviewStep from "../../../components/vendor/KfsReviewStep";
import TermsConditionsStep from "../../../components/vendor/TermsConditionsStep";
import DigitalConsentStep from "../../../components/vendor/DigitalConsentStep";
import LoanSummaryStep from "../../../components/vendor/LoanSummaryStep";
import { formatINR } from "../../../components/customer/mobile/utils";
import { useAuth } from "../../../context/AuthContext";
import { customerApplicationService } from "../../../services/customerApplicationService";
import {
  calculateLoanSummary,
  emptyCustomerDetails,
  extractKycFromDocuments,
  generateKfsDocument,
  type CustomerApplicationDetails,
  type KycDocumentUpload,
} from "../../../services/loanApplicationService";
import type { IncompleteLoanApplication } from "../../../types";

const STEPS_BASE = ["KYC Upload", "Your Details", "Loan Summary", "KFS Review", "Terms", "Consent"];
const STEPS_WITH_PRODUCT = ["Product", ...STEPS_BASE];

function toCustomerDetails(app: IncompleteLoanApplication): CustomerApplicationDetails {
  const base = emptyCustomerDetails(app.customerMobile);
  const d = app.customerDetails;
  return {
    ...base,
    name: { value: d.name, source: "customer_record", editable: false },
    mobile: { value: d.mobile, source: "mobile_verified", editable: false },
    email: { value: d.email, source: "customer_record", editable: false },
    address: { value: d.address, source: "customer_record", editable: false },
    city: { value: d.city, source: "customer_record", editable: false },
    state: { value: d.state, source: "customer_record", editable: false },
    pincode: { value: d.pincode, source: "customer_record", editable: false },
    pan: { value: d.pan, source: null, editable: false },
    aadhaar: { value: d.aadhaar, source: null, editable: false },
    dob: { value: "", source: null, editable: false },
  };
}

export default function CustomerCompleteApplication() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("apply");
  const isNew = searchParams.get("new") === "1";

  const [application, setApplication] = useState<IncompleteLoanApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [kycDocs, setKycDocs] = useState<KycDocumentUpload[]>([
    { type: "aadhaar", fileName: "", uploaded: false },
    { type: "pan", fileName: "", uploaded: false },
    { type: "address_proof", fileName: "", uploaded: false },
  ]);
  const [customerDetails, setCustomerDetails] = useState<CustomerApplicationDetails | null>(null);
  const [kfsScrolled, setKfsScrolled] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [consentComplete, setConsentComplete] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const steps = application?.isSelfInitiated ? STEPS_WITH_PRODUCT : STEPS_BASE;
  const currentStepName = steps[step] ?? "";

  useEffect(() => {
    const load = async () => {
      if (isNew && user) {
        const app = await customerApplicationService.createNewApplication(user);
        setApplication(app);
        setCustomerDetails(toCustomerDetails(app));
        setStep(0);
        setLoading(false);
        return;
      }

      let app: IncompleteLoanApplication | null = null;
      if (sessionId) {
        app = await customerApplicationService.getIncompleteBySession(sessionId, user?.mobile);
      } else if (user?.mobile) {
        app = await customerApplicationService.getIncompleteApplication(user.mobile);
      }
      if (app) {
        setApplication(app);
        setCustomerDetails(toCustomerDetails(app));
        setStep(app.progressStep);
      }
      setLoading(false);
    };
    load();
  }, [sessionId, user, isNew]);

  const loanSummary = useMemo(() => {
    if (!application || application.loanAmount <= 0) return null;
    return calculateLoanSummary(
      {
        brand: application.productName,
        model: application.productModel,
        imei1: "",
        imei2: "",
        colourVariant: "",
        storageRam: "",
        invoiceAmount: String(application.loanAmount),
      },
      application.tenure,
      application.applicationNo,
    );
  }, [application]);

  const kfsContent = useMemo(() => {
    if (!loanSummary || !customerDetails) return "";
    return generateKfsDocument(loanSummary, customerDetails);
  }, [loanSummary, customerDetails]);

  const updateApplication = async (updates: Partial<IncompleteLoanApplication>, nextStep?: number) => {
    const updated = { ...application!, ...updates, progressStep: nextStep ?? step };
    setApplication(updated);
    await customerApplicationService.saveDraft(updated);
    if (nextStep !== undefined) setStep(nextStep);
  };

  const handleKycUpload = (type: KycDocumentUpload["type"], file?: File) => {
    setKycDocs((docs) =>
      docs.map((d) =>
        d.type === type ? { ...d, uploaded: !!file, fileName: file?.name || "" } : d,
      ),
    );
  };

  const handleNext = async () => {
    setError("");
    if (!application) return;

    if (currentStepName === "Product") {
      if (!application.productName.trim() || !application.productModel.trim()) {
        setError("Enter device brand and model");
        return;
      }
      if (application.loanAmount <= 0) {
        setError("Enter a valid device price");
        return;
      }
      const summary = calculateLoanSummary(
        {
          brand: application.productName,
          model: application.productModel,
          imei1: "",
          imei2: "",
          colourVariant: "",
          storageRam: "",
          invoiceAmount: String(application.loanAmount),
        },
        application.tenure,
        application.applicationNo,
      );
      await updateApplication({ emiAmount: summary.monthlyEmi }, step + 1);
      return;
    }

    if (currentStepName === "KYC Upload") {
      if (!kycDocs.every((d) => d.uploaded)) {
        setError("Please upload all KYC documents");
        return;
      }
      setExtracting(true);
      const extracted = await extractKycFromDocuments(kycDocs, application.customerMobile);
      setCustomerDetails((prev) => {
        if (!prev) return prev;
        const merged = { ...prev };
        (Object.keys(extracted) as (keyof CustomerApplicationDetails)[]).forEach((key) => {
          const incoming = extracted[key];
          if (incoming?.value) merged[key] = { ...incoming, editable: false };
        });
        return merged;
      });
      setExtracting(false);
      await updateApplication({}, step + 1);
      return;
    }

    if (currentStepName === "KFS Review" && !kfsScrolled) {
      setError("Please scroll to the bottom of the KFS");
      return;
    }

    if (currentStepName === "Terms" && !termsAccepted) {
      setError("Please accept the Terms & Conditions and KFS");
      return;
    }

    if (currentStepName === "Consent") {
      if (!consentComplete) {
        setError("Complete digital consent via OTP");
        return;
      }
      await customerApplicationService.markApplicationComplete(application.customerMobile);
      setDone(true);
      return;
    }

    await updateApplication({}, step + 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 rounded-full border-brand-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!application) {
    return (
      <>
        <MobileHeader title="Loan Application" showBack />
        <div className="px-5 py-16 text-center">
          <p className="text-gray-500">No application in progress.</p>
          <button
            onClick={() => navigate("/customer/apply?new=1")}
            className="w-full py-4 mt-6 text-sm font-semibold text-white rounded-2xl bg-brand-600"
          >
            Start New Application
          </button>
        </div>
      </>
    );
  }

  if (done) {
    return (
      <>
        <PageMeta title="Application Submitted | Quick Loan" description="Application complete" />
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-8 text-center">
          <div className="flex items-center justify-center w-20 h-20 mb-6 text-4xl rounded-full bg-success-50">✅</div>
          <h1 className="text-2xl font-bold text-gray-900">Application Submitted</h1>
          <p className="mt-2 text-sm text-gray-500">
            Your loan application {application.applicationNo} has been submitted. The vendor will complete disbursement after final review.
          </p>
          <button
            onClick={() => navigate("/customer/dashboard", { replace: true })}
            className="w-full py-4 mt-8 text-sm font-semibold text-white rounded-2xl bg-brand-600"
          >
            Back to Home
          </button>
        </div>
      </>
    );
  }

  const pageTitle = application.isSelfInitiated ? "New Application" : "Complete Application";

  return (
    <>
      <PageMeta title={`${pageTitle} | Quick Loan`} description="Complete your loan application" />
      <MobileHeader title={pageTitle} showBack />

      <div className="px-5 pb-28">
        {application.loanAmount > 0 ? (
          <div className="p-4 mb-4 rounded-2xl bg-white ring-1 ring-gray-100">
            <p className="text-xs text-gray-500">{application.vendorName}</p>
            <p className="font-semibold text-gray-900">{application.productName} {application.productModel}</p>
            <p className="text-sm text-brand-600 font-medium mt-1">{formatINR(application.loanAmount)}</p>
          </div>
        ) : (
          <div className="p-4 mb-4 rounded-2xl bg-brand-50 ring-1 ring-brand-100">
            <p className="text-sm text-brand-700">Tell us about the device you want to finance.</p>
          </div>
        )}

        <div className="mb-5">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Step {step + 1} of {steps.length}</span>
            <span>{currentStepName}</span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        {currentStepName === "Product" && (
          <div className="space-y-4">
            {[
              { label: "Device Brand", key: "productName", placeholder: "e.g. Samsung" },
              { label: "Model", key: "productModel", placeholder: "e.g. Galaxy S24 Ultra" },
            ].map(({ label, key, placeholder }) => (
              <div key={key} className="p-4 bg-white rounded-2xl ring-1 ring-gray-100">
                <label className="text-xs font-medium text-gray-500 uppercase">{label}</label>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={application[key as "productName" | "productModel"]}
                  onChange={(e) => setApplication({ ...application, [key]: e.target.value })}
                  className="w-full mt-2 text-base font-medium text-gray-900 bg-transparent outline-none placeholder:text-gray-300"
                />
              </div>
            ))}
            <div className="p-4 bg-white rounded-2xl ring-1 ring-gray-100">
              <label className="text-xs font-medium text-gray-500 uppercase">Device Price (MRP)</label>
              <input
                type="number"
                placeholder="52000"
                value={application.loanAmount || ""}
                onChange={(e) => setApplication({ ...application, loanAmount: Number(e.target.value) })}
                className="w-full mt-2 text-base font-medium text-gray-900 bg-transparent outline-none placeholder:text-gray-300"
              />
            </div>
            <div className="p-4 bg-white rounded-2xl ring-1 ring-gray-100">
              <label className="text-xs font-medium text-gray-500 uppercase">EMI Tenure</label>
              <div className="grid grid-cols-4 gap-2 mt-3">
                {["6", "12", "18", "24"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setApplication({ ...application, tenure: Number(t) })}
                    className={`py-2.5 text-sm font-semibold rounded-xl ${
                      application.tenure === Number(t)
                        ? "bg-brand-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {t} mo
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStepName === "KYC Upload" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Upload your KYC documents to continue.</p>
            {kycDocs.map((doc) => (
              <div key={doc.type} className="p-4 bg-white rounded-2xl ring-1 ring-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium capitalize text-gray-900">{doc.type.replace("_", " ")}</p>
                  {doc.uploaded && <span className="text-xs text-success-600 font-medium">Uploaded</span>}
                </div>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleKycUpload(doc.type, e.target.files?.[0])}
                  className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-brand-50 file:text-brand-700 file:font-medium"
                />
                {doc.fileName && <p className="mt-1 text-xs text-gray-400">{doc.fileName}</p>}
              </div>
            ))}
          </div>
        )}

        {currentStepName === "Your Details" && customerDetails && (
          <div className="p-4 space-y-3 bg-white rounded-2xl ring-1 ring-gray-100">
            {[
              ["Name", customerDetails.name.value],
              ["Mobile", `+91 ${customerDetails.mobile.value}`],
              ["Email", customerDetails.email.value],
              ["PAN", customerDetails.pan.value],
              ["Aadhaar", customerDetails.aadhaar.value],
              ["Address", `${customerDetails.address.value}, ${customerDetails.city.value}`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 text-sm">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-gray-900 text-right">{value || "—"}</span>
              </div>
            ))}
          </div>
        )}

        {currentStepName === "Loan Summary" && loanSummary && (
          <div className="-mx-1">
            <LoanSummaryStep summary={loanSummary} />
          </div>
        )}

        {currentStepName === "KFS Review" && loanSummary && (
          <KfsReviewStep
            kfsContent={kfsContent}
            loanId={loanSummary.loanId}
            onScrolledToBottom={setKfsScrolled}
          />
        )}

        {currentStepName === "Terms" && (
          <TermsConditionsStep accepted={termsAccepted} onChange={setTermsAccepted} />
        )}

        {currentStepName === "Consent" && loanSummary && (
          <DigitalConsentStep
            loanId={loanSummary.loanId}
            customerName={application.customerName}
            mobile={application.customerMobile}
            onConsentComplete={() => setConsentComplete(true)}
          />
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 p-5 mx-auto max-w-md bg-[#f5f6fa]/95 backdrop-blur border-t border-gray-100 lg:max-w-lg">
        <button
          onClick={handleNext}
          disabled={extracting || (currentStepName === "Consent" && !consentComplete)}
          className="w-full py-4 text-sm font-semibold text-white rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 disabled:opacity-50"
        >
          {extracting
            ? "Extracting..."
            : currentStepName === "Consent"
              ? consentComplete
                ? "Submit Application"
                : "Complete Consent Above"
              : currentStepName === "KFS Review"
                ? "Proceed"
                : "Continue"}
        </button>
      </div>
    </>
  );
}
