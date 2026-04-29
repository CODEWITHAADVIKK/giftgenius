"use client";

import { motion } from "framer-motion";
import { IoEllipseOutline, IoCarOutline } from "react-icons/io5";

const STEPS = [
  {
    num: "01",
    title: "Tell Us About Them",
    desc: "Voice or text — describe who you're gifting and the occasion. Our NLU understands 8 Indian languages.",
    icon: IoEllipseOutline,
    color: "text-violet-light",
  },
  {
    num: "02",
    title: "AI Finds the Perfect Match",
    desc: "NCF engine scores 500K+ products against your preferences. GPT-4o refines the shortlist in real-time.",
    icon: IoEllipseOutline,
    color: "text-gold",
  },
  {
    num: "03",
    title: "Gift Arrives with Love",
    desc: "Premium packaging, gift wrapping, and personal message. Track every step with real-time updates.",
    icon: IoCarOutline,
    color: "text-teal",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-16 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="liquid-glass rounded-full px-3.5 py-1.5 text-xs text-white/50 font-[var(--font-body)] inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-light animate-pulse" />
            Simple as 1-2-3
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-heading)] italic text-white tracking-tight">
            How It Works
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative">
          {/* Connecting Lines (desktop) */}
          <div className="hidden md:block absolute top-1/2 left-[calc(33.33%+1rem)] right-[calc(33.33%+1rem)] h-px">
            <div className="w-full h-full border-t-2 border-dashed border-white/10" />
          </div>

          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative liquid-glass rounded-2xl p-8 text-center group hover:-translate-y-1 transition-transform duration-300"
            >
              {/* Step Number */}
              <span className={`font-[var(--font-mono)] text-5xl font-bold ${step.color} opacity-20 absolute top-4 right-6`}>
                {step.num}
              </span>

              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-5`}>
                <step.icon className={`w-6 h-6 ${step.color}`} />
              </div>

              <h3 className="text-lg font-[var(--font-display)] font-bold text-white mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-white/50 font-[var(--font-body)] font-light leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
