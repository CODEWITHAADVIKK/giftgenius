"use client";

import { motion } from "framer-motion";
import { IoArrowForwardOutline, IoSparklesOutline } from "react-icons/io5";
import { useState, useEffect } from "react";

const RECIPIENTS = ["your Mom", "your Boss", "your Partner", "your Sister", "your Friend"];

export function GiftFinderTeaser() {
  const [recipientIdx, setRecipientIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRecipientIdx((i) => (i + 1) % RECIPIENTS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-16 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet/10 via-void to-void pointer-events-none" />
      <div
        className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* Left Content */}
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 liquid-glass rounded-full px-3.5 py-1.5 text-xs text-white/60 font-[var(--font-body)] mb-6"
          >
            <IoSparklesOutline className="w-3.5 h-3.5 text-gold" />
            AI Gift Wizard
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-[var(--font-heading)] italic text-white tracking-tight leading-[0.9] mb-4"
          >
            Not sure what
            <br />
            to gift
            <span className="text-violet-light">?</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-3xl font-[var(--font-heading)] italic text-white/40 mb-6 h-10"
          >
            ...for{" "}
            <motion.span
              key={recipientIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-gold-light"
            >
              {RECIPIENTS[recipientIdx]}
            </motion.span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-sm text-white/50 font-[var(--font-body)] font-light max-w-md mx-auto lg:mx-0 mb-8 leading-relaxed"
          >
            Answer 5 questions. AI analyses 500,000+ products.
            Your perfect gift — found in 60 seconds.
          </motion.p>

          <motion.a
            href="/gift-finder"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-2 liquid-glass-strong rounded-full px-7 py-3.5 text-sm font-medium text-white hover:scale-[1.03] transition-transform"
          >
            Start Gift Finder
            <IoArrowForwardOutline className="w-4 h-4" />
          </motion.a>
        </div>

        {/* Right: Wizard Preview */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex-1 max-w-md w-full"
        >
          <div className="liquid-glass rounded-3xl p-6 space-y-5">
            {/* Progress */}
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full ${
                    s <= 3 ? "bg-violet" : "bg-white/10"
                  }`}
                />
              ))}
            </div>
            <p className="text-[11px] text-white/40 font-[var(--font-body)]">
              Step 3 of 5
            </p>

            {/* Wizard Step Content */}
            <h3 className="text-xl font-[var(--font-heading)] italic text-white">
              What&apos;s your budget?
            </h3>

            <div className="space-y-3">
              {["Under ₹500", "₹500–₹2,000", "₹2,000–₹5,000", "₹5,000–₹10,000", "₹10,000+"].map(
                (range, i) => (
                  <button
                    key={range}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-[var(--font-body)] transition-all ${
                      i === 2
                        ? "bg-violet/20 border border-violet/40 text-white"
                        : "bg-white/[0.03] border border-white/[0.06] text-white/60 hover:border-white/15"
                    }`}
                  >
                    {range}
                  </button>
                )
              )}
            </div>

            <div className="flex justify-between pt-2">
              <button className="text-xs text-white/40 hover:text-white/60 transition-colors font-[var(--font-body)]">
                ← Back
              </button>
              <button className="bg-violet hover:bg-violet-light text-white text-xs px-5 py-2 rounded-full transition-colors font-medium">
                Next →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
