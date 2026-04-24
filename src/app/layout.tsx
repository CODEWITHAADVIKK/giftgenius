import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GiftGenius AI — India's Smartest Gift Platform",
  description:
    "AI-powered gift discovery for modern India. Find the perfect gift in seconds with AR preview, voice search, and GPT-4o recommendations. Trusted by 500K+ happy recipients.",
  keywords: [
    "gifts", "AI gifts", "India", "Diwali gifts", "birthday gifts",
    "gift finder", "AR preview", "GiftGenius",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetBrainsMono.variable} dark`}
    >
      <body className="min-h-screen bg-[#0D0F1A] text-[#F9F5FF] antialiased font-[family-name:var(--font-inter)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
