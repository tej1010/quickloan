import { CheckLineIcon } from "../../icons";
import Button from "../ui/button/Button";

export interface Step {
  id: number;
  title: string;
  description?: string;
}

interface StepWizardProps {
  steps: Step[];
  currentStep: number;
  children: React.ReactNode;
  onNext: () => void | Promise<void>;
  onBack: () => void;
  onSubmit?: () => void;
  isLastStep?: boolean;
  isSubmitting?: boolean;
  isNextLoading?: boolean;
  nextDisabled?: boolean;
  nextLabel?: string;
}

export default function StepWizard({
  steps,
  currentStep,
  children,
  onNext,
  onBack,
  onSubmit,
  isLastStep,
  isSubmitting,
  isNextLoading,
  nextDisabled,
  nextLabel = "Next",
}: StepWizardProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between overflow-x-auto pb-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 shrink-0 ${
                  index < currentStep
                    ? "bg-brand-500 border-brand-500 text-white"
                    : index === currentStep
                      ? "border-brand-500 text-brand-500"
                      : "border-gray-300 text-gray-400 dark:border-gray-700"
                }`}
              >
                {index < currentStep ? (
                  <CheckLineIcon className="size-5" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              <span
                className={`mt-2 text-xs text-center truncate max-w-[80px] ${
                  index <= currentStep
                    ? "text-gray-800 dark:text-white/90 font-medium"
                    : "text-gray-400"
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 ${
                  index < currentStep ? "bg-brand-500" : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-white/90">
          {steps[currentStep]?.title}
        </h3>
        {steps[currentStep]?.description && (
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            {steps[currentStep].description}
          </p>
        )}
        {children}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} disabled={currentStep === 0}>
          Back
        </Button>
        {isLastStep ? (
          <Button onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        ) : (
          <Button onClick={onNext} disabled={nextDisabled || isNextLoading}>
            {isNextLoading ? "Please wait..." : nextLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
