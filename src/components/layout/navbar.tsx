"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Gift, ShoppingCart, Menu, X, User, LogOut } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { CartDrawer } from "@/components/CartDrawer";
import GradientMenu from "@/components/ui/gradient-menu";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  // ✅ CORE FIX: Single mounted guard for the ENTIRE navbar.
  // Server renders a static skeleton. Client renders full interactive navbar.
  // This eliminates ALL context/state hydration mismatches in one place.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Hooks are always called (Rules of Hooks), but values only
  // used AFTER mounted=true, so server never sees dynamic values.
  const cart = useCart();
  const auth = useAuth();

  // ─── SERVER RENDER + PRE-HYDRATION SKELETON ────────────────────────
  // Identical HTML on server and client until useEffect fires.
  // React compares these → they match → no hydration error.
  if (!mounted) {
    return (
      <>
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center 
                        justify-between px-6 py-3 backdrop-blur-xl 
                        bg-[#0D0F1A]/80 border-b border-[#2E2E38] h-[64px]">
          {/* Logo — static, same on server and client */}
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl">
            <Gift className="h-6 w-6 text-[#7C3AED]" />
            <span className="bg-gradient-to-r from-[#7C3AED] to-[#E8A87C] 
                             bg-clip-text text-transparent">
              GiftGenius
            </span>
          </Link>
          {/* Empty placeholders — match server output exactly */}
          <div className="hidden md:flex gap-4" />
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-[#1F2023] border border-[#2E2E38]" />
            <div className="h-9 w-20 rounded-full bg-[#1F2023] border border-[#2E2E38]" />
          </div>
        </nav>
        {/* Spacer so content doesn't hide under fixed navbar */}
        <div className="h-[64px]" />
      </>
    );
  }

  // ─── CLIENT RENDER (after mount) ───────────────────────────────────
  // All browser APIs, context values, and dynamic state are safe here.
  const cartCount = cart.count;
  const isLoggedIn = auth.isLoggedIn;
  const userName = auth.user?.name;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center 
                      justify-between px-6 py-3 backdrop-blur-xl 
                      bg-[#0D0F1A]/80 border-b border-[#2E2E38]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl">
          <Gift className="h-6 w-6 text-[#7C3AED]" />
          <span className="bg-gradient-to-r from-[#7C3AED] to-[#E8A87C] 
                           bg-clip-text text-transparent">
            GiftGenius
          </span>
        </Link>

        {/* Desktop nav menu */}
        <GradientMenu />

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Cart button */}
          <button
            onClick={cart.openCart}
            className="relative h-9 w-9 rounded-full bg-[#1F2023] 
                       border border-[#2E2E38] flex items-center justify-center 
                       text-[#9CA3AF] hover:text-white hover:border-[#7C3AED]/50 
                       hover:bg-[#7C3AED]/10 transition-all duration-300"
            aria-label="Open cart"
          >
            <ShoppingCart className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full 
                               bg-[#7C3AED] text-white text-[10px] font-bold 
                               flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>

          {/* Auth buttons */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-sm text-[#9CA3AF]">
                Hi, {userName?.split(" ")[0]}
              </span>
              <button
                onClick={auth.logout}
                className="h-9 w-9 rounded-full bg-[#1F2023] border border-[#2E2E38] 
                           flex items-center justify-center text-[#9CA3AF] 
                           hover:text-red-400 hover:border-red-500/30 transition-all"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-[#9CA3AF] hover:text-white 
                             hover:bg-white/5 transition-all hidden sm:flex"
                >
                  <User className="h-4 w-4 mr-1" />
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9B87F5] 
                             text-white px-5 hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] 
                             transition-all"
                >
                  Try Free
                </Button>
              </Link>
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden h-9 w-9 rounded-full bg-[#1F2023] border border-[#2E2E38] 
                       flex items-center justify-center text-[#9CA3AF] hover:text-white 
                       transition-all"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="fixed top-[64px] left-0 right-0 z-40 bg-[#0D0F1A] 
                        border-b border-[#2E2E38] px-6 py-4 flex flex-col gap-3 md:hidden">
          {[
            { label: "Home",        href: "/" },
            { label: "Shop",        href: "/shop" },
            { label: "Gift Finder", href: "/gift-finder" },
            { label: "Wishlist",    href: "/wishlist" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="text-[#9CA3AF] hover:text-white py-2 border-b 
                         border-[#2E2E38] last:border-0 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}

      {/* Spacer */}
      <div className="h-[64px]" />

      {/* Cart drawer — rendered globally here */}
      <CartDrawer />
    </>
  );
}
