"use client";

import { useState } from "react";
import Link from "next/link";
import { IoGiftOutline, IoSendOutline, IoGlobeOutline, IoCameraOutline, IoBriefcaseOutline, IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/ToastContext";

const footerLinks = {
  "Gifts for All": ["Birthday Gifts", "Anniversary Gifts", "Diwali Gifts", "Corporate Gifts", "Wedding Gifts", "Housewarming"],
  "Quick Links": ["Gift Finder AI", "Track Order", "FAQs", "Contact Us", "About Us", "Blog"],
};

const socials = [
  { icon: <IoGlobeOutline className="h-5 w-5" />, label: "Facebook", from: "#1877F2", to: "#4C9EEB" },
  { icon: <IoCameraOutline className="h-5 w-5" />, label: "Instagram", from: "#F77737", to: "#E1306C" },
  { icon: <IoBriefcaseOutline className="h-5 w-5" />, label: "LinkedIn", from: "#0A66C2", to: "#5BB5F0" },
  { icon: <IoChatbubbleEllipsesOutline className="h-5 w-5" />, label: "WhatsApp", from: "#25D366", to: "#128C7E" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const { addToast } = useToast();

  const handleSubscribe = () => {
    if (!email) {
      addToast("error", "Email Required", "Please enter your email to subscribe.");
      return;
    }
    addToast("success", "Subscribed!", "You've successfully subscribed to our newsletter.");
    setEmail("");
  };

  return (
    <footer className="relative bg-[#080A12] border-t border-[#1A1A2E] pt-20 pb-8 overflow-hidden">
      {/* Star field bg */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.15) 0%, transparent 100%), radial-gradient(1px 1px at 70% 60%, rgba(255,255,255,0.1) 0%, transparent 100%), radial-gradient(1px 1px at 40% 80%, rgba(255,255,255,0.12) 0%, transparent 100%), radial-gradient(1px 1px at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 100%), radial-gradient(1px 1px at 10% 90%, rgba(255,255,255,0.1) 0%, transparent 100%)"
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Logo + tagline */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl mb-4">
              <IoGiftOutline className="h-6 w-6 text-[#7C3AED]" />
              <span className="bg-gradient-to-r from-[#7C3AED] to-[#E8A87C] bg-clip-text text-transparent">GiftGenius</span>
            </Link>
            <p className="text-[#9CA3AF] text-sm leading-relaxed mb-6">AI-powered gifting for modern India. Find, personalize, and deliver the perfect gift — every time.</p>
            <div className="flex gap-3">
              {socials.map((s, i) => (
                <button key={i} className="h-10 w-10 rounded-full bg-[#1F2023] border border-[#2E2E38] flex items-center justify-center text-[#9CA3AF] hover:text-white transition-all duration-300 cursor-pointer" style={{ ["--glow" as string]: s.from }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = s.from; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 15px ${s.from}40`; (e.currentTarget as HTMLElement).style.color = s.from; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#2E2E38"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.color = "#9CA3AF"; }}
                  aria-label={s.label}>{s.icon}</button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => {
                  let href = "#";
                  if (link === "Gift Finder AI") href = "/gift-finder";
                  else if (title === "Gifts for All") href = `/products?category=${link.toLowerCase()}`;
                  return (
                    <li key={link}>
                      <Link href={href} className="text-[#9CA3AF] text-sm hover:text-white transition-colors">
                        {link}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4">Subscribe</h4>
            <p className="text-[#9CA3AF] text-sm mb-4">Get gift ideas & exclusive offers straight to your inbox.</p>
            <div className="flex gap-2">
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="flex-1 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm px-4 py-2.5 text-sm text-white placeholder-[#9CA3AF]/50 outline-none focus:border-[#7C3AED]/50 transition-all"
              />
              <Button size="sm" onClick={handleSubscribe} className="rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#9B87F5] text-white px-4">
                <IoSendOutline className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-[#1A1A2E] text-center text-[#9CA3AF] text-xs">
          © 2026 GiftGenius AI. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
