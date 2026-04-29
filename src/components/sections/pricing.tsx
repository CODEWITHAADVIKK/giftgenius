"use client";

import { IoGiftOutline, IoSparklesOutline, IoDiamondOutline } from "react-icons/io5";
import { FaCrown } from "react-icons/fa";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tiers = [
  { title: "Under ₹599", desc: "Thoughtful everyday gifts — mugs, candles, keychains", icon: <IoGiftOutline className="h-6 w-6" />, color: "#10B981", items: "50+ options" },
  { title: "Under ₹999", desc: "Curated combos — skincare sets, gourmet snacks, planters", icon: <IoSparklesOutline className="h-6 w-6" />, color: "#7C3AED", items: "120+ options" },
  { title: "Under ₹1399", desc: "Premium hampers — wellness kits, tech accessories, décor", icon: <FaCrown className="h-6 w-6" />, color: "#E8A87C", items: "80+ options" },
  { title: "Under ₹1999", desc: "Luxury collections — jewellery, pashmina, crystal lamps", icon: <IoDiamondOutline className="h-6 w-6" />, color: "#F97316", items: "60+ options" },
];

export function Pricing() {
  return (
    <section className="relative py-28 bg-[#0D0F1A] overflow-hidden">
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] rounded-full bg-[#7C3AED]/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full bg-[#E8A87C]/10 blur-[120px] pointer-events-none" />
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E8A87C]/30 bg-[#E8A87C]/10 px-4 py-1.5 text-sm text-[#E8A87C] mb-6">💰 Shop by Budget</div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Gifts for Every <span className="bg-gradient-to-r from-[#E8A87C] to-[#7C3AED] bg-clip-text text-transparent">Budget</span>
          </h2>
          <p className="text-[#9CA3AF] text-lg max-w-xl mx-auto">Premium doesn&apos;t have to mean expensive. Find the perfect gift at the perfect price.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier, idx) => (
            <div key={idx} className="group relative rounded-2xl border border-[#2E2E38] bg-[#1F2023] p-6 hover:border-[#7C3AED]/50 hover:shadow-[0_0_30px_rgba(124,58,237,0.15)] hover:scale-[1.03] transition-all duration-500 cursor-pointer">
              <div className="h-14 w-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: `${tier.color}20`, color: tier.color }}>{tier.icon}</div>
              <h3 className="text-white font-bold text-xl mb-2">{tier.title}</h3>
              <p className="text-[#9CA3AF] text-sm mb-4 leading-relaxed">{tier.desc}</p>
              <p className="text-xs text-[#9B87F5] mb-6">{tier.items}</p>
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "w-full rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#9B87F5] text-white hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all"
                )}
              >
                Get Started Free
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
