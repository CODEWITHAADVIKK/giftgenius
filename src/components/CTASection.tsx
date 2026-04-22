"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-28 px-4 sm:px-6 lg:px-16 relative overflow-hidden">
      {/* Background glows */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(124,58,237,0.1) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute top-1/3 right-[20%] w-[400px] h-[400px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl lg:text-7xl font-[var(--font-heading)] italic text-white tracking-tight leading-[0.85] mb-6"
        >
          Your next gift story
          <br />
          <span className="gradient-text">starts here.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-sm md:text-base text-white/50 font-[var(--font-body)] font-light mb-10"
        >
          Book a free gifting consultation. Zero commitment. Just possibilities.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="/gift-finder"
            className="liquid-glass-strong rounded-full px-8 py-4 text-sm font-medium text-white flex items-center gap-2 hover:scale-[1.03] transition-transform"
          >
            Find My Gift
            <ArrowUpRight className="w-4 h-4" />
          </a>
          <a
            href="/products"
            className="bg-white text-void rounded-full px-8 py-4 text-sm font-medium flex items-center gap-2 hover:scale-[1.03] transition-transform hover:bg-white/90"
          >
            View Catalogue
          </a>
        </motion.div>
      </div>
    </section>
  );
}
