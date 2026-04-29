"use client";

import { motion } from "framer-motion";
import { IoChatboxOutline, IoHardwareChipOutline, IoCarOutline } from "react-icons/io5";

const steps = [
  { num: "01", title: "Tell Us About Them", desc: "Describe your recipient — their age, interests, the occasion, and your budget. The more you share, the smarter our suggestions.", icon: <IoChatboxOutline className="h-7 w-7" /> },
  { num: "02", title: "AI Curates Options", desc: "Our AI analyzes 500+ gifts and matches the best hampers to your description. Personalized, thoughtful, and always on-point.", icon: <IoHardwareChipOutline className="h-7 w-7" /> },
  { num: "03", title: "Gift Gets Delivered", desc: "Choose your hamper, add a personal note, and we'll handle the rest. Premium packaging. Doorstep delivery. Smiles guaranteed.", icon: <IoCarOutline className="h-7 w-7" /> },
];

export function HowItWorks() {
  return (
    <section className="relative py-28 bg-[#0D0F1A] overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#7C3AED]/30 bg-[#7C3AED]/10 px-4 py-1.5 text-sm text-[#9B87F5] mb-6">📦 How It Works</div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Three Steps to the <span className="bg-gradient-to-r from-[#7C3AED] to-[#E8A87C] bg-clip-text text-transparent">Perfect Gift</span>
          </h2>
        </motion.div>

        <div className="relative flex flex-col gap-12">
          {/* Connecting line */}
          <div className="absolute left-[39px] top-0 bottom-0 w-px bg-gradient-to-b from-[#7C3AED]/40 via-[#9B87F5]/20 to-[#E8A87C]/40 hidden md:block" style={{ backgroundImage: "repeating-linear-gradient(to bottom, #7C3AED40 0, #7C3AED40 8px, transparent 8px, transparent 16px)" }} />

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.2, duration: 0.6, ease: "easeOut" }}
              className="flex items-start gap-6"
            >
              {/* Step number circle */}
              <div className="flex-shrink-0 h-20 w-20 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center">
                <span className="text-2xl font-bold bg-gradient-to-br from-[#7C3AED] to-[#E8A87C] bg-clip-text text-transparent">{step.num}</span>
              </div>
              {/* Card */}
              <div className="flex-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-6 hover:border-[#7C3AED]/30 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-[#9B87F5]">{step.icon}</div>
                  <h3 className="text-white font-bold text-xl">{step.title}</h3>
                </div>
                <p className="text-[#9CA3AF] text-sm leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
