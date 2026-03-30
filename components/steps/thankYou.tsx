"use client";

import { useFormContext } from "@/components/FormContext";


const NEXT_STEPS = [
  "We'll review your asset details within 24 hours",
  "A specialist will reach out via phone or email",
  "We'll discuss your options and answer questions",
];

export default function ThankYou() {
  const { goToStep } = useFormContext();

  return (
    <div
      className="flex items-center justify-center px-4 py-12"
      style={{ animation: "fadeSlide 0.4s ease forwards" }}
    >
      <div className="flex flex-col items-center text-center">

        {/* Green Check Circle */}
        <div className="w-18 h-18 rounded-full bg-green-100 flex items-center justify-center mb-6 shadow-sm">
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 19L14.5 26L29 11"
              stroke="#22c55e"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-[32px] sm:text-[36px] font-bold text-gray-900 mb-3 leading-tight">
          Thank You!
        </h1>

        {/* Subtitle */}
        <p className="text-[15px] sm:text-[16px] text-gray-500 leading-relaxed mb-8 max-w-115">
          Your submission has been received. A VinToCash specialist will
          review your information and contact you shortly.
        </p>

        {/* What happens next card */}
        <div className="w-full rounded-2xl border border-red-100 bg-red-50/60 px-6 py-6 mb-8 text-left">
          <p className="text-[15px] font-semibold text-gray-900 mb-4">
            What happens next?
          </p>
          <div className="flex flex-col gap-3">
            {NEXT_STEPS.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                {/* Checkmark */}
                <div className="mt-0.5 shrink-0">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="9" cy="9" r="8.25" stroke="#9ca3af" strokeWidth="1.5" />
                    <path
                      d="M5.5 9.5L7.5 11.5L12.5 6.5"
                      stroke="#9ca3af"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-[13.5px] text-gray-700 leading-snug">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy note */}
        <p className="text-[12.5px] text-gray-400 mb-8">
          Your information is kept confidential and never shared with third parties.
        </p>

        {/* Start over */}
        <button
          type="button"
          onClick={() => goToStep(1)}
          className="px-8 h-12 rounded-full border-[1.5px] border-gray-300 bg-white text-[14px] font-medium text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 cursor-pointer focus:outline-none"
        >
          Submit Another Vehicle
        </button>
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}