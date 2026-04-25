"use client";

import dynamic from "next/dynamic";

// All other section imports stay as normal imports
import { Hero } from "@/components/ui/hero";
import { GiftFinder } from "@/components/sections/gift-finder";
import { Collections } from "@/components/sections/collections";
import { HowItWorks } from "@/components/sections/how-it-works";
import { OfferBanner } from "@/components/sections/offer-banner";
import { Testimonials } from "@/components/sections/testimonials";
import { Footer } from "@/components/layout/footer";

// ✅ Navbar must be dynamic ssr:false — it contains browser-only APIs
// (useRouter, navigator, window) inside GradientMenu
const Navbar = dynamic(
  () => import("@/components/layout/navbar").then((m) => ({ default: m.Navbar })),
  { 
    ssr: false,
    loading: () => (
      <div className="fixed top-0 left-0 right-0 z-50 h-[64px] 
                      bg-[#0D0F1A]/80 border-b border-[#2E2E38]" />
    )
  }
);

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
