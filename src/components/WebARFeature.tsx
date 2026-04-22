"use client";

import { motion } from "framer-motion";
import { ArrowRight, Smartphone, Camera, Zap, Share2 } from "lucide-react";

const FEATURES = [
  { icon: Zap, label: "50+ AR Products" },
  { icon: Smartphone, label: "No App Needed" },
  { icon: Camera, label: "Works on Any Phone" },
  { icon: Share2, label: "Snap & Share" },
];

export function WebARFeature() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-16 relative overflow-hidden">
      {/* Purple Side Glow */}
      <div
        className="absolute left-0 top-1/4 w-[400px] h-[600px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at left, rgba(124,58,237,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        {/* Left Content */}
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 liquid-glass rounded-full px-3.5 py-1.5 text-xs text-teal font-[var(--font-body)] mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
            WebAR Technology
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-heading)] italic text-white tracking-tight leading-[0.9] mb-6"
          >
            See It In Your Space
            <br />
            <span className="text-teal">Before</span> You Buy
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm text-white/50 font-[var(--font-body)] font-light max-w-md mx-auto lg:mx-0 mb-8 leading-relaxed"
          >
            Point your phone, place the gift in your room, on your desk, or in your hands.
            No app downloads. Works instantly on any modern smartphone.
          </motion.p>

          {/* Feature Chips */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8"
          >
            {FEATURES.map((feat) => (
              <div
                key={feat.label}
                className="liquid-glass rounded-full px-4 py-2 text-xs text-white/60 font-[var(--font-body)] flex items-center gap-2"
              >
                <feat.icon className="w-3.5 h-3.5 text-teal" />
                {feat.label}
              </div>
            ))}
          </motion.div>

          <motion.a
            href="/products?ar=true"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-2 liquid-glass-strong rounded-full px-7 py-3.5 text-sm font-medium text-white hover:scale-[1.03] transition-transform"
          >
            Browse AR-Ready Gifts
            <ArrowRight className="w-4 h-4" />
          </motion.a>
        </div>

        {/* Right: Phone Mockup */}
        <motion.div
          initial={{ opacity: 0, x: 40, rotateY: -10 }}
          whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="flex-1 flex justify-center"
          style={{ perspective: "1000px" }}
        >
          <div
            className="relative w-72 h-[520px] rounded-[40px] bg-card-2 border-2 border-white/10 overflow-hidden shadow-2xl shadow-violet/10"
            style={{ transform: "rotateY(-5deg) rotateX(2deg)" }}
          >
            {/* Phone Screen Content */}
            <div className="absolute inset-3 rounded-[32px] bg-surface overflow-hidden">
              <div className="h-full flex flex-col items-center justify-center gap-4 p-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet/20 to-teal/20 flex items-center justify-center">
                  <span className="text-4xl">🖼️</span>
                </div>
                <div className="text-center">
                  <p className="text-xs text-white/60 font-[var(--font-body)] mb-1">
                    Placing in your room...
                  </p>
                  <p className="text-sm font-semibold text-white font-[var(--font-display)]">
                    Silver Photo Frame
                  </p>
                  <p className="text-xs text-gold font-[var(--font-mono)] mt-1">
                    ₹2,499
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="liquid-glass rounded-full px-3 py-1.5 text-[10px] text-teal flex items-center gap-1">
                    <Camera className="w-3 h-3" /> Snap
                  </span>
                  <span className="liquid-glass rounded-full px-3 py-1.5 text-[10px] text-white/60 flex items-center gap-1">
                    <Share2 className="w-3 h-3" /> Share
                  </span>
                </div>
                {/* AR Grid Lines */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="absolute inset-8 border border-teal/30 rounded-lg" />
                  <div className="absolute left-1/2 top-8 bottom-8 w-px bg-teal/20" />
                  <div className="absolute top-1/2 left-8 right-8 h-px bg-teal/20" />
                </div>
              </div>
            </div>

            {/* Phone Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-card-2 rounded-b-2xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
