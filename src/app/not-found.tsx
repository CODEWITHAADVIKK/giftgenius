"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Search, ArrowLeft, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#0D0F1A] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-[#7C3AED]/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-[#E8A87C]/10 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-lg relative z-10"
      >
        {/* 404 Number */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <span className="text-[120px] md:text-[160px] font-bold leading-none bg-gradient-to-r from-[#7C3AED] via-[#9B87F5] to-[#E8A87C] bg-clip-text text-transparent">
            404
          </span>
        </motion.div>

        {/* Gift icon */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="w-16 h-16 rounded-2xl bg-[#7C3AED]/20 border border-[#7C3AED]/30 flex items-center justify-center mx-auto mb-6"
        >
          <Gift className="h-8 w-8 text-[#9B87F5]" />
        </motion.div>

        <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
          This Gift Got Lost in Transit
        </h1>
        <p className="text-[#9CA3AF] mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back to finding the perfect gift!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9B87F5] text-white px-6 group">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Link href="/products">
            <Button
              variant="outline"
              className="rounded-full border-[#2E2E38] text-[#9CA3AF] px-6 hover:border-[#7C3AED]/50 hover:text-white"
            >
              <Search className="h-4 w-4 mr-2" />
              Browse Gifts
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
