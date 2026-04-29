"use client";

import { useState } from "react";
import Link from "next/link";
import { IoGiftOutline, IoMailOutline, IoArrowBackOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useToast } from "@/context/ToastContext";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setSent(true);
        addToast("success", "Email Sent", "Check your inbox for reset instructions.");
      } else {
        addToast("error", "Error", data.error || "Failed to send reset email.");
      }
    } catch {
      addToast("error", "Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#10B981]/20 flex items-center justify-center mx-auto mb-6">
                <IoCheckmarkCircleOutline className="h-8 w-8 text-[#10B981]" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Check Your Email</h2>
              <p className="text-[#9CA3AF] text-sm mb-6">
                We&apos;ve sent password reset instructions to{" "}
                <span className="text-[#9B87F5]">{email}</span>
              </p>
              <Link
                href="/login"
                className="text-[#9B87F5] text-sm hover:text-white transition-colors"
              >
                ← Back to Sign In
              </Link>
            </div>
          ) : (
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
                  Forgot Password?
                </h2>
                <p className="text-[#9CA3AF] text-sm">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <label htmlFor="forgot-email" className="text-xs text-[#9CA3AF]">Email</label>
                  <div className="relative">
                    <IoMailOutline className="absolute left-3 top-3 h-5 w-5 text-[#9CA3AF]" />
                    <input
                      id="forgot-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#1F2023]/80 border border-[#2E2E38] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-[#9CA3AF] outline-none focus:border-[#7C3AED]/50 transition-colors"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#9B87F5] text-white font-semibold hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-[#9CA3AF]">
                <Link
                  href="/login"
                  className="text-[#9B87F5] hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <IoArrowBackOutline className="h-3 w-3" />
                  Back to Sign In
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
