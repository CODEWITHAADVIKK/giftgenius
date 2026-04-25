"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  Package, Check, Truck, MapPin, Clock, Phone,
  CircleDot, Search,
} from "lucide-react";
import { demoOrders } from "@/lib/data";
import { formatINR } from "@/lib/utils";

const STATUS_ICONS: Record<string, typeof Package> = {
  pending: Clock,
  confirmed: Check,
  processing: Package,
  shipped: Truck,
  out_for_delivery: MapPin,
  delivered: Check,
};

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(demoOrders[0]); // Show demo order by default
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    setSearching(true);
    await new Promise((r) => setTimeout(r, 800));
    const found = demoOrders.find((o) => o.id === orderId.toUpperCase());
    if (found) {
      setOrder(found);
    }
    setSearching(false);
  };

  const currentStepIdx = order.timeline.findIndex((t) => !t.completed) - 1;

  return (
    <>
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-16 max-w-5xl mx-auto">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-[var(--font-heading)] italic text-white mb-4">
            Track Your Gift
          </h1>
          <p className="text-sm text-white/50 font-[var(--font-body)] mb-6">
            Enter your order ID to see real-time tracking updates
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="GG-2026-7842"
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-full pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-violet/40 font-[var(--font-mono)]"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 rounded-full bg-violet text-white text-sm font-medium hover:bg-violet-light transition-colors"
            >
              {searching ? "..." : "Track"}
            </button>
          </div>
        </motion.div>

        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
            {/* Order Header */}
            <div className="liquid-glass rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <p className="text-xs text-white/40 font-[var(--font-body)]">Order ID</p>
                <p className="font-[var(--font-mono)] text-lg text-white">{order.id}</p>
                <p className="text-xs text-white/40 font-[var(--font-body)] mt-1">
                  Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/40 font-[var(--font-body)]">Total</p>
                <p className="font-[var(--font-mono)] text-xl font-bold text-white">
                  {formatINR(order.total)}
                </p>
                <p className="text-xs text-teal font-[var(--font-body)] mt-1">
                  Paid via {order.paymentMethod}
                </p>
              </div>
            </div>

            {/* Status Banner */}
            <div className="liquid-glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-violet/20 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-violet-light" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white font-[var(--font-display)]">
                    {order.status === "shipped"
                      ? "Your gift is on its way! 🚀"
                      : order.status === "delivered"
                      ? "Delivered! 🎉"
                      : "Processing your order..."}
                  </p>
                  <p className="text-xs text-white/50 font-[var(--font-body)]">
                    Estimated delivery: {order.estimatedDelivery}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative mt-6 mb-2">
                <div className="h-1 bg-white/5 rounded-full">
                  <motion.div
                    className="h-1 bg-gradient-to-r from-violet to-teal rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((currentStepIdx + 1) / order.timeline.length) * 100}%`,
                    }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="liquid-glass rounded-2xl p-6">
              <h3 className="text-lg font-[var(--font-heading)] italic text-white mb-6">
                Tracking Timeline
              </h3>
              <div className="space-y-0">
                {order.timeline.map((event, i) => {
                  const Icon = STATUS_ICONS[event.status] || CircleDot;
                  const isActive = i <= currentStepIdx;
                  const isCurrent = i === currentStepIdx;

                  return (
                    <div key={event.status} className="flex gap-4">
                      {/* Line + Dot */}
                      <div className="flex flex-col items-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.15 }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                            isCurrent
                              ? "bg-violet shadow-lg shadow-violet/30"
                              : isActive
                              ? "bg-teal/20"
                              : "bg-white/5"
                          }`}
                        >
                          <Icon
                            className={`w-4 h-4 ${
                              isCurrent
                                ? "text-white"
                                : isActive
                                ? "text-teal"
                                : "text-white/20"
                            }`}
                          />
                        </motion.div>
                        {i < order.timeline.length - 1 && (
                          <div
                            className={`w-0.5 h-16 ${
                              isActive ? "bg-teal/30" : "bg-white/5"
                            }`}
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className="pb-8">
                        <p
                          className={`text-sm font-semibold font-[var(--font-display)] ${
                            isActive ? "text-white" : "text-white/30"
                          }`}
                        >
                          {event.label}
                        </p>
                        <p
                          className={`text-xs font-[var(--font-body)] mt-0.5 ${
                            isActive ? "text-white/50" : "text-white/20"
                          }`}
                        >
                          {event.description}
                        </p>
                        {event.timestamp && (
                          <p className="text-[10px] text-white/30 font-[var(--font-mono)] mt-1">
                            {new Date(event.timestamp).toLocaleString("en-IN", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {event.location && ` · ${event.location}`}
                          </p>
                        )}
                        {isCurrent && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="inline-block mt-2 text-[10px] bg-violet/20 text-violet-light px-2.5 py-1 rounded-full font-medium"
                          >
                            Current Status
                          </motion.span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items */}
            <div className="liquid-glass rounded-2xl p-6">
              <h3 className="text-lg font-[var(--font-heading)] italic text-white mb-4">
                Items in this Order
              </h3>
              {order.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-4 py-4 border-b border-white/5 last:border-0"
                >
                  <div className="w-16 h-16 rounded-xl bg-card flex items-center justify-center text-3xl flex-shrink-0">
                    🎁
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white font-[var(--font-display)]">
                      {item.product.name}
                    </p>
                    <p className="text-[10px] text-white/40 font-[var(--font-body)]">
                      {item.color} · {item.size} · × {item.quantity}
                    </p>
                    {item.giftMessage && (
                      <p className="text-[10px] text-gold font-[var(--font-body)] mt-1">
                        🎁 &quot;{item.giftMessage}&quot;
                      </p>
                    )}
                  </div>
                  <p className="font-[var(--font-mono)] text-sm text-white">
                    {formatINR(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Delivery Address */}
            <div className="liquid-glass rounded-2xl p-6">
              <h3 className="text-lg font-[var(--font-heading)] italic text-white mb-3">
                Delivery Address
              </h3>
              <p className="text-sm text-white font-[var(--font-display)]">
                {order.address.name}
              </p>
              <p className="text-xs text-white/50 font-[var(--font-body)]">
                {order.address.line1}
                {order.address.line2 ? `, ${order.address.line2}` : ""}
              </p>
              <p className="text-xs text-white/50 font-[var(--font-body)]">
                {order.address.city}, {order.address.state} — {order.address.pincode}
              </p>
              <p className="text-xs text-white/50 font-[var(--font-body)] flex items-center gap-1 mt-2">
                <Phone className="w-3 h-3" /> {order.address.phone}
              </p>
            </div>

            {/* Help */}
            <div className="text-center space-y-3">
              <p className="text-xs text-white/40 font-[var(--font-body)]">
                Need help with this order?
              </p>
              <div className="flex justify-center gap-3">
                <a
                  href="#"
                  className="px-5 py-2 rounded-full bg-white/5 text-white/60 text-xs hover:bg-white/10 transition-colors"
                >
                  Chat with Us
                </a>
                <a
                  href="tel:+911800123456"
                  className="px-5 py-2 rounded-full bg-white/5 text-white/60 text-xs hover:bg-white/10 transition-colors"
                >
                  Call 1800-123-456
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <Footer />
    </>
  );
}
