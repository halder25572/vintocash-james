"use client";


import { useFormContext } from "./FormContext";
import { StepProgress } from "./StepProgress";
import { Step1 } from "./steps/Step1";
import { Step2 } from "./steps/Step2";
import { Step3 } from "./steps/Step3";
import Step4 from "./steps/Step4";
import Step5 from "./steps/Step5";
import Step6 from "./steps/Step6";
import Step7 from "./steps/Step7";
import Step8 from "./steps/Step8";
import ThankYou from "./steps/thankYou";


const STEPS: Record<number, React.ReactNode> = {
  1: <Step1 />,
  2: <Step2 />,
  3: <Step3 />,
  4: <Step4 />,
  5: <Step5 />,
  6: <Step6 />,
  7: <Step7 />,
  8: <Step8 />,
  9: <ThankYou />,
};

export function MultiStepForm() {
  const { currentStep } = useFormContext();

  return (
    <section className="">
      <div className="w-full mx-auto px-4 py-8 sm:py-10">
        {currentStep < 8 && <StepProgress />}
        {currentStep === 8 && (
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-medium text-muted-foreground tracking-wide">
                Step 8 of 8
              </span>
              <span className="text-[13px] font-semibold text-emerald-600">
                ✓ Complete!
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-border/70 overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: "100%" }} />
            </div>
          </div>
        )}
        <div key={currentStep}>{STEPS[currentStep]}</div>
      </div>
    </section>
  );
}
