import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../../components/common/PageMeta";
import PageHeader from "../../../components/fintech/PageHeader";
import StepWizard from "../../../components/fintech/StepWizard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import FileInput from "../../../components/form/input/FileInput";
import { vendorService } from "../../../services/vendorService";

const onboardingSteps = [
  { id: 1, title: "Password", description: "Create your account password" },
  { id: 2, title: "Business", description: "Enter business information" },
  { id: 3, title: "Bank", description: "Add bank account details" },
  { id: 4, title: "KYC", description: "Upload KYC documents" },
  { id: 5, title: "Review", description: "Review and submit" },
];

export default function VendorOnboarding() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    password: "", confirmPassword: "",
    storeName: "", ownerName: "", gstin: "", mobile: "", email: "", address: "",
    accountHolder: "", accountNumber: "", ifsc: "", bankName: "",
  });
  const navigate = useNavigate();

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    setSubmitting(true);
    await vendorService.submitOnboarding(form);
    setSubmitting(false);
    navigate("/vendor/dashboard");
  };

  return (
    <>
      <PageMeta title="Vendor Onboarding | Fintech" description="Complete vendor onboarding" />
      <PageHeader title="Vendor Onboarding" />
      <StepWizard
        steps={onboardingSteps}
        currentStep={step}
        onNext={() => setStep((s) => s + 1)}
        onBack={() => setStep((s) => s - 1)}
        isLastStep={step === onboardingSteps.length - 1}
        onSubmit={handleSubmit}
        isSubmitting={submitting}
      >
        {step === 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Password</Label><Input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} /></div>
            <div><Label>Confirm Password</Label><Input type="password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} /></div>
          </div>
        )}
        {step === 1 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Store Name</Label><Input value={form.storeName} onChange={(e) => update("storeName", e.target.value)} /></div>
            <div><Label>Owner Name</Label><Input value={form.ownerName} onChange={(e) => update("ownerName", e.target.value)} /></div>
            <div><Label>GSTIN</Label><Input value={form.gstin} onChange={(e) => update("gstin", e.target.value)} /></div>
            <div><Label>Mobile</Label><Input value={form.mobile} onChange={(e) => update("mobile", e.target.value)} placeholder="9876543210" /></div>
            <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} /></div>
            <div className="sm:col-span-2"><Label>Address</Label><TextArea value={form.address} onChange={(v) => update("address", v)} rows={3} /></div>
          </div>
        )}
        {step === 2 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Account Holder Name</Label><Input value={form.accountHolder} onChange={(e) => update("accountHolder", e.target.value)} /></div>
            <div><Label>Account Number</Label><Input value={form.accountNumber} onChange={(e) => update("accountNumber", e.target.value)} /></div>
            <div><Label>IFSC</Label><Input value={form.ifsc} onChange={(e) => update("ifsc", e.target.value)} /></div>
            <div><Label>Bank Name</Label><Input value={form.bankName} onChange={(e) => update("bankName", e.target.value)} /></div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <div><Label>GST Certificate</Label><FileInput onChange={() => {}} /></div>
            <div><Label>PAN Card</Label><FileInput onChange={() => {}} /></div>
            <div><Label>Cancelled Cheque</Label><FileInput onChange={() => {}} /></div>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-4 text-sm">
            {Object.entries(form).filter(([k]) => !k.includes("password")).map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                <span className="text-gray-500 capitalize">{k.replace(/([A-Z])/g, " $1")}</span>
                <span className="font-medium text-gray-800 dark:text-white/90">{v || "—"}</span>
              </div>
            ))}
          </div>
        )}
      </StepWizard>
    </>
  );
}
