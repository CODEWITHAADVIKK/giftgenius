"use client";

import { motion } from "framer-motion";
import { IoWarningOutline, IoRefreshOutline, IoHomeOutline } from "react-icons/io5";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("Global error boundary caught:", error, error.digest);

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Error | GiftGenius</title>
      </head>
      <body className="bg-[#0D0F1A] antialiased">
        <div className="min-h-screen flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
              <IoWarningOutline className="h-10 w-10 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">
              Something Went Wrong
            </h1>
            <p className="text-[#9CA3AF] text-sm mb-6">
              We apologize for the inconvenience. An unexpected error occurred.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={reset}
                className="rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9B87F5] text-white"
              >
                <IoRefreshOutline className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Link href="/">
                <Button
                  variant="outline"
                  className="rounded-full border-[#2E2E38] text-[#9CA3AF]"
                >
                  <IoHomeOutline className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </body>
    </html>
  );
}
