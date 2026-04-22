"use client";

import { Gift } from "lucide-react";

const NAV_SECTIONS = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/products" },
      { label: "Gift Finder", href: "/gift-finder" },
      { label: "AR Products", href: "/products?ar=true" },
      { label: "Corporate Gifts", href: "/corporate" },
      { label: "Gift Cards", href: "/gift-cards" },
    ],
  },
  {
    title: "Occasions",
    links: [
      { label: "Birthday", href: "/categories/birthday-gifts" },
      { label: "Wedding", href: "/categories/wedding-gifts" },
      { label: "Diwali", href: "/categories/diwali-gifts" },
      { label: "Anniversary", href: "/categories/anniversary-gifts" },
      { label: "Raksha Bandhan", href: "/categories/raksha-bandhan" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Track Order", href: "/orders" },
      { label: "Returns", href: "/returns" },
      { label: "FAQs", href: "/faq" },
      { label: "Contact Us", href: "/contact" },
      { label: "Blog", href: "/blog" },
    ],
  },
];

const SOCIAL = [
  { label: "Instagram", href: "#" },
  { label: "Twitter", href: "#" },
  { label: "WhatsApp", href: "#" },
  { label: "LinkedIn", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/5 pt-16 pb-8 px-4 sm:px-6 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
          {/* Brand Column */}
          <div className="col-span-2">
            <a href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet to-gold flex items-center justify-center">
                <Gift className="w-4 h-4 text-white" />
              </div>
              <span className="font-[var(--font-heading)] italic text-lg text-white">
                GiftGenius
              </span>
            </a>
            <p className="text-xs text-white/40 font-[var(--font-body)] font-light leading-relaxed max-w-xs mb-6">
              India&apos;s most intelligent gift platform. AI-powered discovery,
              AR preview, voice search in 8 languages, and secure Razorpay checkout.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="liquid-glass rounded-full px-3 py-1.5 text-[10px] text-white/50 hover:text-white transition-colors font-[var(--font-body)]"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Nav Sections */}
          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-semibold text-white/60 font-[var(--font-display)] uppercase tracking-wider mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs text-white/35 hover:text-white/70 transition-colors font-[var(--font-body)]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-6 space-y-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-white/25 font-[var(--font-body)]">
              © 2026 GiftGenius AI Private Limited · Made with ❤️ in India
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {["Privacy Policy", "Terms of Service", "Refund Policy", "Contact"].map(
                (link) => (
                  <a
                    key={link}
                    href="#"
                    className="text-[11px] text-white/25 hover:text-white/50 transition-colors font-[var(--font-body)]"
                  >
                    {link}
                  </a>
                )
              )}
            </div>
          </div>
          <p className="text-center text-[10px] text-white/15 font-[var(--font-mono)]">
            GSTIN: 27AABCG1234X1ZK · CIN: U74999MH2026PTC123456
          </p>
        </div>
      </div>
    </footer>
  );
}
