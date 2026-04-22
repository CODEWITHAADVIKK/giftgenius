"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const STATS = [
  { value: 500000, suffix: "+", label: "Happy Recipients", prefix: "" },
  { value: 25, suffix: "Cr+", label: "Gifts Delivered", prefix: "₹" },
  { value: 4.8, suffix: "★", label: "Average Rating", prefix: "" },
  { value: 98, suffix: "%", label: "On-Time Delivery", prefix: "" },
];

function AnimatedNumber({ value, prefix, suffix }: { value: number; prefix: string; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;

    const duration = 1500;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      const current = value * eased;

      if (value >= 1000) {
        setDisplay(Math.floor(current / 1000) + "K");
      } else if (value % 1 !== 0) {
        setDisplay(current.toFixed(1));
      } else {
        setDisplay(Math.floor(current).toString());
      }

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [inView, value]);

  return (
    <span ref={ref} className="font-[var(--font-heading)] italic text-5xl md:text-6xl text-white">
      {prefix}{display}{suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-16">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="liquid-glass rounded-3xl p-10 md:p-14"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center space-y-2"
              >
                <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                <p className="text-xs md:text-sm text-white/40 font-[var(--font-body)] font-light">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
