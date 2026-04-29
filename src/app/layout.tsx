import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: {
    default: "GiftGenius AI — Smart Gifting, Reimagined",
    template: "%s | GiftGenius AI",
  },
  description:
    "AI-powered personalized gift recommendations for every occasion. Find the perfect gift for birthdays, anniversaries, Diwali, and more. Premium curated hampers with free shipping.",
  keywords: [
    "gifts",
    "AI gifts",
    "gift finder",
    "personalized gifts",
    "gift hampers",
    "birthday gifts",
    "Diwali gifts",
    "anniversary gifts",
    "corporate gifts",
    "India",
    "GiftGenius",
  ],
  authors: [{ name: "GiftGenius AI" }],
  creator: "GiftGenius AI",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://giftgenius.ai",
    siteName: "GiftGenius AI",
    title: "GiftGenius AI — Smart Gifting, Reimagined",
    description:
      "AI-powered personalized gift recommendations for every occasion. Curated hampers, premium packaging, doorstep delivery.",
  },
  twitter: {
    card: "summary_large_image",
    title: "GiftGenius AI — Smart Gifting, Reimagined",
    description:
      "AI-powered gift recommendations. Find the perfect gift in seconds.",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://giftgenius.ai"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0D0F1A" />
        <meta name="color-scheme" content="dark" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.variable} ${jetbrains.variable} font-sans bg-[#0D0F1A] antialiased`} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
