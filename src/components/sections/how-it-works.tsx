"use client";

import { useEffect, useRef, useState } from "react";
import { MessageSquare, Cpu, Truck } from "lucide-react";

const steps = [
  { num: "01", title: "Tell Us About Them", desc: "Describe your recipient — their age, interests, the occasion, and your budget. The more you share, the smarter our suggestions.", icon: <MessageSquare className="h-7 w-7" /> },
  { num: "02", title: "AI Curates Options", desc: "Our AI analyzes 500+ gifts and matches the best hampers to your description. Personalized, thoughtful, and always on-point.", icon: <Cpu className="h-7 w-7" /> },
  { num: "03", title: "Gift Gets Delivered", desc: "Choose your hamper, add a personal note, and we'll handle the rest. Premium packaging. Doorstep delivery. Smiles guaranteed.", icon: <Truck className="h-7 w-7" /> },
];

export function HowItWorks() {
  const [visible, setVisible] = useState<boolean[]>(new Array(3).fill(false));
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = refs.current.map((ref, idx) => {
      if (!ref) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible((prev) => { const n = [...prev]; n[idx] = true; return n; });
            obs.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      obs.observe(ref);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <section className="relative py-28 bg-[#0D0F1A] overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#7C3AED]/30 bg-[#7C3AED]/10 px-4 py-1.5 text-sm text-[#9B87F5] mb-6">📦 How It Works</div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Three Steps to the <span className="bg-gradient-to-r from-[#7C3AED] to-[#E8A87C] bg-clip-text text-transparent">Perfect Gift</span>
          </h2>
        </div>

        <div className="relative flex flex-col gap-12">
          {/* Connecting line */}
          <div className="absolute left-[39px] top-0 bottom-0 w-px bg-gradient-to-b from-[#7C3AED]/40 via-[#9B87F5]/20 to-[#E8A87C]/40 hidden md:block" style={{ backgroundImage: "repeating-linear-gradient(to bottom, #7C3AED40 0, #7C3AED40 8px, transparent 8px, transparent 16px)" }} />

          {steps.map((step, idx) => (
            <div
              key={idx}
              ref={(el) => { refs.current[idx] = el; }}
              className={`flex items-start gap-6 transition-all duration-700 ${visible[idx] ? "opacity-100 translate-x-0" : idx % 2 === 0 ? "opacity-0 -translate-x-8" : "opacity-0 translate-x-8"}`}
              style={{ transitionDelay: `${idx * 200}ms` }}
            >
              {/* Step number circle */}
              <div className="flex-shrink-0 h-20 w-20 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center">
                <span className="text-2xl font-bold bg-gradient-to-br from-[#7C3AED] to-[#E8A87C] bg-clip-text text-transparent">{step.num}</span>
              </div>
              {/* Card */}
              <div className="flex-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-6 hover:border-[#7C3AED]/30 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-[#9B87F5]">{step.icon}</div>
                  <h3 className="text-white font-bold text-xl">{step.title}</h3>
                </div>
                <p className="text-[#9CA3AF] text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
