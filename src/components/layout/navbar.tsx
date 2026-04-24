"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Gift, Menu, X, User } from "lucide-react";
import GradientMenu from "@/components/ui/gradient-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
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
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#9CA3AF] hover:text-white rounded-full"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="sm"
                className="rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9B87F5] text-white px-5 hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-all"
              >
                Try for Free
              </Button>
            </Link>
          </>
        )}
      </div>

      {/* Mobile menu button */}
      <button
        className="md:hidden h-10 w-10 rounded-full bg-[#1F2023] border border-[#2E2E38] flex items-center justify-center text-[#9CA3AF] hover:text-white transition-all"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#0D0F1A]/95 backdrop-blur-xl border-b border-[#2E2E38] p-6 flex flex-col gap-4 md:hidden animate-[fadeIn_0.3s_ease]">
          {["Home", "Shop", "Gifts", "Gift Finder", "About"].map((item) => (
            <Link
              key={item}
              href={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`}
              className="text-[#9CA3AF] hover:text-white transition-colors text-lg"
              onClick={() => setMobileOpen(false)}
            >
              {item}
            </Link>
          ))}
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
                <Link href="/login" className="w-full" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full text-[#9CA3AF] hover:text-white rounded-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" className="w-full" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" className="w-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9B87F5] text-white px-5">
                    Try for Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
