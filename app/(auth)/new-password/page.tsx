"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPasswordPage() {
  const router = useRouter();
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPass !== confirmPass) {
      setError("Passwords do not match.");
      return;
    }
    router.push("/dashboard");
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

          <button
            type="submit"
            className="w-full py-3 bg-[#D93E39] hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-colors"
          >
            Save and continue
          </button>
        </form>
      </div>
    </div>
  );
}