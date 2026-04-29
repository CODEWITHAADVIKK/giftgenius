"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { IoEllipseOutline, IoCubeOutline, IoCartOutline, IoStar, IoEyeOutline, IoArrowForwardOutline, IoGiftOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import { products } from "@/lib/data";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const STATS = [
  {
    label: "Total Products",
    value: products.length.toString(),
    change: "+2 this week",
    icon: IoCubeOutline,
    color: "#7C3AED",
  },
  {
    label: "Total Revenue",
    value: "₹2,45,890",
    change: "+18% vs last month",
    icon: IoEllipseOutline,
    color: "#10B981",
  },
  {
    label: "Active Users",
    value: "1,247",
    change: "+32 today",
    icon: IoEllipseOutline,
    color: "#F59E0B",
  },
  {
    label: "Orders Today",
    value: "28",
    change: "+5 vs yesterday",
    icon: IoCartOutline,
    color: "#EC4899",
  },
];

const RECENT_ORDERS = [
  { id: "GG-2026-7842", customer: "Priya S.", total: "₹2,359", status: "shipped", product: "Celestial Silver Photo Frame" },
  { id: "GG-2026-7841", customer: "Arjun M.", total: "₹1,899", status: "processing", product: "Crystal Aurora Lamp" },
  { id: "GG-2026-7840", customer: "Neha R.", total: "₹799", status: "delivered", product: "Designer Rakhi Gift Set" },
  { id: "GG-2026-7839", customer: "Karthik P.", total: "₹4,999", status: "processing", product: "Gold Filigree Bracelet" },
  { id: "GG-2026-7838", customer: "Anita D.", total: "₹599", status: "delivered", product: "Personalised Name Mug" },
];

const STATUS_COLORS: Record<string, string> = {
  processing: "text-[#F59E0B] bg-[#F59E0B]/10",
  shipped: "text-[#3B82F6] bg-[#3B82F6]/10",
  delivered: "text-[#10B981] bg-[#10B981]/10",
  cancelled: "text-[#EF4444] bg-[#EF4444]/10",
};

const SIDEBAR_ITEMS = [
  { label: "Dashboard", icon: IoEllipseOutline, active: true },
  { label: "Products", icon: IoCubeOutline, active: false },
  { label: "Orders", icon: IoCartOutline, active: false },
  { label: "Customers", icon: IoEllipseOutline, active: false },
  { label: "Reviews", icon: IoStar, active: false },
  { label: "Analytics", icon: IoEllipseOutline, active: false },
];

export default function AdminPage() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading while auth state resolves
  if (!mounted || isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#7C3AED]/30 border-t-[#7C3AED] rounded-full animate-spin" />
        </div>
      </>
    );
  }

  // Require login
  if (!isLoggedIn) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 pt-24 px-4">
          <div className="w-16 h-16 rounded-2xl bg-[#7C3AED]/20 border border-[#7C3AED]/30 flex items-center justify-center">
            <IoShieldCheckmarkOutline className="w-8 h-8 text-[#9B87F5]" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Access Required</h1>
          <p className="text-[#9CA3AF] text-sm text-center max-w-sm">
            Please sign in with an admin account to access the dashboard.
          </p>
          <Link href="/login">
            <Button className="rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9B87F5] text-white px-8">
              Sign In
            </Button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <IoEllipseOutline className="w-7 h-7 text-[#7C3AED]" />
                Admin Dashboard
              </h1>
              <p className="text-sm text-[#9CA3AF] mt-1">
                Welcome back, {user?.name?.split(" ")[0] || "Admin"} · Overview of your store
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
              <IoEllipseOutline className="w-3.5 h-3.5 text-[#10B981]" />
              <span>System: Operational</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            </div>
          </motion.div>

          <div className="flex gap-6">
            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:flex flex-col w-56 shrink-0"
            >
              <div className="liquid-glass-strong rounded-2xl p-3 space-y-1 sticky top-24">
                {SIDEBAR_ITEMS.map((item) => (
                  <button
                    key={item.label}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                      item.active
                        ? "bg-[#7C3AED]/15 text-white border border-[#7C3AED]/20"
                        : "text-[#9CA3AF] hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${item.active ? "text-[#9B87F5]" : ""}`} />
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="liquid-glass-strong rounded-2xl p-5 group hover:border-[#7C3AED]/20 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${stat.color}15` }}
                      >
                        <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                      </div>
                      <IoEllipseOutline className="w-4 h-4 text-[#10B981]" />
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-[10px] text-[#10B981]">{stat.change}</p>
                    <p className="text-xs text-[#9CA3AF] mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Products + Orders Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="liquid-glass-strong rounded-2xl p-5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <IoGiftOutline className="w-4 h-4 text-[#7C3AED]" />
                      Top Products
                    </h3>
                    <Link href="/products" className="text-[10px] text-[#9B87F5] hover:text-white transition-colors">
                      View All →
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {products.slice(0, 5).map((product, i) => (
                      <div key={product.id} className="flex items-center gap-3">
                        <span className="text-[10px] text-[#9CA3AF] w-4 text-right">
                          #{i + 1}
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-[#1F2023] overflow-hidden flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white truncate">{product.name}</p>
                          <p className="text-[10px] text-[#9CA3AF]">
                            ₹{product.price.toLocaleString()} · ⭐ {product.rating}
                          </p>
                        </div>
                        <span className="text-[10px] text-[#9CA3AF]">
                          {product.reviews.toLocaleString()} reviews
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Recent Orders */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="liquid-glass-strong rounded-2xl p-5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <IoCartOutline className="w-4 h-4 text-[#7C3AED]" />
                      Recent Orders
                    </h3>
                    <span className="text-[10px] text-[#9CA3AF]">Last 24 hours</span>
                  </div>
                  <div className="space-y-3">
                    {RECENT_ORDERS.map((order) => (
                      <div key={order.id} className="flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-white font-medium">{order.id}</p>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-[#9CA3AF] truncate">
                            {order.customer} · {order.product}
                          </p>
                        </div>
                        <span className="text-xs text-white font-medium">{order.total}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="liquid-glass-strong rounded-2xl p-5"
              >
                <h3 className="text-sm font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "View Products", href: "/products", icon: IoEyeOutline },
                    { label: "Gift Finder", href: "/gift-finder", icon: IoGiftOutline },
                    { label: "View Orders", href: "/", icon: IoCartOutline },
                    { label: "AI Chatbot", href: "/", icon: IoEllipseOutline },
                  ].map((action) => (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[#9CA3AF] text-xs hover:border-[#7C3AED]/30 hover:text-white hover:bg-[#7C3AED]/5 transition-all"
                    >
                      <action.icon className="w-3.5 h-3.5" />
                      {action.label}
                      <IoArrowForwardOutline className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
