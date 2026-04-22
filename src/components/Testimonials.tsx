"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Quote } from "lucide-react";

const REVIEWS = [
  {
    quote: "Five-day delivery, four-times the conversions. GiftGenius changed everything for our HR team.",
    name: "Priya Sharma",
    role: "HR Director, Infosys",
    city: "Mumbai",
    verified: true,
  },
  {
    quote: "Our Diwali corporate gifting was sorted in one afternoon. The AI recommendations were spot-on. Brilliant.",
    name: "Arjun Mehta",
    role: "CEO, TechVenture",
    city: "Bengaluru",
    verified: true,
  },
  {
    quote: "The AR preview sold it. My wife cried happy tears when she saw the ring stand placed in our bedroom virtually.",
    name: "Rohan Gupta",
    role: "Customer",
    city: "Delhi",
    verified: true,
  },
];

export function Testimonials() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="liquid-glass rounded-full px-3.5 py-1.5 text-xs text-white/50 font-[var(--font-body)] inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            Customer Stories
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-heading)] italic text-white tracking-tight">
            Loved by Gifters Across India
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="liquid-glass rounded-2xl p-7 flex flex-col justify-between group hover:-translate-y-1 transition-transform duration-300"
            >
              <div>
                <Quote className="w-8 h-8 text-violet/30 mb-4" />
                <p className="text-sm text-white/80 font-[var(--font-heading)] italic leading-relaxed mb-6">
                  &ldquo;{review.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet/30 to-gold/30 flex items-center justify-center text-sm font-bold text-white">
                  {review.name[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white font-[var(--font-display)]">
                    {review.name}
                  </p>
                  <p className="text-[11px] text-white/40 font-[var(--font-body)]">
                    {review.role} · {review.city}
                  </p>
                </div>
                {review.verified && (
                  <CheckCircle2 className="w-4 h-4 text-teal flex-shrink-0" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
