"use client";

import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/ui/hero";
import { GiftFinder } from "@/components/sections/gift-finder";
import { Collections } from "@/components/sections/collections";
import { HowItWorks } from "@/components/sections/how-it-works";
import { OfferBanner } from "@/components/sections/offer-banner";
import { Testimonials } from "@/components/sections/testimonials";
import { Pricing } from "@/components/sections/pricing";
import { Footer } from "@/components/layout/footer";
import { ChatWidget } from "@/components/ChatWidget";

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
      <Pricing />
      <Footer />
      <ChatWidget />
    </main>
  );
}
