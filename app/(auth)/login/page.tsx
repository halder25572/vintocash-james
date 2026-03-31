"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";

type LoginApiResponse = {
  status: boolean;
  message: string;
  data?: {
    token: string;
    user: {
      id: number;
      name: string | null;
      email: string;
      role?: string | null;
    };
  };
};

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL_DEAL ||
    "https://secondbackend.vintocash.com/api";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }

    try {
      const loginUrl = `${API_BASE_URL}/user-login`;
      console.log("📍 Attempting login to:", loginUrl);
      console.log("📧 Email:", trimmedEmail);

      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          password: trimmedPassword,
        }),
      });

      console.log("🔗 Response Status:", response.status, response.statusText);

      let result: LoginApiResponse;
      try {
        result = await response.json();
      } catch (parseErr) {
        console.error("❌ Failed to parse JSON:", parseErr);
        setError("Server returned invalid response.");
        setLoading(false);
        return;
      }

      console.log("📦 API Response:", result);

      // Accept both ok response and custom status: true from API
      if (!result.status || !result.data?.token || !result.data?.user) {
        const errorMsg = result?.message || "Login failed. Please try again.";
        console.error("❌ Login failed:", errorMsg);
        setError(errorMsg);
        setLoading(false);
        return;
      }

      console.log("✅ Login successful. User:", result.data.user);

      login(
        {
          id: result.data.user.id,
          email: result.data.user.email,
          name: result.data.user.name || result.data.user.email.split("@")[0] || "User",
          role: result.data.user.role || undefined,
        },
        result.data.token
      );

      console.log("✅ Auth store updated. Redirecting...");
      setLoading(false);
      router.replace("/dashboard");
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

      {/* Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Login</h1>
        <p className="text-sm text-gray-400 mb-6">Let&apos;s login into your account first</p>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
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

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm text-gray-800 outline-none focus:border-[#D93E39] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 cursor-pointer -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-[#D93E39] bg-red-50 px-3 py-2 rounded-xl">
              {error}
            </p>
          )}

          {/* Forgot */}
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs text-[#D93E39] cursor-pointer hover:underline"
            >
              Forgot Password ?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#D93E39] cursor-pointer hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-xs text-center text-gray-400 mt-4">
          Don&apos;t have an account?{" "}
          <Link href="#" className="text-[#D93E39] cursor-pointer font-semibold hover:underline">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
}
