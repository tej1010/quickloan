import Label from "../form/Label";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import type { CustomerApplicationDetails, FieldSource } from "../../services/loanApplicationService";

const sourceLabels: Record<FieldSource, string> = {
  aadhaar: "From Aadhaar",
  pan: "From PAN",
  address_proof: "From Address Proof",
  mobile_verified: "Mobile Verified",
  customer_record: "From Customer Record",
  manual: "Manual Entry",
};

interface CustomerDetailsFormProps {
  details: CustomerApplicationDetails;
  onChange: (details: CustomerApplicationDetails) => void;
}

function SourceBadge({ source }: { source: FieldSource | null }) {
  if (!source) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800">
        Enter manually
      </span>
    );
  }
  const colors: Record<FieldSource, string> = {
    aadhaar: "bg-brand-50 text-brand-600 dark:bg-brand-500/15",
    pan: "bg-purple-50 text-purple-600 dark:bg-purple-500/15",
    address_proof: "bg-blue-light-50 text-blue-light-600",
    mobile_verified: "bg-success-50 text-success-600 dark:bg-success-500/15",
    customer_record: "bg-warning-50 text-warning-600",
    manual: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full ${colors[source]}`}>
      {sourceLabels[source]}
    </span>
  );
}

function DetailField({
  label,
  fieldKey,
  details,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  fieldKey: keyof CustomerApplicationDetails;
  details: CustomerApplicationDetails;
  onChange: (details: CustomerApplicationDetails) => void;
  type?: string;
  required?: boolean;
}) {
  const field = details[fieldKey];

  const update = (value: string) => {
    onChange({
      ...details,
      [fieldKey]: {
        value,
        source: field.source && value === field.value ? field.source : value ? "manual" : null,
        editable: true,
      },
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <Label>
          {label} {required && <span className="text-error-500">*</span>}
        </Label>
        <SourceBadge source={field.source} />
      </div>
      {fieldKey === "address" ? (
        <TextArea value={field.value} onChange={update} rows={2} placeholder={`Enter ${label.toLowerCase()}`} />
      ) : (
        <Input
          type={type}
          value={field.value}
          onChange={(e) => update(e.target.value)}
          placeholder={field.source ? "" : `Enter ${label.toLowerCase()}`}
        />
      )}
    </div>
  );
}

export default function CustomerDetailsForm({ details, onChange }: CustomerDetailsFormProps) {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20">
        <p className="text-sm font-medium text-brand-700 dark:text-brand-400">
          Details auto-fetched from KYC documents
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Review and edit any field. Empty fields can be filled manually by the vendor.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <DetailField label="Full Name" fieldKey="name" details={details} onChange={onChange} required />
        <DetailField label="Mobile Number" fieldKey="mobile" details={details} onChange={onChange} type="tel" required />
        <DetailField label="Email" fieldKey="email" details={details} onChange={onChange} type="email" />
        <DetailField label="Date of Birth" fieldKey="dob" details={details} onChange={onChange} />
        <DetailField label="PAN Number" fieldKey="pan" details={details} onChange={onChange} required />
        <DetailField label="Aadhaar Number" fieldKey="aadhaar" details={details} onChange={onChange} required />
        <div className="sm:col-span-2">
          <DetailField label="Address" fieldKey="address" details={details} onChange={onChange} required />
        </div>
        <DetailField label="City" fieldKey="city" details={details} onChange={onChange} required />
        <DetailField label="State" fieldKey="state" details={details} onChange={onChange} required />
        <DetailField label="Pincode" fieldKey="pincode" details={details} onChange={onChange} required />
      </div>
    </div>
  );
}

export function validateCustomerDetails(details: CustomerApplicationDetails): string | null {
  const required: (keyof CustomerApplicationDetails)[] = [
    "name", "mobile", "address", "city", "state", "pincode", "pan", "aadhaar",
  ];
  for (const key of required) {
    if (!details[key].value.trim()) {
      return `Please fill ${key.replace(/([A-Z])/g, " $1")}`;
    }
  }
  if (!/^\d{10}$/.test(details.mobile.value.replace(/\D/g, ""))) {
    return "Enter a valid 10-digit mobile number";
  }
  return null;
}
