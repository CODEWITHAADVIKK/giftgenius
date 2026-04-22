"use client";

import { motion } from "framer-motion";

const OCCASIONS = [
  { name: "Diwali", emoji: "🪔", gradient: "from-amber-600/40 to-orange-900/40", slug: "diwali-gifts", days: 28 },
  { name: "Birthday", emoji: "🎂", gradient: "from-pink-600/40 to-rose-900/40", slug: "birthday-gifts", days: 0 },
  { name: "Wedding", emoji: "💍", gradient: "from-violet/40 to-purple-900/40", slug: "wedding-gifts", days: 0 },
  { name: "Anniversary", emoji: "👫", gradient: "from-red-600/40 to-red-900/40", slug: "anniversary-gifts", days: 0 },
  { name: "Graduation", emoji: "🎓", gradient: "from-blue-600/40 to-blue-900/40", slug: "graduation-gifts", days: 0 },
  { name: "Raksha Bandhan", emoji: "🏮", gradient: "from-gold/40 to-amber-900/40", slug: "raksha-bandhan", days: 22 },
  { name: "Valentine's", emoji: "❤️", gradient: "from-rose-600/40 to-pink-900/40", slug: "valentines-gifts", days: 0 },
  { name: "Housewarming", emoji: "🏠", gradient: "from-teal/40 to-emerald-900/40", slug: "housewarming-gifts", days: 0 },
];

export function OccasionStrips() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-heading)] italic text-white tracking-tight mb-10"
      >
        Shop by Occasion
      </motion.h2>

      <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
        {OCCASIONS.map((occ, i) => (
          <motion.a
            key={occ.slug}
            href={`/categories/${occ.slug}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className={`relative flex-shrink-0 w-44 h-56 rounded-2xl overflow-hidden bg-gradient-to-br ${occ.gradient} border border-white/[0.06] group hover:-translate-y-1 hover:shadow-lg hover:shadow-violet/10 transition-all duration-300 cursor-pointer`}
          >
            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
              <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                {occ.emoji}
              </span>
              <span className="text-sm font-semibold text-white font-[var(--font-display)] text-center">
                {occ.name}
              </span>
            </div>

            {/* Urgency Badge */}
            {occ.days > 0 && (
              <span className="absolute top-3 right-3 bg-coral/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                {occ.days} days away
              </span>
            )}

            {/* Glass overlay on hover */}
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.03] transition-colors duration-300" />
          </motion.a>
        ))}
      </div>
    </section>
  );
}
