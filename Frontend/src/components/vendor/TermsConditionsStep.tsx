import Checkbox from "../form/input/Checkbox";
import { LOAN_TERMS_AND_CONDITIONS } from "../../services/loanApplicationService";

interface TermsConditionsStepProps {
  accepted: boolean;
  onChange: (accepted: boolean) => void;
}

export default function TermsConditionsStep({ accepted, onChange }: TermsConditionsStepProps) {
  return (
    <div className="space-y-4">
      <div className="max-h-[380px] overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-5">
        <pre className="text-xs leading-relaxed whitespace-pre-wrap text-gray-700 dark:text-gray-300">
          {LOAN_TERMS_AND_CONDITIONS}
        </pre>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
        <Checkbox checked={accepted} onChange={onChange} />
        <span className="text-sm text-gray-700 dark:text-gray-400">
          I have read and understood the Terms &amp; Conditions and KFS
        </span>
      </div>
    </div>
  );
}
