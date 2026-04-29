"use client";

import { motion } from "framer-motion";
import { IoLockClosedOutline, IoShieldCheckmarkOutline, IoDocumentTextOutline, IoRefreshOutline } from "react-icons/io5";

const PAYMENT_METHODS = [
  "UPI", "GPay", "PhonePe", "Paytm", "Visa", "Mastercard", "RuPay", "COD",
];

const TRUST_BADGES = [
  { icon: IoLockClosedOutline, label: "Razorpay Secured" },
  { icon: IoShieldCheckmarkOutline, label: "PCI-DSS Compliant" },
  { icon: IoDocumentTextOutline, label: "GST Invoice" },
  { icon: IoRefreshOutline, label: "7-Day Return" },
];

export function PaymentTrust() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-16 border-y border-white/5">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-[var(--font-heading)] italic text-white tracking-tight mb-8"
        >
          Pay Your Way — 100% Secure
        </motion.h2>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          {PAYMENT_METHODS.map((method) => (
            <span
              key={method}
              className="liquid-glass rounded-full px-4 py-2 text-xs text-white/60 font-[var(--font-mono)] font-medium"
            >
              {method}
            </span>
          ))}
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {TRUST_BADGES.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 text-xs text-white/40 font-[var(--font-body)]"
            >
              <badge.icon className="w-3.5 h-3.5 text-teal" />
              {badge.label}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
