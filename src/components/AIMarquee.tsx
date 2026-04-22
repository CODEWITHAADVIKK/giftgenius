"use client";

const ITEMS = [
  "🧠 NCF Engine",
  "🕶️ WebAR Preview",
  "🗣️ 8 Languages",
  "💬 GPT-4o Advisor",
  "⚡ <50ms AI",
  "🎁 Gift Wizard",
  "💳 UPI · EMI · BNPL",
  "📍 Pan-India Delivery",
  "🔒 Razorpay Secured",
  "📦 Same-Day Shipping",
];

export function AIMarquee() {
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <section className="py-6 border-y border-white/5 overflow-hidden relative">
      {/* Edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-void to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-void to-transparent pointer-events-none" />

      <div className="flex gap-4 animate-marquee hover:[animation-play-state:paused]">
        {doubled.map((item, i) => (
          <div
            key={i}
            className="liquid-glass rounded-full px-4 py-2 text-xs text-white/70 font-[var(--font-body)] whitespace-nowrap flex-shrink-0"
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
