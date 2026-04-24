"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Play, Mic, MicOff, X } from "lucide-react";
import { useVoiceSearch } from "@/lib/useVoiceSearch";

const FLOATING_PRODUCTS = [
  { emoji: "⌚", label: "Smartwatch", top: "12%", left: "5%", rotate: -8, delay: 0 },
  { emoji: "👜", label: "Handbag", top: "8%", left: "42%", rotate: 5, delay: 0.3 },
  { emoji: "👟", label: "Sneakers", top: "15%", right: "6%", rotate: 10, delay: 0.6 },
  { emoji: "🕯️", label: "Candle", bottom: "22%", left: "3%", rotate: -12, delay: 0.2 },
  { emoji: "💍", label: "Ring", bottom: "18%", left: "38%", rotate: 3, delay: 0.5 },
  { emoji: "🎧", label: "Headphones", bottom: "25%", right: "4%", rotate: 8, delay: 0.4 },
];

export function Hero() {
  const router = useRouter();
  const [showVoiceOverlay, setShowVoiceOverlay] = useState(false);

  const handleVoiceResult = useCallback(
    (transcript: string) => {
      setTimeout(() => {
        setShowVoiceOverlay(false);
        router.push(`/products?q=${encodeURIComponent(transcript)}`);
      }, 800);
    },
    [router]
  );

  const {
    isListening,
    transcript,
    error,
    isSupported,
    toggleListening,
    stopListening,
  } = useVoiceSearch(handleVoiceResult);

  const handleVoiceClick = () => {
    if (!isSupported) {
      alert("Voice search is not supported in this browser. Try Chrome or Edge.");
      return;
    }
    setShowVoiceOverlay(true);
    toggleListening();
  };

  const handleCloseOverlay = () => {
    stopListening();
    setShowVoiceOverlay(false);
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-4 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-[10%] w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-[20%] right-[10%] w-[500px] h-[500px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[300px]"
          style={{
            background: "linear-gradient(to bottom, transparent, #07080F)",
          }}
        />
      </div>

      {/* Floating Product Emojis (Desktop only) */}
      {FLOATING_PRODUCTS.map((item, i) => (
        <motion.div
          key={i}
          className="absolute hidden lg:flex flex-col items-center gap-1 pointer-events-none select-none"
          style={{
            top: item.top,
            left: item.left,
            right: (item as { right?: string }).right,
            bottom: (item as { bottom?: string }).bottom,
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0.4, 0.7, 0.4],
            y: [0, -14, 0],
            rotate: [item.rotate - 3, item.rotate + 3, item.rotate - 3],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut",
          }}
        >
          <span className="text-5xl drop-shadow-2xl">{item.emoji}</span>
          <span className="text-[10px] text-white/30 font-[var(--font-body)]">
            {item.label}
          </span>
        </motion.div>
      ))}

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="liquid-glass rounded-full px-1.5 py-1.5 flex items-center gap-2 mb-8"
        >
          <span className="bg-white text-void rounded-full px-3 py-1 text-xs font-bold font-[var(--font-body)]">
            AI-Powered
          </span>
          <span className="text-white/70 text-xs font-[var(--font-body)] pr-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-light animate-pulse" />
            Gift discovery for modern India
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-[var(--font-heading)] italic tracking-[-0.04em] leading-[0.85] mb-6"
        >
          Find the Perfect{" "}
          <span className="gradient-text">Gift</span>
          <br />
          in Seconds
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-sm md:text-base text-white/60 font-[var(--font-body)] font-light max-w-xl leading-relaxed mb-4"
        >
          GiftGenius learns your style, your occasion, your budget.
          Then finds gifts that genuinely delight — with AR preview,
          voice search in 8 Indian languages, and secure Razorpay checkout.
        </motion.p>

        {/* Feature Chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {["🕶️ AR Preview", "🗣️ Voice Search", "🌐 8 Languages", "💳 Razorpay"].map(
            (chip) => (
              <span
                key={chip}
                className="liquid-glass rounded-full px-3 py-1.5 text-xs text-white/60 font-[var(--font-body)]"
              >
                {chip}
              </span>
            )
          )}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-12"
        >
          <a
            href="/gift-finder"
            className="liquid-glass-strong rounded-full px-7 py-3.5 text-sm font-medium text-white flex items-center gap-2 hover:scale-[1.03] transition-transform group"
          >
            Find My Gift
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
          <button className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-[var(--font-body)]">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Play className="w-3.5 h-3.5 fill-current" />
            </div>
            Watch Demo
          </button>
        </motion.div>

        {/* Voice Search Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.3 }}
          className="relative mb-12"
        >
          <button
            onClick={handleVoiceClick}
            className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
              isListening
                ? "bg-gradient-to-br from-coral to-coral/80 shadow-coral/30 scale-110"
                : "bg-gradient-to-br from-violet to-violet-light shadow-violet/30 hover:shadow-violet/50"
            }`}
          >
            {isListening ? (
              <MicOff className="w-5 h-5 text-white" />
            ) : (
              <Mic className="w-5 h-5 text-white" />
            )}
            {/* Pulsing rings */}
            {isListening ? (
              <>
                <span className="absolute inset-0 rounded-full border-2 border-coral/40 animate-ping" />
                <span
                  className="absolute -inset-2 rounded-full border border-coral/20 animate-ping"
                  style={{ animationDelay: "0.3s" }}
                />
                <span
                  className="absolute -inset-4 rounded-full border border-coral/10 animate-ping"
                  style={{ animationDelay: "0.6s" }}
                />
              </>
            ) : (
              <>
                <span className="absolute inset-0 rounded-full border-2 border-violet-light/40 animate-ping" />
                <span
                  className="absolute -inset-2 rounded-full border border-violet/20 animate-ping"
                  style={{ animationDelay: "0.5s" }}
                />
              </>
            )}
          </button>
          <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[11px] text-white/40 font-[var(--font-body)] whitespace-nowrap">
            {isListening ? "Listening..." : "Say: \"Gift for my mum\""}
          </span>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-8"
        >
          <div className="liquid-glass rounded-full px-4 py-2 flex items-center gap-2 text-xs font-[var(--font-body)]">
            <span className="text-gold">⭐</span>
            <span className="text-white/80">4.8</span>
            <span className="text-white/40">·</span>
            <span className="text-white/60 font-[var(--font-mono)]">50,000+ Reviews</span>
          </div>
          <div className="liquid-glass rounded-full px-4 py-2 flex items-center gap-2 text-xs font-[var(--font-body)]">
            <span className="text-gold">🎁</span>
            <span className="text-white/60 font-[var(--font-mono)]">₹25 Crore+ in Gifts Delivered</span>
          </div>
        </motion.div>

        {/* City Trust Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7 }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-[11px] text-white/30 font-[var(--font-body)] uppercase tracking-widest">
            Trusted across India&apos;s major metros
          </span>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            {["Mumbai", "Delhi", "Bengaluru", "Chennai", "Hyderabad", "Pune"].map(
              (city) => (
                <span
                  key={city}
                  className="text-lg font-[var(--font-heading)] italic text-white/25 hover:text-white/50 transition-colors cursor-default"
                >
                  {city}
                </span>
              )
            )}
          </div>
        </motion.div>
      </div>

      {/* Voice Search Overlay */}
      <AnimatePresence>
        {showVoiceOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-void/90 backdrop-blur-xl flex flex-col items-center justify-center"
          >
            <button
              onClick={handleCloseOverlay}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center gap-8 max-w-md text-center"
            >
              {/* Animated Mic */}
              <div className="relative">
                <motion.div
                  animate={
                    isListening
                      ? {
                          scale: [1, 1.15, 1],
                          boxShadow: [
                            "0 0 0 0 rgba(255, 107, 107, 0)",
                            "0 0 0 30px rgba(255, 107, 107, 0)",
                            "0 0 0 0 rgba(255, 107, 107, 0)",
                          ],
                        }
                      : {}
                  }
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                  }}
                  className={`w-24 h-24 rounded-full flex items-center justify-center ${
                    isListening
                      ? "bg-gradient-to-br from-coral to-coral/80"
                      : "bg-gradient-to-br from-violet to-violet-light"
                  }`}
                >
                  {isListening ? (
                    <MicOff className="w-10 h-10 text-white" />
                  ) : (
                    <Mic className="w-10 h-10 text-white" />
                  )}
                </motion.div>

                {/* Sound wave indicators */}
                {isListening && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="absolute rounded-full border border-coral/30"
                        initial={{ width: 96, height: 96, opacity: 1 }}
                        animate={{
                          width: [96, 200],
                          height: [96, 200],
                          opacity: [0.6, 0],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                          delay: i * 0.5,
                          ease: "easeOut",
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Status Text */}
              <div className="space-y-3">
                <h2 className="text-2xl font-[var(--font-heading)] italic text-white">
                  {isListening
                    ? "Listening..."
                    : error
                    ? "Oops!"
                    : transcript
                    ? "Got it!"
                    : "Tap to speak"}
                </h2>
                <p className="text-sm text-white/50 font-[var(--font-body)]">
                  {isListening
                    ? "Speak naturally — say what you're looking for"
                    : error
                    ? error
                    : transcript
                    ? `Searching for "${transcript}"...`
                    : "Try: \"Gift for my mom under 2000 rupees\""}
                </p>
              </div>

              {/* Live Transcript */}
              {transcript && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="liquid-glass rounded-2xl px-6 py-4 max-w-sm"
                >
                  <p className="text-xs text-white/40 font-[var(--font-body)] mb-1">
                    You said:
                  </p>
                  <p className="text-lg text-white font-[var(--font-display)]">
                    &ldquo;{transcript}&rdquo;
                  </p>
                </motion.div>
              )}

              {/* Retry / Cancel */}
              {!isListening && (
                <div className="flex gap-3">
                  <button
                    onClick={toggleListening}
                    className="px-6 py-3 rounded-full bg-violet text-white text-sm font-medium hover:bg-violet-light transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={handleCloseOverlay}
                    className="px-6 py-3 rounded-full bg-white/5 text-white/60 text-sm hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Language Support */}
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {["English", "Hindi", "Tamil", "Telugu", "Bengali", "Marathi", "Gujarati", "Kannada"].map(
                  (lang) => (
                    <span
                      key={lang}
                      className="text-[10px] text-white/25 font-[var(--font-body)]"
                    >
                      {lang}
                    </span>
                  )
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
