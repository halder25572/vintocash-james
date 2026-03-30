"use client";

import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import { useFormContext } from "@/components/FormContext";

function cn(...cls: (string | boolean | undefined)[]) {
  return cls.filter(Boolean).join(" ");
}

interface TitleOption {
  id: number;
  titleSituation: string;
  description: string;
}

export default function Step4() {
  const { formData, updateFormData, goNext, goBack } = useFormContext();
  const [titles, setTitles] = useState<TitleOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "https://backend.vintocash.com/api";

    fetch(`${baseUrl}/TitleData/get`)
      .then((res) => res.json())
      .then((json) => {
        if (json.status) setTitles(json.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className="max-w-7xl mx-auto rounded-xl border border-gray-200 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.07)]"
      style={{ animation: "fadeSlide 0.3s ease forwards" }}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-0 sm:px-7 sm:pt-7">
        <h2 className="text-[20px] sm:text-[22px] font-bold text-gray-900 leading-tight mb-1">
          What&apos;s the title situation?
        </h2>
        <p className="text-sm text-gray-500">
          This helps us understand the paperwork needed.
        </p>
      </div>

      {/* Body */}
      <div className="px-6 pt-5 pb-6 sm:px-7 sm:pt-6 sm:pb-7">
        <div className="flex flex-col gap-3 mb-5">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl border-[1.5px] border-gray-200 bg-gray-100 animate-pulse" />
            ))
          ) : (
            titles.map((t) => {
              const selected = formData.title_id === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() =>
                    updateFormData({
                      titleSituation: t.titleSituation, // string label
                      title_id:       t.id,             // numeric ID for API
                    })
                  }
                  className={cn(
                    "w-full text-left rounded-xl border-[1.5px] px-5 py-4 transition-all duration-200",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 cursor-pointer bg-white",
                    selected
                      ? "shadow-sm border-[#D93E39] bg-[#FFF0F1]"
                      : "border-gray-200 hover:border-[#D93E39] hover:bg-[#FFF0F1]"
                  )}
                >
                  {selected && (
                    <span className="absolute top-1/2 right-3.5 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-[#D93E39] text-white text-[10px] font-bold">
                      ✓
                    </span>
                  )}
                  <p className="text-[14px] font-semibold text-gray-900 mb-0.5">
                    {t.titleSituation}
                  </p>
                  <p className="text-[12.5px] text-gray-400 font-normal">
                    {t.description}
                  </p>
                </button>
              );
            })
          )}
        </div>

        {/* Info Note */}
        <div className="flex items-start gap-2.5 rounded-lg bg-gray-50 px-4 py-3 mb-7">
          <Info className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
          <p className="text-[12.5px] text-gray-500 leading-relaxed">
            We can work with most title situations. We&apos;ll help guide you
            through the process.
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
            disabled={!formData.title_id}
            className="flex-1 h-12 rounded-full bg-[#D72638] text-white text-[15px] font-semibold transition-all duration-200 hover:bg-[#b81e2e] hover:shadow-[0_4px_16px_rgba(215,38,56,0.35)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
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