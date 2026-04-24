"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Gift, Mail, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        addToast("success", "Welcome Back!", "You have successfully logged in.");
        router.push("/");
      } else {
        addToast("error", "Login Failed", data.message || "Invalid credentials");
      }
    } catch (err) {
      addToast("error", "Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center pt-24 pb-16 px-4 relative">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.15) 0%, transparent 100%), radial-gradient(1px 1px at 70% 60%, rgba(124,58,237,0.1) 0%, transparent 100%)"
        }} />
        
        <div className="w-full max-w-md liquid-glass-strong rounded-2xl p-8 relative z-10">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-white font-bold text-2xl mb-2">
              <Gift className="h-8 w-8 text-[#7C3AED]" />
              <span className="bg-gradient-to-r from-[#7C3AED] to-[#E8A87C] bg-clip-text text-transparent">GiftGenius</span>
            </Link>
            <p className="text-[#9CA3AF] text-sm">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs text-[#9CA3AF]">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-[#9CA3AF]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1F2023]/80 border border-[#2E2E38] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-[#9CA3AF] outline-none focus:border-[#7C3AED]/50 transition-colors"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#9CA3AF]">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-[#9CA3AF]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1F2023]/80 border border-[#2E2E38] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-[#9CA3AF] outline-none focus:border-[#7C3AED]/50 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#9B87F5] text-white font-semibold hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#9CA3AF]">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#9B87F5] hover:text-white transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
