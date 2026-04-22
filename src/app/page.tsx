"use client";

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { AIMarquee } from "@/components/AIMarquee";
import { ProductFeed } from "@/components/ProductFeed";
import { GiftFinderTeaser } from "@/components/GiftFinderTeaser";
import { OccasionStrips } from "@/components/OccasionStrips";
import { WebARFeature } from "@/components/WebARFeature";
import { HowItWorks } from "@/components/HowItWorks";
import { StatsSection } from "@/components/StatsSection";
import { Testimonials } from "@/components/Testimonials";
import { PaymentTrust } from "@/components/PaymentTrust";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <Navbar />
      <Hero />
      <AIMarquee />
      <ProductFeed />
      <GiftFinderTeaser />
      <OccasionStrips />
      <WebARFeature />
      <HowItWorks />
      <StatsSection />
      <Testimonials />
      <PaymentTrust />
      <CTASection />
      <Footer />
      <ChatWidget />
    </main>
  );
}
