"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import {
  ArrowLeft, ArrowRight, Sparkles, Gift, ShoppingBag,
  Heart, Star, Eye,
} from "lucide-react";
import { products } from "@/lib/data";
import { formatINR } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

const STEPS = [
  {
    key: "recipient",
    title: "Who is the gift for?",
    subtitle: "Select the person you're gifting to",
    options: [
      { label: "Mom", emoji: "👩", value: "mom" },
      { label: "Dad", emoji: "👨", value: "dad" },
      { label: "Partner", emoji: "💕", value: "partner" },
      { label: "Sister", emoji: "👧", value: "sister" },
      { label: "Brother", emoji: "👦", value: "brother" },
      { label: "Friend", emoji: "🤝", value: "friend" },
      { label: "Boss", emoji: "💼", value: "boss" },
      { label: "Kid", emoji: "🧒", value: "kid" },
    ],
  },
  {
    key: "occasion",
    title: "What's the occasion?",
    subtitle: "We'll tailor our picks to match the vibe",
    options: [
      { label: "Birthday", emoji: "🎂", value: "birthday" },
      { label: "Diwali", emoji: "🪔", value: "diwali" },
      { label: "Wedding", emoji: "💍", value: "wedding" },
      { label: "Anniversary", emoji: "👫", value: "anniversary" },
      { label: "Raksha Bandhan", emoji: "🏮", value: "raksha-bandhan" },
      { label: "Thank You", emoji: "🙏", value: "thankyou" },
      { label: "Housewarming", emoji: "🏠", value: "housewarming" },
      { label: "Just Because", emoji: "💝", value: "justbecause" },
    ],
  },
  {
    key: "budget",
    title: "What's your budget?",
    subtitle: "We'll find the best gifts in this range",
    options: [
      { label: "Under ₹500", emoji: "💰", value: "0-500" },
      { label: "₹500 – ₹2,000", emoji: "💰", value: "500-2000" },
      { label: "₹2,000 – ₹5,000", emoji: "💎", value: "2000-5000" },
      { label: "₹5,000 – ₹10,000", emoji: "💎", value: "5000-10000" },
      { label: "₹10,000+", emoji: "👑", value: "10000-999999" },
    ],
  },
  {
    key: "personality",
    title: "Describe their personality",
    subtitle: "Pick traits that match — we'll curate accordingly",
    options: [
      { label: "Minimalist", emoji: "🤍", value: "minimalist" },
      { label: "Artistic", emoji: "🎨", value: "artistic" },
      { label: "Tech Savvy", emoji: "💻", value: "tech" },
      { label: "Traditional", emoji: "🕉️", value: "traditional" },
      { label: "Fitness", emoji: "🏋️", value: "fitness" },
      { label: "Luxury", emoji: "✨", value: "luxury" },
      { label: "Foodie", emoji: "🍽️", value: "foodie" },
      { label: "Bookworm", emoji: "📚", value: "bookworm" },
    ],
  },
  {
    key: "age",
    title: "Their age range?",
    subtitle: "Helps us personalise the selection",
    options: [
      { label: "Under 18", emoji: "🧒", value: "u18" },
      { label: "18 – 25", emoji: "🎓", value: "18-25" },
      { label: "25 – 35", emoji: "💼", value: "25-35" },
      { label: "35 – 50", emoji: "🌟", value: "35-50" },
      { label: "50+", emoji: "👑", value: "50+" },
    ],
  },
];

export default function GiftFinderPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const { addItem } = useCart();
  const { addToast } = useToast();

  const currentStep = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  const selectOption = (value: string) => {
    const updated = { ...answers, [currentStep.key]: value };
    setAnswers(updated);

    if (step < STEPS.length - 1) {
      setTimeout(() => setStep(step + 1), 300);
    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setShowResults(true);
      }, 2500);
    }
  };

  // AI recommendation logic based on answers
  const getRecommendations = () => {
    const budget = answers.budget || "0-999999";
    const [minStr, maxStr] = budget.split("-");
    const min = parseInt(minStr);
    const max = parseInt(maxStr);

    return products
      .filter((p) => p.price >= min && p.price <= max)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 pt-24">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-16 h-16 rounded-full border-2 border-violet/20 border-t-violet"
          />
          <div className="text-center">
            <h2 className="text-xl font-[var(--font-heading)] italic text-white mb-2">
              AI is analysing 500,000+ products...
            </h2>
            <p className="text-xs text-white/40 font-[var(--font-body)]">
              Matching preferences · Scoring relevance · Ranking quality
            </p>
          </div>
          <div className="flex gap-3">
            {["🧠 NCF Engine", "📊 Scoring", "✨ Curating"].map((label, i) => (
              <motion.span
                key={label}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.4 }}
                className="liquid-glass rounded-full px-3 py-1.5 text-[10px] text-white/60 font-[var(--font-body)]"
              >
                {label}
              </motion.span>
            ))}
          </div>
        </div>
      </>
    );
  }

  if (showResults) {
    const recommendations = getRecommendations();
    return (
      <>
        <Navbar />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-16 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet/30 to-gold/30 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7 text-gold" />
            </div>
            <h1 className="text-3xl md:text-4xl font-[var(--font-heading)] italic text-white mb-2">
              Your Perfect Picks
            </h1>
            <p className="text-sm text-white/50 font-[var(--font-body)]">
              AI-curated just for{" "}
              <span className="text-violet-light">
                {STEPS[0].options.find((o) => o.value === answers.recipient)?.label || "them"}
              </span>
              {" · "}
              <span className="text-gold">
                {STEPS[1].options.find((o) => o.value === answers.occasion)?.label || ""}
              </span>
            </p>

            {/* Selected Chips */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {Object.entries(answers).map(([key, val]) => {
                const stepDef = STEPS.find((s) => s.key === key);
                const opt = stepDef?.options.find((o) => o.value === val);
                return (
                  <span
                    key={key}
                    className="liquid-glass rounded-full px-3 py-1.5 text-[10px] text-white/60 font-[var(--font-body)]"
                  >
                    {opt?.emoji} {opt?.label}
                  </span>
                );
              })}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((prod, i) => (
              <motion.div
                key={prod.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="liquid-glass rounded-2xl overflow-hidden group"
              >
                <div className="flex gap-4 p-5">
                  <div className="relative w-24 h-24 rounded-xl bg-card overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Image
                      src={prod.image}
                      alt={prod.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] bg-violet/20 text-violet-light px-2 py-0.5 rounded-full font-bold">
                        {i === 0 ? "TOP PICK" : `#${i + 1} MATCH`}
                      </span>
                      <span className="text-[9px] text-gold flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-gold" /> {prod.rating}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-white font-[var(--font-display)]">
                      {prod.name}
                    </h3>
                    <p className="text-[10px] text-white/40 font-[var(--font-body)] line-clamp-2">
                      {prod.description.slice(0, 100)}...
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="font-[var(--font-mono)] text-lg font-bold text-white">
                        {formatINR(prod.price)}
                      </span>
                      <span className="font-[var(--font-mono)] text-xs text-white/30 line-through">
                        {formatINR(prod.basePrice)}
                      </span>
                      <span className="text-[10px] text-coral font-bold">
                        {prod.discount}% OFF
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          addItem({
                            id: prod.id,
                            name: prod.name,
                            price: prod.price,
                            quantity: 1,
                            image: prod.image,
                            tag: "AI Recommended",
                          });
                          addToast("cart", "Added to Cart", prod.name);
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-violet text-white text-[11px] font-medium hover:bg-violet-light transition-colors"
                      >
                        <ShoppingBag className="w-3 h-3" /> Add to Cart
                      </button>
                      <a
                        href={`/products/${prod.slug}`}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 text-white/60 text-[11px] hover:bg-white/10 transition-colors"
                      >
                        <Eye className="w-3 h-3" /> View
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-10"
          >
            <button
              onClick={() => {
                setShowResults(false);
                setStep(0);
                setAnswers({});
              }}
              className="text-xs text-violet-light hover:text-violet font-medium font-[var(--font-body)]"
            >
              ← Start Over
            </button>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center pt-24 pb-16 px-4">
        {/* Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div
            className="absolute top-[20%] left-[20%] w-[500px] h-[500px] rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative z-10 w-full max-w-xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-8"
          >
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-xs text-white/50 font-[var(--font-body)]">
              AI Gift Wizard · Step {step + 1} of {STEPS.length}
            </span>
          </motion.div>

          {/* Wizard Card */}
          <div className="liquid-glass rounded-3xl p-8 space-y-6">
            {/* Progress */}
            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <div key={i} className="h-1 flex-1 rounded-full overflow-hidden bg-white/5">
                  <motion.div
                    className="h-full bg-violet rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: i <= step ? "100%" : "0%" }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  />
                </div>
              ))}
            </div>

            {/* Selected Chips */}
            {Object.keys(answers).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {Object.entries(answers).map(([key, val]) => {
                  const stepDef = STEPS.find((s) => s.key === key);
                  const opt = stepDef?.options.find((o) => o.value === val);
                  return (
                    <span
                      key={key}
                      className="bg-violet/10 border border-violet/20 text-violet-light text-[10px] px-2.5 py-1 rounded-full font-[var(--font-body)]"
                    >
                      {opt?.emoji} {opt?.label}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Question */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-[var(--font-heading)] italic text-white">
                    {currentStep.title}
                  </h2>
                  <p className="text-xs text-white/40 font-[var(--font-body)] mt-1">
                    {currentStep.subtitle}
                  </p>
                </div>

                <div className={`grid gap-3 ${
                  currentStep.options.length > 5 ? "grid-cols-2" : "grid-cols-1"
                }`}>
                  {currentStep.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => selectOption(opt.value)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all hover:-translate-y-0.5 ${
                        answers[currentStep.key] === opt.value
                          ? "bg-violet/20 border border-violet/40 text-white"
                          : "bg-white/[0.03] border border-white/[0.06] text-white/60 hover:border-white/15 hover:bg-white/[0.05]"
                      }`}
                    >
                      <span className="text-xl">{opt.emoji}</span>
                      <span className="text-sm font-[var(--font-body)]">
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between pt-2">
              <button
                onClick={() => step > 0 && setStep(step - 1)}
                className={`flex items-center gap-1.5 text-xs font-[var(--font-body)] transition-colors ${
                  step > 0
                    ? "text-white/40 hover:text-white/60"
                    : "text-transparent pointer-events-none"
                }`}
              >
                <ArrowLeft className="w-3 h-3" /> Back
              </button>
              <button
                onClick={() => {
                  if (step < STEPS.length - 1 && answers[currentStep.key]) {
                    setStep(step + 1);
                  }
                }}
                className="text-xs text-white/30 hover:text-white/50 font-[var(--font-body)]"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
