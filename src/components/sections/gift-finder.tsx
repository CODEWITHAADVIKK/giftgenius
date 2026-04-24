"use client";

import { useState } from "react";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";
import { Sparkles, Gift, Heart, Star } from "lucide-react";

const suggestions = [
  "🎂 Birthday gift for my 28-year-old girlfriend who loves yoga",
  "👨‍💼 Corporate gift under ₹1500 for my boss",
  "🌿 Gift for a plant parent who just moved to a new home",
  "💻 Tech gift for a developer under ₹2000",
];

export function GiftFinder() {
  const [messages, setMessages] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");

  const handleSend = (message: string) => {
    setMessages((prev) => [...prev, message]);
    // Scroll to collections or show AI results here
    window.location.hash = "collections";
  };

  return (
    <section
      id="gift-finder"
      className="relative py-28 bg-[#0D0F1A] overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(124,58,237,0.15),transparent)] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#7C3AED]/30 bg-[#7C3AED]/10 px-4 py-1.5 text-sm text-[#9B87F5] mb-6">
            <Sparkles className="h-4 w-4" /> AI-Powered Gift Discovery
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Tell us about{" "}
            <span className="bg-gradient-to-r from-[#7C3AED] to-[#E8A87C] bg-clip-text text-transparent">
              your recipient
            </span>
          </h2>
          <p className="text-[#9CA3AF] text-lg max-w-xl mx-auto">
            Describe who you&apos;re gifting and their interests — our AI will
            recommend the perfect hampers from our curated collection.
          </p>
        </div>

        {/* Suggestion chips */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => setPrompt(s)}
              className="rounded-full border border-[#2E2E38] bg-[#1F2023] px-4 py-2 text-sm text-[#9CA3AF] hover:border-[#7C3AED]/50 hover:text-white hover:bg-[#7C3AED]/10 transition-all duration-300 cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>

        {/* AI Prompt Input */}
        <PromptInputBox
          value={prompt}
          onChange={setPrompt}
          onSend={handleSend}
          placeholder="e.g. 'A self-care gift for my best friend who loves skincare and candles, budget ₹1500...'"
          className="w-full"
        />

        {/* Quick stats row */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 md:gap-8 text-sm text-[#9CA3AF]">
          {[
            {
              icon: <Gift className="h-4 w-4" />,
              text: "500+ Curated Hampers",
            },
            {
              icon: <Heart className="h-4 w-4" />,
              text: "Hand-assembled with Care",
            },
            {
              icon: <Star className="h-4 w-4" />,
              text: "Premium Quality Guaranteed",
            },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-[#9B87F5]">
              {item.icon}
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
