"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { IoArrowForwardOutline, IoPhonePortraitOutline, IoCameraOutline, IoFlashOutline, IoShareSocialOutline, IoCloseOutline, IoRefreshOutline } from "react-icons/io5";
import { products } from "@/lib/data";

const FEATURES = [
  { icon: IoFlashOutline, label: "50+ AR Products" },
  { icon: IoPhonePortraitOutline, label: "No App Needed" },
  { icon: IoCameraOutline, label: "Works on Any Phone" },
  { icon: IoShareSocialOutline, label: "Snap & Share" },
];

const arProducts = products.filter((p) => p.ar);

export function WebARFeature() {
  const [activeAR, setActiveAR] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const animRef = useRef<number>(0);

  // Animate rotation when AR is active
  useEffect(() => {
    if (!activeAR) return;
    const animate = () => {
      setRotation((r) => (r + 0.3) % 360);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [activeAR]);

  const activeProduct = arProducts.find((p) => p.id === activeAR);

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
            className="inline-flex items-center gap-2 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 px-3.5 py-1.5 text-xs text-[#10B981] mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            WebAR Technology
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight mb-6"
          >
            See It In Your Space
            <br />
            <span className="bg-gradient-to-r from-[#10B981] to-[#7C3AED] bg-clip-text text-transparent">
              Before
            </span>{" "}
            You Buy
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm text-white/50 max-w-md mx-auto lg:mx-0 mb-8 leading-relaxed"
          >
            Point your phone, place the gift in your room, on your desk, or in your
            hands. No app downloads. Works instantly on any modern smartphone.
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
                className="rounded-full border border-[#2E2E38] bg-[#1F2023] px-4 py-2 text-xs text-white/60 flex items-center gap-2"
              >
                <feat.icon className="w-3.5 h-3.5 text-[#10B981]" />
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
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9B87F5] px-7 py-3.5 text-sm font-medium text-white hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all"
          >
            Browse AR-Ready Gifts
            <IoArrowForwardOutline className="w-4 h-4" />
          </motion.a>
        </div>

        {/* Right: Phone Mockup / AR Preview */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="flex-1 flex justify-center"
        >
          <div
            className="relative w-72 h-[520px] rounded-[40px] bg-[#1F2023] border-2 border-white/10 overflow-hidden shadow-2xl shadow-[#7C3AED]/10"
            style={{ transform: "rotateY(-5deg) rotateX(2deg)", perspective: "1000px" }}
          >
            {/* Phone Screen Content */}
            <div className="absolute inset-3 rounded-[32px] bg-[#0D0F1A] overflow-hidden">
              <AnimatePresence mode="wait">
                {activeProduct ? (
                  <motion.div
                    key="ar-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col"
                  >
                    {/* AR Header */}
                    <div className="flex items-center justify-between p-3">
                      <span className="text-[10px] text-[#10B981] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                        AR Active
                      </span>
                      <button
                        onClick={() => { setActiveAR(null); setScale(1); }}
                        className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"
                      >
                        <IoCloseOutline className="w-3 h-3 text-white/60" />
                      </button>
                    </div>

                    {/* AR Product View */}
                    <div className="flex-1 flex items-center justify-center relative">
                      {/* Grid lines */}
                      <div className="absolute inset-4 border border-[#10B981]/20 rounded-lg" />
                      <div className="absolute left-1/2 top-4 bottom-4 w-px bg-[#10B981]/10" />
                      <div className="absolute top-1/2 left-4 right-4 h-px bg-[#10B981]/10" />

                      <div
                        style={{
                          transform: `rotateY(${rotation}deg) scale(${scale})`,
                          transition: "transform 0.1s linear",
                        }}
                        className="relative w-32 h-32 rounded-2xl overflow-hidden shadow-lg shadow-[#7C3AED]/20"
                      >
                        <Image
                          src={activeProduct.image}
                          alt={activeProduct.name}
                          fill
                          sizes="128px"
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* AR Controls */}
                    <div className="p-3 space-y-2">
                      <p className="text-sm font-semibold text-white text-center">
                        {activeProduct.name}
                      </p>
                      <p className="text-xs text-[#10B981] text-center">
                        ₹{activeProduct.price.toLocaleString()}
                      </p>
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => setScale((s) => Math.min(s + 0.2, 2))}
                          className="px-3 py-1.5 rounded-full bg-white/5 text-white/60 text-[10px] border border-white/10"
                        >
                          + Zoom
                        </button>
                        <button
                          onClick={() => setScale((s) => Math.max(s - 0.2, 0.4))}
                          className="px-3 py-1.5 rounded-full bg-white/5 text-white/60 text-[10px] border border-white/10"
                        >
                          − Zoom
                        </button>
                        <button
                          onClick={() => { setRotation(0); setScale(1); }}
                          className="px-3 py-1.5 rounded-full bg-white/5 text-white/60 text-[10px] border border-white/10"
                        >
                          <IoRefreshOutline className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="product-list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col"
                  >
                    <div className="p-3 border-b border-white/5">
                      <p className="text-[11px] text-white/60 font-medium">
                        📱 Tap a product to view in AR
                      </p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ scrollbarWidth: "none" }}>
                      {arProducts.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setActiveAR(p.id)}
                          className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#7C3AED]/30 hover:bg-[#7C3AED]/5 transition-all text-left"
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#1F2023] relative">
                            <Image
                              src={p.image}
                              alt={p.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-white truncate">
                              {p.name}
                            </p>
                            <p className="text-[10px] text-[#10B981]">
                              ₹{p.price.toLocaleString()} · AR Ready
                            </p>
                          </div>
                          <IoCameraOutline className="w-4 h-4 text-white/20 flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Phone Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#1F2023] rounded-b-2xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
