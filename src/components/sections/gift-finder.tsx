"use client";

import { useState } from "react";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";
import { Sparkles, Gift, Heart, Star, Loader2 } from "lucide-react";
import { useCart, CartItem } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

const suggestions = [
  "🎂 Birthday gift for my 28-year-old girlfriend who loves yoga",
  "👨‍💼 Corporate gift under ₹1500 for my boss",
  "🌿 Gift for a plant parent who just moved to a new home",
  "💻 Tech gift for a developer under ₹2000",
];

interface GiftResult {
  id: string;
  name: string;
  price: number;
  image?: string;
  tags?: string[];
}

export function GiftFinder() {
  const [prompt, setPrompt] = useState("");
  const [results, setResults] = useState<GiftResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { addItem, openCart } = useCart();

  const handleSend = async (message: string) => {
    if (!message.trim()) return;
    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch("/api/gift-finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: message,
          occasion: message,
          budget: message,
          interests: message.split(" ").filter((w) => w.length > 3),
        }),
      });
      const data = await res.json();
      setResults(data.recommendations || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: GiftResult) => {
    const item: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=400&fit=crop",
      tag: "AI Recommended",
    };
    addItem(item);
    openCart();
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

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center gap-2 mt-8 text-[#9B87F5]">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Finding perfect gifts...</span>
          </div>
        )}

        {/* Results */}
        {!loading && searched && results.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-bold text-white text-center mb-6">
              ✨ Our Top Picks for You
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {results.map((product) => (
                <div
                  key={product.id}
                  className="rounded-2xl bg-[#1F2023] border border-[#2E2E38] p-4 hover:border-[#7C3AED]/30 transition-all duration-300 group"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-[#2E2E38]">
                    <img
                      src={product.image || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=400&fit=crop"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=400&fit=crop";
                      }}
                    />
                    <span className="absolute top-2 left-2 bg-[#7C3AED]/90 text-white text-[10px] px-2 py-1 rounded-full">
                      AI Pick
                    </span>
                  </div>
                  <h4 className="text-white font-semibold text-sm mb-1">{product.name}</h4>
                  <p className="text-[#E8A87C] font-bold text-lg mb-3">₹{product.price.toLocaleString()}</p>
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9B87F5] text-white text-xs"
                    size="sm"
                  >
                    Add to Cart
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="text-center mt-8 text-[#9CA3AF]">
            No exact matches found. Try a different description!
          </div>
        )}

        {/* Quick stats row */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 md:gap-8 text-sm text-[#9CA3AF]">
          {[
            { icon: <Gift className="h-4 w-4" />, text: "500+ Curated Hampers" },
            { icon: <Heart className="h-4 w-4" />, text: "Hand-assembled with Care" },
            { icon: <Star className="h-4 w-4" />, text: "Premium Quality Guaranteed" },
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
