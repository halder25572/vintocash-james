"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ResetPasswordApiResponse = {
  status: boolean;
  message: string;
  data?: unknown;
};

export default function NewPasswordPage() {
  const router = useRouter();
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL_DEAL ||
    "https://secondbackend.vintocash.com/api";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPass.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPass !== confirmPass) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const email =
      typeof window !== "undefined"
        ? localStorage.getItem("reset_email")
        : null;

    const resetToken =
      typeof window !== "undefined"
        ? localStorage.getItem("reset_password_token")
        : null;

    if (!email) {
      setError("Email not found. Please start from forgot password page.");
      setLoading(false);
      return;
    }

    if (!resetToken) {
      setError("Reset token not found. Please verify OTP first.");
      setLoading(false);
      return;
    }

    try {
      const resetPasswordUrl = `${API_BASE_URL}/reset/password`;
      console.log("📍 Attempting reset password to:", resetPasswordUrl);
      console.log("📧 Email:", email);

      const response = await fetch(resetPasswordUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email,
          reset_password_token: resetToken,
          password: newPass,
          password_confirmation: confirmPass,
        }),
      });

      console.log("🔗 Response Status:", response.status, response.statusText);

      let result: ResetPasswordApiResponse;
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
        const errorMsg = result?.message || "Failed to reset password. Please try again.";
        console.error("❌ Reset password failed:", errorMsg);
        setError(errorMsg);
        setLoading(false);
        return;
      }

      console.log("✅ Password reset successful");
      setSuccess(result.message || "Password reset successfully!");

      // Clear localStorage
      localStorage.removeItem("reset_email");
      localStorage.removeItem("reset_password_token");

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);

      setLoading(false);
    } catch (err) {
      console.error("❌ Network/Catch error:", err);
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <svg width="48" height="26" viewBox="0 0 48 26" fill="none">
          <path d="M4 18C4 18 7 9 14 9H34C41 9 44 18 44 18" stroke="#D93E39" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="12" cy="19" rx="4" ry="4" fill="#D93E39" />
          <ellipse cx="36" cy="19" rx="4" ry="4" fill="#D93E39" />
          <path d="M8 18H40V21C40 21.5523 39.5523 22 39 22H9C8.44772 22 8 21.5523 8 21V18Z" fill="#FECACA" />
        </svg>
        <span className="text-2xl font-bold text-gray-900">
          Vinto<span className="text-[#D93E39]">Cash</span>
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Create new password</h1>
        <p className="text-sm text-gray-400 mb-1">Choose something only you would know.</p>
        <p className="text-sm text-gray-400 mb-6">Avoid reusing old passwords.</p>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              New Password
            </label>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-[#D93E39] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-[#D93E39] transition-colors"
            />
          </div>

          {error && (
            <p className="text-xs text-[#D93E39] bg-red-50 px-3 py-2 rounded-xl">
              {error}
            </p>
          )}

          {success && (
            <p className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-xl">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#D93E39] hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-70"
          >
            {loading ? "Resetting..." : "Save and continue"}
          </button>
        </form>
      </div>
    </div>
  );
}