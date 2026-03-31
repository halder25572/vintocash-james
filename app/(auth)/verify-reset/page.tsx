"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

type OtpVerifyApiResponse = {
  status: boolean;
  message: string;
  data?: {
    id: number;
    name: string;
    email: string;
    reset_password_token: string;
    reset_password_token_expires_at: string;
    [key: string]: unknown;
  };
};

type ResendOtpApiResponse = {
  status: boolean;
  message: string;
  data?: unknown;
};

export default function VerifyResetPage() {
  const router = useRouter();
  const [codes, setCodes] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL_DEAL ||
    "https://secondbackend.vintocash.com/api";

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...codes];
    next[i] = val.slice(-1);
    setCodes(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !codes[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handleContinue = async () => {
    const otp = codes.join("");
    
    if (otp.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    const email =
      typeof window !== "undefined"
        ? localStorage.getItem("reset_email")
        : null;

    if (!email) {
      setError("Email not found. Please start from forgot password page.");
      setLoading(false);
      return;
    }

    try {
      const otpCheckUrl = `${API_BASE_URL}/otp/check`;
      console.log("📍 Attempting OTP verification to:", otpCheckUrl);
      console.log("📧 Email:", email);
      console.log("🔢 OTP:", otp);

      const response = await fetch(otpCheckUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email,
          otp: otp,
        }),
      });

      console.log("🔗 Response Status:", response.status, response.statusText);

      let result: OtpVerifyApiResponse;
      try {
        result = await response.json();
      } catch (parseErr) {
        console.error("❌ Failed to parse JSON:", parseErr);
        setError("Server returned invalid response.");
        setLoading(false);
        return;
      }

      console.log("📦 API Response:", result);

      if (!result.status) {
        const errorMsg = result?.message || "Invalid OTP. Please try again.";
        console.error("❌ OTP verification failed:", errorMsg);
        setError(errorMsg);
        setLoading(false);
        return;
      }

      console.log("✅ OTP verified successfully");
      setSuccess(result.message || "OTP verified successfully!");

      // Store reset token for new password page
      if (result.data?.reset_password_token) {
        localStorage.setItem("reset_password_token", result.data.reset_password_token);
      }

      // Redirect to new password page after 1 second
      setTimeout(() => {
        router.push("/new-password");
      }, 1000);

      setLoading(false);
    } catch (err) {
      console.error("❌ Network/Catch error:", err);
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setSuccess("");
    setResending(true);

    const email =
      typeof window !== "undefined"
        ? localStorage.getItem("reset_email")
        : null;

    if (!email) {
      setError("Email not found. Please start from forgot password page.");
      setResending(false);
      return;
    }

    try {
      const resendOtpUrl = `${API_BASE_URL}/resend/otp`;
      console.log("📍 Attempting resend OTP to:", resendOtpUrl);
      console.log("📧 Email:", email);

      const response = await fetch(resendOtpUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      console.log("🔗 Response Status:", response.status, response.statusText);

      let result: ResendOtpApiResponse;
      try {
        result = await response.json();
      } catch (parseErr) {
        console.error("❌ Failed to parse JSON:", parseErr);
        setError("Server returned invalid response.");
        setResending(false);
        return;
      }

      console.log("📦 API Response:", result);

      if (!result.status) {
        const errorMsg = result?.message || "Failed to resend OTP. Please try again.";
        console.error("❌ Resend OTP failed:", errorMsg);
        setError(errorMsg);
        setResending(false);
        return;
      }

      console.log("✅ OTP resent successfully");
      setSuccess(result.message || "OTP resent successfully! Check your email.");
      
      // Clear the OTP inputs
      setCodes(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
      
      setResending(false);
    } catch (err) {
      console.error("❌ Network/Catch error:", err);
      setError("Network error. Please try again.");
      setResending(false);
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
          Enter the 6-digit code we sent to{" "}
          <span className="font-semibold text-gray-600">{email}</span>
        </p>

        {/* OTP Inputs */}
        <div className="flex gap-2 justify-center mb-6">
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
              className="w-10 h-12 sm:w-11 sm:h-14 text-center text-lg sm:text-xl font-bold border-2 border-gray-200 rounded-xl outline-none focus:border-[#D93E39] transition-colors text-gray-800"
            />
          ))}
        </div>

        {error && (
          <p className="text-xs text-[#D93E39] bg-red-50 px-3 py-2 rounded-xl mb-4 text-center">
            {error}
          </p>
        )}

        {success && (
          <p className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-xl mb-4 text-center">
            {success}
          </p>
        )}

        <button
          onClick={handleContinue}
          disabled={loading}
          className="w-full py-3 bg-[#D93E39] hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-colors mb-4 disabled:opacity-70"
        >
          {loading ? "Verifying..." : "Continue"}
        </button>

        <p className="text-xs text-center text-gray-400">
          For security, this code expires in 10 minutes.
        </p>

        <p className="text-xs text-center text-gray-400 mt-4">
          Didn&apos;t receive a code?{" "}
          <button 
            onClick={handleResendOtp}
            disabled={resending}
            className="text-[#D93E39] cursor-pointer font-semibold hover:underline disabled:opacity-50"
          >
            {resending ? "Resending..." : "Resend code"}
          </button>
        </p>
      </div>
    </div>
  );
}