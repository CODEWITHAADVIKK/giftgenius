"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, ArrowRight, Gift, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, subtotal, itemCount, getProduct } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 z-[160] w-full sm:w-[420px] bg-void flex flex-col"
            style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }}
          >
            {/* Header */}
            <div className="px-6 py-5 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-violet-light" />
                <h2 className="font-[var(--font-heading)] italic text-xl text-white">
                  Your Cart
                </h2>
                <span className="bg-violet/20 text-violet-light text-xs px-2 py-0.5 rounded-full font-[var(--font-mono)]">
                  {itemCount}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-white/40 hover:text-white transition-colors rounded-full hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <div className="w-20 h-20 rounded-full bg-white/[0.03] flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-white/20" />
                  </div>
                  <p className="text-sm text-white/40 font-[var(--font-body)]">
                    Your cart is empty
                  </p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-xs text-violet-light hover:text-violet font-medium"
                  >
                    Continue Shopping →
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => {
                      const prod = getProduct(item.productId);
                      if (!prod) return null;
                      return (
                        <motion.div
                          key={item.productId}
                          layout
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -30, height: 0 }}
                          className="flex gap-4 p-3 bg-surface rounded-xl border border-white/[0.04]"
                        >
                          {/* Image */}
                          <div className="relative w-20 h-20 rounded-lg bg-card overflow-hidden flex-shrink-0">
                            <Image
                              src={prod.image}
                              alt={prod.name}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 space-y-1">
                            <h4 className="text-sm font-semibold text-white font-[var(--font-display)] truncate">
                              {prod.name}
                            </h4>
                            <div className="flex items-center gap-2 text-[10px] text-white/40 font-[var(--font-body)]">
                              {item.color && <span>{item.color}</span>}
                              {item.size && <span>· {item.size}</span>}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-[var(--font-mono)] text-sm font-bold text-white">
                                {formatINR(prod.price * item.quantity)}
                              </span>
                              {item.quantity > 1 && (
                                <span className="text-[10px] text-white/30 font-[var(--font-mono)]">
                                  ({formatINR(prod.price)} × {item.quantity})
                                </span>
                              )}
                            </div>

                            {/* Gift Wrap */}
                            {item.giftWrap && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-gold font-[var(--font-body)]">
                                <Gift className="w-3 h-3" /> Gift wrapped
                              </span>
                            )}

                            {/* Qty Controls */}
                            <div className="flex items-center gap-2 mt-1">
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-[var(--font-mono)] text-white w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => removeItem(item.productId)}
                                className="ml-auto p-1.5 text-white/20 hover:text-coral transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/50 font-[var(--font-body)]">
                    Subtotal
                  </span>
                  <span className="font-[var(--font-mono)] text-lg font-bold text-white">
                    {formatINR(subtotal)}
                  </span>
                </div>
                <p className="text-[10px] text-white/30 font-[var(--font-body)]">
                  GST & shipping calculated at checkout
                </p>
                <a
                  href="/checkout"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-gradient-to-r from-violet to-violet-light text-white text-sm font-semibold hover:shadow-lg hover:shadow-violet/20 transition-shadow"
                >
                  Checkout — {formatINR(subtotal)}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
