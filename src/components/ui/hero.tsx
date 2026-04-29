"use client";
import { useEffect } from "react";
import { renderCanvas } from "@/components/ui/canvas";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IoSparklesOutline, IoArrowForwardOutline, IoGiftOutline } from "react-icons/io5";
import Link from "next/link";

export function Hero() {
  useEffect(() => {
    const cleanup = renderCanvas();
    return cleanup;
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0D0F1A]"
    >
      {/* Animated radial gradient blobs */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[#7C3AED]/20 blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#E8A87C]/15 blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: "1s" }} />

      {/* Canvas trail animation */}
      <canvas
        className="pointer-events-none absolute inset-0 w-full h-full"
        id="canvas"
      />

      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto">
        {/* Launch badge */}
        <div className="mb-8 flex items-center gap-2 rounded-full border border-[#7C3AED]/40 bg-[#7C3AED]/10 px-4 py-2 text-sm text-[#9B87F5] backdrop-blur-sm animate-[fadeIn_0.8s_ease_forwards]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7C3AED] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#7C3AED]" />
          </span>
          <IoSparklesOutline className="h-4 w-4" />
          Introducing GiftGenius AI — Smart Gifting, Reimagined
        </div>

        {/* Main headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 leading-none font-[family-name:var(--font-inter)]">
          Find the{" "}
          <span className="bg-gradient-to-r from-[#7C3AED] via-[#9B87F5] to-[#E8A87C] bg-clip-text text-transparent">
            Perfect Gift.
          </span>
          <br />
          Every Single Time.
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-[#9CA3AF] max-w-2xl mb-10 leading-relaxed">
          Powered by AI that understands the people you love. Tell us about your
          recipient and we&apos;ll curate thoughtful, personalized gift ideas in
          seconds.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link
            href="#gift-finder"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9B87F5] text-white px-8 py-6 text-base font-semibold shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:shadow-[0_0_40px_rgba(124,58,237,0.7)] hover:scale-105 transition-all duration-300 group"
            )}
          >
            <IoGiftOutline className="h-5 w-5 mr-2" />
            Generate Gift Ideas
            <IoArrowForwardOutline className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="#collections"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "rounded-full border-[#2E2E38] bg-transparent text-[#F9F5FF] px-8 py-6 text-base hover:bg-white/5 hover:border-[#7C3AED]/50 transition-all duration-300"
            )}
          >
            Browse Gift Collections
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="mt-14 flex flex-wrap justify-center gap-8 text-sm text-[#9CA3AF]">
          {[
            { value: "10K+", label: "Gifts Recommended" },
            { value: "98%", label: "Satisfaction Rate" },
            { value: "500+", label: "Gift Categories" },
            { value: "Free", label: "Shipping ₹799+" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-white">
                {stat.value}
              </span>
              <span className="text-xs">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
