import type { Metadata } from "next";
import { Noto_Serif, DM_Sans, Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-noto-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
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
      className={`${notoSerif.variable} ${dmSans.variable} ${syne.variable} ${jetBrainsMono.variable} dark`}
    >
      <body className="min-h-screen bg-void text-text antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
