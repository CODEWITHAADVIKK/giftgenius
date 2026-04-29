"use client";
import { IoCloseOutline, IoTrashOutline, IoAddOutline, IoRemoveOutline, IoCartOutline, IoArrowForwardOutline } from "react-icons/io5";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, clearCart } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md 
                       bg-[#0D0F1A] border-l border-[#2E2E38] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#2E2E38]">
              <div className="flex items-center gap-2">
                <IoCartOutline className="h-5 w-5 text-[#7C3AED]" />
                <h2 className="text-white font-semibold text-lg">Your Cart</h2>
                {items.length > 0 && (
                  <span className="rounded-full bg-[#7C3AED] px-2 py-0.5 text-xs text-white">
                    {items.length}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="h-8 w-8 rounded-full bg-[#1F2023] border border-[#2E2E38] 
                           flex items-center justify-center text-[#9CA3AF] 
                           hover:text-white transition-colors"
              >
                <IoCloseOutline className="h-4 w-4" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-[#1F2023] border border-[#2E2E38] 
                                  flex items-center justify-center">
                    <IoCartOutline className="h-8 w-8 text-[#9CA3AF]" />
                  </div>
                  <p className="text-[#9CA3AF]">Your cart is empty</p>
                  <Button
                    onClick={closeCart}
                    className="rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9B87F5] text-white"
                  >
                    Browse Gifts
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-2xl bg-[#1F2023] border border-[#2E2E38] p-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 rounded-xl object-cover flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=100&h=100&fit=crop";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">{item.name}</p>
                      {item.tag && (
                        <span className="text-xs text-[#9B87F5]">{item.tag}</span>
                      )}
                      <p className="text-[#E8A87C] font-semibold mt-1">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-6 w-6 rounded-full bg-[#2E2E38] flex items-center 
                                     justify-center text-[#9CA3AF] hover:text-white"
                        >
                          <IoRemoveOutline className="h-3 w-3" />
                        </button>
                        <span className="text-white text-sm w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-6 w-6 rounded-full bg-[#2E2E38] flex items-center 
                                     justify-center text-[#9CA3AF] hover:text-white"
                        >
                          <IoAddOutline className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-auto text-[#9CA3AF] hover:text-red-400 transition-colors"
                        >
                          <IoTrashOutline className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-[#2E2E38] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#9CA3AF]">Subtotal</span>
                  <span className="text-white font-bold text-xl">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
                {total < 799 && (
                  <p className="text-xs text-[#9CA3AF] text-center">
                    Add ₹{(799 - total).toLocaleString()} more for free shipping 🎁
                  </p>
                )}
                <Link href="/checkout" onClick={closeCart}>
                  <Button className="w-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9B87F5] 
                                     text-white py-6 text-base font-semibold 
                                     shadow-[0_0_25px_rgba(124,58,237,0.4)]
                                     hover:shadow-[0_0_40px_rgba(124,58,237,0.6)] 
                                     transition-all group">
                    Proceed to Checkout
                    <IoArrowForwardOutline className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <button
                  onClick={clearCart}
                  className="w-full text-center text-sm text-[#9CA3AF] hover:text-red-400 transition-colors"
                >
                  Clear cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
