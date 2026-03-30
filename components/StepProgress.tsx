"use client";

import { useFormContext } from "@/components/FormContext";

const TOTAL_STEPS = 8;
const PERCENTAGES = [13, 25, 38, 50, 63, 75, 88, 100];

export function StepProgress() {
  const { currentStep } = useFormContext();
  const pct = PERCENTAGES[currentStep - 1];

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[13px] font-medium text-[#D72638] tracking-wide">
          Step {currentStep} of {TOTAL_STEPS}
        </span>
        <span className="text-[13px] font-semibold text-[#D72638]">
          {pct}% Complete
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-border/70 overflow-hidden">
        <div
          className="h-full rounded-full bg-[#D72638] transition-all duration-500 ease-in-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}