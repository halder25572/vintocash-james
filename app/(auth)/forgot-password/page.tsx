"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 700));

    localStorage.setItem("reset_email", email);
    router.push("/verify-reset");
    setLoading(false);
  };

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
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Forgot Password?</h1>
        <p className="text-sm text-gray-400 mb-6">
          Enter your email and we&apos;ll send you a reset code.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pl-10 text-sm text-gray-800 outline-none focus:border-[#D93E39] transition-colors"
              />
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {error && (
            <p className="text-xs text-[#D93E39] bg-red-50 px-3 py-2 rounded-xl">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#D93E39] cursor-pointer hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-70"
          >
            {loading ? "Sending code..." : "Send Reset Code"}
          </button>
        </form>

        <p className="text-xs text-center text-gray-400 mt-4">
          Remember your password?{" "}
          <Link href="/login" className="text-[#D93E39] cursor-pointer font-semibold hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}