"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Gift, Menu, X, User, ShoppingCart } from "lucide-react";
import GradientMenu from "@/components/ui/gradient-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { CartDrawer } from "@/components/CartDrawer";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { count, openCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-xl bg-[#0D0F1A]/90 border-b border-[#2E2E38] shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            : "bg-transparent"
        }`}
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-white font-bold text-xl"
        >
          <Gift className="h-6 w-6 text-[#7C3AED]" />
          <span className="bg-gradient-to-r from-[#7C3AED] to-[#E8A87C] bg-clip-text text-transparent">
            GiftGenius
          </span>
        </Link>

        <GradientMenu />

        <div className="hidden md:flex items-center gap-3">
          {/* Cart Button */}
          <button
            onClick={openCart}
            className="relative h-10 w-10 rounded-full bg-[#1F2023] border border-[#2E2E38] 
                       flex items-center justify-center text-[#9CA3AF] hover:text-white 
                       hover:border-[#7C3AED]/50 hover:bg-[#7C3AED]/10 transition-all duration-300"
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#7C3AED] 
                               text-white text-xs flex items-center justify-center font-bold">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-white/80 flex items-center gap-2">
                <User className="h-4 w-4" />
                {user.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-[#9CA3AF] hover:text-white rounded-full"
              >
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/login")}
                className="text-[#9CA3AF] hover:text-white rounded-full"
              >
                Sign In
              </Button>
              <Button
                size="sm"
                onClick={() => router.push("/register")}
                className="rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9B87F5] text-white px-5 hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-all"
              >
                Try for Free
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Mobile cart button */}
          <button
            onClick={openCart}
            className="relative h-10 w-10 rounded-full bg-[#1F2023] border border-[#2E2E38] 
                       flex items-center justify-center text-[#9CA3AF] hover:text-white transition-all"
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#7C3AED] 
                               text-white text-xs flex items-center justify-center font-bold">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </button>
          <button
            className="h-10 w-10 rounded-full bg-[#1F2023] border border-[#2E2E38] flex items-center justify-center text-[#9CA3AF] hover:text-white transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#0D0F1A]/95 backdrop-blur-xl border-b border-[#2E2E38] p-6 flex flex-col gap-4 md:hidden animate-[fadeIn_0.3s_ease]">
            {["Home", "Shop", "Gifts", "Gift Finder", "About"].map((item) => {
              let href = "/";
              if (item === "Shop" || item === "Gifts") href = "/products";
              else if (item === "Gift Finder") href = "/gift-finder";
              else if (item === "About") href = "#";
              return (
                <Link
                  key={item}
                  href={href}
                  className="text-[#9CA3AF] hover:text-white transition-colors text-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  {item}
                </Link>
              );
            })}
            <div className="flex gap-3 pt-4 border-t border-[#2E2E38]">
              {user ? (
                <div className="flex flex-col gap-3 w-full">
                  <span className="text-sm font-medium text-white/80 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {user.name}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => { logout(); setMobileOpen(false); }} className="w-full text-[#9CA3AF] hover:text-white rounded-full">
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                      "w-full text-[#9CA3AF] hover:text-white rounded-full"
                    )}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      buttonVariants({ size: "sm" }),
                      "w-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9B87F5] text-white px-5"
                    )}
                  >
                    Try for Free
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Cart Drawer rendered globally from navbar */}
      <CartDrawer />
    </>
  );
}
