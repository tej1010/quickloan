import Label from "../form/Label";
import Input from "../form/input/InputField";
import type { DeviceDetails } from "../../services/loanApplicationService";
import { formatCurrency } from "../fintech/StatusBadge";

interface DeviceDetailsFormProps {
  device: DeviceDetails;
  onChange: (device: DeviceDetails) => void;
  eligibleAmount?: number;
}

export default function DeviceDetailsForm({ device, onChange, eligibleAmount }: DeviceDetailsFormProps) {
  const update = (key: keyof DeviceDetails, value: string) => {
    onChange({ ...device, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20">
        <p className="text-sm font-medium text-brand-700 dark:text-brand-400">
          Enter device purchase details
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Customer is CIBIL approved. Capture the mobile phone being purchased as per invoice.
        </p>
        {eligibleAmount !== undefined && (
          <p className="text-xs font-medium text-success-600 mt-2">
            Max eligible loan amount: {formatCurrency(eligibleAmount)}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Brand Name <span className="text-error-500">*</span></Label>
          <Input
            placeholder="e.g. Samsung, Apple, OnePlus"
            value={device.brand}
            onChange={(e) => update("brand", e.target.value)}
          />
        </div>
        <div>
          <Label>Model Name <span className="text-error-500">*</span></Label>
          <Input
            placeholder="e.g. Galaxy S24, iPhone 15"
            value={device.model}
            onChange={(e) => update("model", e.target.value)}
          />
        </div>
        <div>
          <Label>IMEI Number 1 <span className="text-error-500">*</span></Label>
          <Input
            type="text"
            placeholder="14–16 digits"
            value={device.imei1}
            onChange={(e) => update("imei1", e.target.value.replace(/\D/g, "").slice(0, 16))}
          />
          <p className="mt-1 text-xs text-gray-400">{device.imei1.length}/16 digits</p>
        </div>
        <div>
          <Label>IMEI Number 2</Label>
          <Input
            type="text"
            placeholder="Optional — dual SIM devices"
            value={device.imei2}
            onChange={(e) => update("imei2", e.target.value.replace(/\D/g, "").slice(0, 16))}
          />
          <p className="mt-1 text-xs text-gray-400">Optional for dual-SIM</p>
        </div>
        <div>
          <Label>Colour / Variant</Label>
          <Input
            placeholder="e.g. Midnight Black"
            value={device.colourVariant}
            onChange={(e) => update("colourVariant", e.target.value)}
          />
        </div>
        <div>
          <Label>Storage / RAM Variant</Label>
          <Input
            placeholder="e.g. 128GB / 8GB RAM"
            value={device.storageRam}
            onChange={(e) => update("storageRam", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Label>Invoice Amount (MRP) <span className="text-error-500">*</span></Label>
          <Input
            type="number"
            placeholder="Actual purchase price of the device"
            value={device.invoiceAmount}
            onChange={(e) => update("invoiceAmount", e.target.value)}
          />
          {device.invoiceAmount && eligibleAmount !== undefined && Number(device.invoiceAmount) > eligibleAmount && (
            <p className="mt-1 text-xs text-error-500">
              Invoice amount exceeds eligible amount of {formatCurrency(eligibleAmount)}
            </p>
          )}
        </div>
      </div>

      {device.brand && device.model && device.invoiceAmount && (
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <p className="text-xs font-medium text-gray-500 uppercase mb-1">Device Preview</p>
          <p className="font-semibold text-gray-900 dark:text-white/90">
            {device.brand} {device.model}
            {device.storageRam && ` · ${device.storageRam}`}
            {device.colourVariant && ` · ${device.colourVariant}`}
          </p>
          <p className="text-sm text-brand-600 font-medium mt-1">
            Loan amount: {formatCurrency(Number(device.invoiceAmount) || 0)}
          </p>
        </div>
      )}
    </div>
  );
}

export function validateDeviceDetails(
  device: DeviceDetails,
  eligibleAmount?: number,
): string | null {
  if (!device.brand.trim()) return "Brand name is required";
  if (!device.model.trim()) return "Model name is required";
  if (!device.imei1.trim()) return "IMEI number 1 is required";
  if (!/^\d{14,16}$/.test(device.imei1)) return "IMEI number 1 must be 14–16 digits";
  if (device.imei2 && !/^\d{14,16}$/.test(device.imei2)) {
    return "IMEI number 2 must be 14–16 digits if provided";
  }
  if (!device.invoiceAmount.trim()) return "Invoice amount (MRP) is required";
  const amount = Number(device.invoiceAmount);
  if (isNaN(amount) || amount <= 0) return "Enter a valid invoice amount";
  if (eligibleAmount !== undefined && amount > eligibleAmount) {
    return `Invoice amount cannot exceed eligible amount of ₹${eligibleAmount.toLocaleString("en-IN")}`;
  }
  return null;
}
