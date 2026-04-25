"use client";

import { useState } from "react";
import { Copy, Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function OfferBanner() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("GIFTFIRST");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] via-[#9B87F5] to-[#E8A87C]" />

      {/* Sparkle particles — deterministic positions to avoid hydration mismatch */}
      {[
        { left: "12%", top: "18%", delay: "0.3s", dur: "2.8s", op: 0.5 },
        { left: "28%", top: "72%", delay: "1.1s", dur: "3.2s", op: 0.4 },
        { left: "45%", top: "31%", delay: "0.8s", dur: "2.5s", op: 0.6 },
        { left: "62%", top: "55%", delay: "2.0s", dur: "3.5s", op: 0.35 },
        { left: "78%", top: "20%", delay: "0.5s", dur: "2.9s", op: 0.7 },
        { left: "91%", top: "65%", delay: "1.5s", dur: "3.1s", op: 0.45 },
        { left: "8%", top: "48%", delay: "2.3s", dur: "2.6s", op: 0.55 },
        { left: "35%", top: "85%", delay: "0.1s", dur: "3.4s", op: 0.38 },
        { left: "55%", top: "12%", delay: "1.8s", dur: "2.7s", op: 0.62 },
        { left: "72%", top: "42%", delay: "0.6s", dur: "3.0s", op: 0.48 },
        { left: "18%", top: "90%", delay: "2.5s", dur: "2.4s", op: 0.52 },
        { left: "42%", top: "60%", delay: "1.3s", dur: "3.3s", op: 0.42 },
        { left: "88%", top: "35%", delay: "0.9s", dur: "2.3s", op: 0.58 },
        { left: "5%", top: "75%", delay: "2.1s", dur: "3.6s", op: 0.33 },
        { left: "68%", top: "8%", delay: "0.4s", dur: "2.9s", op: 0.65 },
        { left: "25%", top: "50%", delay: "1.7s", dur: "3.0s", op: 0.4 },
        { left: "82%", top: "80%", delay: "0.2s", dur: "2.5s", op: 0.55 },
        { left: "50%", top: "95%", delay: "2.8s", dur: "3.2s", op: 0.37 },
        { left: "15%", top: "30%", delay: "1.0s", dur: "2.7s", op: 0.6 },
        { left: "95%", top: "50%", delay: "0.7s", dur: "3.4s", op: 0.45 },
      ].map((s, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full animate-pulse pointer-events-none"
          style={{
            left: s.left,
            top: s.top,
            animationDelay: s.delay,
            animationDuration: s.dur,
            opacity: s.op,
          }}
        />
      ))}

      <div className="relative z-10 max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
            🎉 LAUNCH OFFER — Flat 15% OFF on your first order
          </h3>
          <p className="text-white/80 text-sm">Limited time only. Use code at checkout.</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-5 py-2.5 text-white font-mono font-bold text-lg hover:bg-white/30 transition-all cursor-pointer"
          >
            GIFTFIRST
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
          <Link
            href="/products"
            className={cn(
              buttonVariants(),
              "rounded-full bg-white text-[#7C3AED] font-semibold px-6 hover:bg-white/90 hover:scale-105 shadow-lg transition-all group"
            )}
          >
            Shop Now <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
