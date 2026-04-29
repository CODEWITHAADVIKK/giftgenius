"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { IoGiftOutline, IoLockClosedOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useToast } from "@/context/ToastContext";

function ResetForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      addToast("error", "Mismatch", "Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      addToast("error", "Too Short", "Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        addToast("success", "Password Reset!", "You can now log in with your new password.");
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => router.push("/login"), 3000);
      } else {
        addToast("error", "Error", data.error || "Failed to reset password.");
      }
    } catch {
      addToast("error", "Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!token) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-bold text-white mb-2">Invalid Link</h2>
        <p className="text-[#9CA3AF] text-sm mb-6">
          This password reset link is invalid or has expired.
        </p>
        <Link
          href="/forgot-password"
          className="text-[#9B87F5] text-sm hover:text-white transition-colors"
        >
          Request a new reset link →
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#10B981]/20 flex items-center justify-center mx-auto mb-6">
          <IoCheckmarkCircleOutline className="h-8 w-8 text-[#10B981]" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Password Reset!</h2>
        <p className="text-[#9CA3AF] text-sm mb-6">
          Your password has been updated. Redirecting to login...
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white font-bold text-2xl mb-2"
        >
          <IoGiftOutline className="h-8 w-8 text-[#7C3AED]" />
          <span className="bg-gradient-to-r from-[#7C3AED] to-[#E8A87C] bg-clip-text text-transparent">
            GiftGenius
          </span>
        </Link>
        <h2 className="text-lg font-semibold text-white mt-4 mb-1">
          Reset Your Password
        </h2>
        <p className="text-[#9CA3AF] text-sm">Enter your new password below.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label htmlFor="new-password" className="text-xs text-[#9CA3AF]">New Password</label>
          <div className="relative">
            <IoLockClosedOutline className="absolute left-3 top-3 h-5 w-5 text-[#9CA3AF]" />
            <input
              id="new-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1F2023]/80 border border-[#2E2E38] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-[#9CA3AF] outline-none focus:border-[#7C3AED]/50 transition-colors"
              placeholder="••••••••"
              minLength={6}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="confirm-password" className="text-xs text-[#9CA3AF]">Confirm Password</label>
          <div className="relative">
            <IoLockClosedOutline className="absolute left-3 top-3 h-5 w-5 text-[#9CA3AF]" />
            <input
              id="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#1F2023]/80 border border-[#2E2E38] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-[#9CA3AF] outline-none focus:border-[#7C3AED]/50 transition-colors"
              placeholder="••••••••"
              minLength={6}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#9B87F5] text-white font-semibold hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center pt-24 pb-16 px-4 relative">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.15) 0%, transparent 100%), radial-gradient(1px 1px at 70% 60%, rgba(124,58,237,0.1) 0%, transparent 100%)",
          }}
        />
        <div className="w-full max-w-md liquid-glass-strong rounded-2xl p-8 relative z-10">
          <Suspense
            fallback={
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-2 border-[#7C3AED]/30 border-t-[#7C3AED] rounded-full animate-spin" />
              </div>
            }
          >
            <ResetForm />
          </Suspense>
        </div>
      </div>
      <Footer />
    </>
  );
}
