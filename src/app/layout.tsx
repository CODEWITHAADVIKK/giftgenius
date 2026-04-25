import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GiftGenius AI — Smart Gifting, Reimagined",
  description: "AI-powered personalized gift recommendations for every occasion.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#0D0F1A] antialiased`}>
        {/*
          ✅ suppressHydrationWarning on <html> handles minor attribute
          differences (e.g. browser extensions adding attributes).
          
          ✅ Providers here are server components that render client
          subtrees — this is correct Next.js pattern.
          
          ✅ AuthProvider wraps CartProvider so auth state is available
          everywhere including cart logic.
        */}
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
