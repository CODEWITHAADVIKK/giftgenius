"use client";

import dynamic from "next/dynamic";
import { Hero } from "@/components/ui/hero";
import { GiftFinder } from "@/components/sections/gift-finder";
import { Collections } from "@/components/sections/collections";
import { HowItWorks } from "@/components/sections/how-it-works";
import { OfferBanner } from "@/components/sections/offer-banner";
import { Testimonials } from "@/components/sections/testimonials";
import { Footer } from "@/components/layout/footer";

// ✅ Navbar uses useCart, useAuth, useRouter, navigator, window —
// all browser-only APIs. Must never run on the server.
const Navbar = dynamic(
  () => import("@/components/layout/navbar").then((m) => ({ default: m.Navbar })),
  {
    ssr: false,
    // Loading state matches the skeleton in Navbar's !mounted branch
    loading: () => (
      <div className="fixed top-0 left-0 right-0 z-50 h-[64px] 
                      bg-[#0D0F1A]/80 border-b border-[#2E2E38]" />
    ),
  }
);

// page.tsx itself can be a Server Component (no "use client" needed)
export default function Home() {
  return (
    <main className="bg-[#0D0F1A] min-h-screen">
      <Navbar />
      <Hero />
      <GiftFinder />
      <Collections />
      <HowItWorks />
      <OfferBanner />
      <Testimonials />
      <Footer />
    </main>
  );
}
