import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import type { EmploymentDetails } from "../../services/loanApplicationService";
import { employmentTypeOptions } from "../../services/loanApplicationService";
import { formatCurrency } from "../fintech/StatusBadge";

interface EmploymentDetailsFormProps {
  employment: EmploymentDetails;
  onChange: (employment: EmploymentDetails) => void;
}

export default function EmploymentDetailsForm({ employment, onChange }: EmploymentDetailsFormProps) {
  const update = (key: keyof EmploymentDetails, value: string) => {
    onChange({ ...employment, [key]: value });
  };

  return (
    <div className="max-w-lg space-y-4">
      <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Start by capturing the customer&apos;s employment and income details.
        </p>
      </div>

      <div>
        <Label>Employment Type <span className="text-error-500">*</span></Label>
        <Select
          options={employmentTypeOptions}
          placeholder="Select employment type"
          defaultValue={employment.employmentType}
          onChange={(value) => update("employmentType", value)}
        />
      </div>

      <div>
        <Label>Profession <span className="text-error-500">*</span></Label>
        <Input
          placeholder="e.g. Software Engineer, Shop Owner"
          value={employment.profession}
          onChange={(e) => update("profession", e.target.value)}
        />
      </div>

      <div>
        <Label>Monthly Income <span className="text-error-500">*</span></Label>
        <Input
          type="number"
          placeholder="e.g. 50000"
          value={employment.monthlyIncome}
          onChange={(e) => update("monthlyIncome", e.target.value)}
        />
        {employment.monthlyIncome && Number(employment.monthlyIncome) > 0 && (
          <p className="mt-1 text-xs text-gray-500">
            {formatCurrency(Number(employment.monthlyIncome))} per month
          </p>
        )}
      </div>
    </div>
  );
}
