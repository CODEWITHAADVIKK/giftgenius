"use client";

import { useEffect, useRef, useState } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rohan Das",
    role: "Mumbai, Maharashtra",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    product: "The Gentleman's Box — ₹1,999",
    quote: "I ordered The Gentleman's Box for my dad's 60th birthday. The packaging was absolutely stunning — matte black with gold foil. His reaction? Speechless. GiftGenius turned a simple gift into an unforgettable experience.",
  },
  {
    name: "Raj Prakash",
    role: "Bangalore, Karnataka",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    product: "Self-Care Soother — ₹1,299",
    quote: "Thoughtfully curated, beautifully packaged, and delivered right on time. The AI recommendations were spot-on — it suggested the Self-Care Soother for my wife and she absolutely loved every item in it.",
  },
  {
    name: "Sneha M",
    role: "Delhi, NCR",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    product: "Blush & Bloom — ₹1,539",
    quote: "Ordered Blush & Bloom for my sister's graduation and it made her entire week! The flowers were fresh, the skincare products were premium quality, and the handwritten note added such a personal touch. 10/10!",
  },
];

export function Testimonials() {
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
        { threshold: 0.2 }
      );
      obs.observe(ref);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <section className="relative py-28 bg-[#0D0F1A] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(124,58,237,0.08),transparent)] pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#9B87F5]/30 bg-[#9B87F5]/10 px-4 py-1.5 text-sm text-[#9B87F5] mb-6">💬 What Our Customers Say</div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Loved by <span className="bg-gradient-to-r from-[#7C3AED] to-[#E8A87C] bg-clip-text text-transparent">Thousands</span>
          </h2>
          <p className="text-[#9CA3AF] text-lg max-w-xl mx-auto">Real stories from real people who made someone&apos;s day extra special.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} ref={(el) => { refs.current[idx] = el; }}
              className={`rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-6 transition-all duration-700 ${visible[idx] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${idx * 150}ms` }}>
              <Quote className="h-8 w-8 text-[#7C3AED]/30 mb-4" />
              <div className="flex gap-1 mb-4">{[...Array(t.rating)].map((_, i) => <Star key={i} className="h-4 w-4 fill-[#E8A87C] text-[#E8A87C]" />)}</div>
              <p className="text-[#9CA3AF] text-sm leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
              <div className="mb-4 inline-block rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 px-3 py-1 text-xs text-[#9B87F5]">{t.product}</div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover ring-2 ring-[#7C3AED]/30" />
                <div><p className="text-white font-medium text-sm">{t.name}</p><p className="text-[#9CA3AF] text-xs">{t.role}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
