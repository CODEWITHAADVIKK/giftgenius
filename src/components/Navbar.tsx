"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ShoppingBag,
  User,
  Globe,
  Menu,
  X,
  Gift,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Gift Finder", href: "/gift-finder" },
  { label: "AR Products", href: "/ar" },
  { label: "Corporate", href: "/corporate" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, setIsOpen } = useCart();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        className={`fixed top-4 left-4 right-4 z-50 flex items-center justify-between
          px-5 py-3 rounded-full transition-all duration-500
          ${
            scrolled
              ? "bg-void/80 backdrop-blur-2xl shadow-lg shadow-violet/5"
              : "bg-white/[0.02] backdrop-blur-md"
          }`}
        style={{
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet to-gold flex items-center justify-center">
            <Gift className="w-4 h-4 text-white" />
          </div>
          <span className="font-[var(--font-heading)] italic text-lg text-white tracking-tight">
            GiftGenius
          </span>
        </Link>

        {/* Center Nav (desktop) */}
        <div className="hidden lg:flex items-center gap-1 liquid-glass rounded-full px-2 py-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-3.5 py-2 text-sm font-[var(--font-body)] text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/5"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/gift-finder"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-violet hover:bg-violet-light rounded-full transition-colors ml-1"
          >
            Find My Gift
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-3">
          <button className="hidden md:flex items-center gap-1.5 text-white/60 hover:text-white transition-colors">
            <Globe className="w-4 h-4" />
            <span className="text-xs font-[var(--font-body)]">EN</span>
          </button>
          <button className="hidden md:flex p-2 text-white/60 hover:text-white transition-colors">
            <Search className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2 text-white/60 hover:text-white transition-colors"
          >
            <ShoppingBag className="w-4.5 h-4.5" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-violet text-[9px] text-white rounded-full flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </button>
          <button className="hidden md:flex w-8 h-8 rounded-full bg-violet/20 items-center justify-center">
            <User className="w-4 h-4 text-violet-light" />
          </button>
          <button
            className="lg:hidden p-2 text-white/60 hover:text-white"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          className="fixed inset-0 z-[100] bg-void/95 backdrop-blur-2xl flex flex-col p-8"
        >
          <button
            className="self-end p-2 text-white/60 hover:text-white"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex flex-col gap-4 mt-12">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-2xl font-[var(--font-heading)] italic text-white/80 hover:text-white transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/gift-finder"
              className="mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-violet text-white rounded-full text-lg font-medium"
            >
              Find My Gift <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      )}
    </>
  );
}
