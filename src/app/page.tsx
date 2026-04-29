"use client";

import { Hero } from "@/components/ui/hero";
import { GiftFinder } from "@/components/sections/gift-finder";
import { Collections } from "@/components/sections/collections";
import { HowItWorks } from "@/components/sections/how-it-works";
import { OfferBanner } from "@/components/sections/offer-banner";
import { Testimonials } from "@/components/sections/testimonials";
import { Footer } from "@/components/layout/footer";
import { ChatWidget } from "@/components/ChatWidget";
import { WebARFeature } from "@/components/WebARFeature";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Navbar } from "@/components/layout/navbar";

export default function Home() {
  return (
    <ErrorBoundary>
      <main className="bg-[#0D0F1A] min-h-screen">
        <Navbar />
        <Hero />
        <GiftFinder />
        <Collections />
        <HowItWorks />
        <WebARFeature />
        <OfferBanner />
        <Testimonials />
        <Footer />
        <ChatWidget />
      </main>
    </ErrorBoundary>
  );
}
