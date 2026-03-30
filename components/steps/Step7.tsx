"use client";

import { Info } from "lucide-react";
import { useFormContext } from "@/components/FormContext";

const UPSIDE_OPTIONS = [
  {
    label: "Yes, interested",
    desc: "Tell me more about Seller Upside",
  },
  {
    label: "No, just cash",
    desc: "I prefer a straightforward cash offer",
  },
  {
    label: "Not sure yet",
    desc: "Help me understand my options",
  },
];

function cn(...cls: (string | boolean | undefined)[]) {
  return cls.filter(Boolean).join(" ");
}

export default function Step7() {
  const { formData, updateFormData, goNext, goBack } = useFormContext();

  return (
    <div
      className="max-w-7xl mx-auto rounded-xl border border-gray-200 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.07)]"
      style={{ animation: "fadeSlide 0.3s ease forwards" }}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-0 sm:px-7 sm:pt-7">
        <h2 className="text-[20px] sm:text-[22px] font-bold text-gray-900 leading-tight mb-1">
          Interested in Seller Upside?
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          Seller Upside allows qualifying sellers to receive a guaranteed
          minimum now, plus potential additional payment if your asset sells
          for more.
        </p>
      </div>

      {/* Body */}
      <div className="px-6 pt-5 pb-6 sm:px-7 sm:pt-6 sm:pb-7">

        {/* Options */}
        <div className="flex flex-col gap-3 mb-5">
          {UPSIDE_OPTIONS.map((opt) => {
            const selected = formData.sellerUpside === opt.label;
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => updateFormData({ sellerUpside: opt.label })}
                className={cn(
                  "w-full text-left rounded-xl border-[1.5px] px-5 py-4 transition-all duration-200",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 cursor-pointer bg-white",
                  selected
                    ? "shadow-sm border-[#D93E39] cursor-pointer bg-[#FFF0F1]"
                    : "border-gray-200 hover:border-[#D93E39] hover:bg-[#FFF0F1]"
                )}
              >
                <p className="text-[14px] font-semibold text-gray-900 mb-0.5">
                  {opt.label}
                </p>
                <p className="text-[12.5px] text-gray-400 font-normal">
                  {opt.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Info Note */}
        <div className="flex items-start gap-2.5 rounded-lg bg-gray-50 px-4 py-3 mb-7">
          <Info className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
          <p className="text-[12.5px] text-gray-500 leading-relaxed">
            Seller Upside is completely optional and not available for all
            assets. We&apos;ll discuss your specific options when we connect.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={goBack}
            className="flex-1 h-12 rounded-full border-[1.5px] border-[#D72638] bg-white text-[#D72638] text-[15px] font-semibold transition-all duration-200 hover:bg-red-50 cursor-pointer focus:outline-none"
          >
            Back
          </button>
          <button
            type="button"
            onClick={goNext}
            className="flex-1 h-12 rounded-full bg-[#D72638] text-white text-[15px] font-semibold transition-all duration-200 hover:bg-[#b81e2e] hover:shadow-[0_4px_16px_rgba(215,38,56,0.35)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer focus:outline-none"
          >
            Continue
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}