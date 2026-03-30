"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const DEMO_CODE = ["4", "9", "7", "5"];

export default function VerifyResetPage() {
  const router = useRouter();
  const [codes, setCodes] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...codes];
    next[i] = val.slice(-1);
    setCodes(next);
    if (val && i < 3) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !codes[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handleContinue = () => {
    if (codes.join("") === DEMO_CODE.join("")) {
      router.push("/new-password");
    } else {
      setError("Wrong code. Use: 4975");
    }
  };

  const email =
    typeof window !== "undefined"
      ? localStorage.getItem("reset_email") ?? "your email"
      : "your email";

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <svg width="48" height="26" viewBox="0 0 48 26" fill="none">
          <path d="M4 18C4 18 7 9 14 9H34C41 9 44 18 44 18" stroke="#D93E39" strokeWidth="2.5" strokeLinecap="round"/>
          <ellipse cx="12" cy="19" rx="4" ry="4" fill="#D93E39"/>
          <ellipse cx="36" cy="19" rx="4" ry="4" fill="#D93E39"/>
          <path d="M8 18H40V21C40 21.5523 39.5523 22 39 22H9C8.44772 22 8 21.5523 8 21V18Z" fill="#FECACA"/>
        </svg>
        <span className="text-2xl font-bold text-gray-900">
          Vinto<span className="text-[#D93E39]">Cash</span>
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Enter your code</h1>
        <p className="text-sm text-gray-400 mb-6">
          Enter the 4-digit code we sent to{" "}
          <span className="font-semibold text-gray-600">{email}</span>
        </p>

        {/* OTP Inputs */}
        <div className="flex gap-3 justify-center mb-6">
          {codes.map((c, i) => (
            <input
              key={i}
              ref={(el) => { inputs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={c}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-14 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl outline-none focus:border-[#D93E39] transition-colors text-gray-800"
            />
          ))}
        </div>

        {error && (
          <p className="text-xs text-[#D93E39] bg-red-50 px-3 py-2 rounded-xl mb-4 text-center">
            {error}
          </p>
        )}

        <button
          onClick={handleContinue}
          className="w-full py-3 bg-[#D93E39] hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-colors mb-4"
        >
          Continue
        </button>

        <p className="text-xs text-center text-gray-400">
          For security, this code expires in 10 minutes.
        </p>

        {/* Demo hint */}
        <div className="mt-4 p-3 bg-gray-50 rounded-xl">
          <p className="text-xs text-gray-500">
            Demo code: <span className="font-bold text-gray-700">4975</span>
          </p>
        </div>

        <p className="text-xs text-center text-gray-400 mt-4">
          Didn&apos;t receive a code?{" "}
          <button className="text-[#D93E39] font-semibold hover:underline">
            Resend code
          </button>
        </p>
      </div>
    </div>
  );
}