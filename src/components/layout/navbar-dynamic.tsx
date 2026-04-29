"use client";

import dynamic from "next/dynamic";

/**
 * Dynamically imported Navbar with SSR disabled.
 *
 * The Navbar uses useCart, useAuth, useRouter, navigator, window — all
 * browser-only APIs that cause hydration mismatches if server-rendered.
 * Every page should import { DynamicNavbar } from this module instead of
 * importing Navbar directly.
 */
export const DynamicNavbar = dynamic(
  () =>
    import("@/components/layout/navbar").then((m) => ({
      default: m.Navbar,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        className="fixed top-0 left-0 right-0 z-50 h-[64px] bg-[#0D0F1A]/80 border-b border-[#2E2E38]"
      />
    ),
  }
);
