"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  Search, SlidersHorizontal, Star, ShoppingBag, Eye, Heart,
  X, ChevronDown, Mic,
} from "lucide-react";
import { products } from "@/lib/data";
import { formatINR } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useVoiceSearch } from "@/lib/useVoiceSearch";

const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Home Decor", value: "home-decor" },
  { label: "Festival", value: "festival" },
  { label: "Lighting", value: "lighting" },
  { label: "Personalized", value: "personalized" },
  { label: "Jewellery", value: "jewellery" },
  { label: "Electronics", value: "electronics" },
  { label: "Fashion", value: "fashion" },
  { label: "Wellness", value: "wellness" },
];

const SORT_OPTIONS = [
  { label: "Popular", value: "popular" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
  { label: "Rating", value: "rating" },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("popular");
  const [arOnly, setArOnly] = useState(false);

  const { addItem } = useCart();
  const { addToast } = useToast();

  const { isListening, isSupported, toggleListening } = useVoiceSearch((transcript) => {
    setQuery(transcript);
  });

  // Sync URL query param changes
  useEffect(() => {
    const q = searchParams.get("q");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (q) setQuery(q);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let results = [...products];

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }

    if (category !== "all") {
      results = results.filter((p) => p.categorySlug === category);
    }

    if (arOnly) {
      results = results.filter((p) => p.ar);
    }

    if (sort === "price_asc") results.sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") results.sort((a, b) => b.price - a.price);
    else if (sort === "rating") results.sort((a, b) => b.rating - a.rating);
    else results.sort((a, b) => b.reviews - a.reviews);

    return results;
  }, [query, category, sort, arOnly]);

  return (
    <>
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-16 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-[var(--font-heading)] italic text-white mb-2">
            Our Collection
          </h1>
          <p className="text-sm text-white/50 font-[var(--font-body)]">
            {filtered.length} products curated by AI for every occasion
          </p>
        </motion.div>

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search gifts, categories, occasions..."
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-full pl-11 pr-20 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-violet/40 font-[var(--font-body)]"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-white/30 hover:text-white/60 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              {isSupported && (
                <button
                  onClick={toggleListening}
                  className={`p-1.5 rounded-full transition-all ${
                    isListening
                      ? "bg-coral/20 text-coral animate-pulse"
                      : "text-white/30 hover:text-violet-light hover:bg-white/5"
                  }`}
                  title="Voice search"
                >
                  <Mic className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none bg-white/[0.03] border border-white/[0.06] rounded-full px-4 py-3 pr-10 text-sm text-white/70 outline-none focus:border-violet/40 font-[var(--font-body)] cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-void">
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
          </div>

          {/* AR Toggle */}
          <button
            onClick={() => setArOnly(!arOnly)}
            className={`flex items-center gap-2 px-4 py-3 rounded-full text-sm font-[var(--font-body)] transition-all ${
              arOnly
                ? "bg-teal/20 border border-teal/30 text-teal"
                : "bg-white/[0.03] border border-white/[0.06] text-white/60 hover:border-white/10"
            }`}
          >
            <Eye className="w-4 h-4" />
            AR Only
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto hide-scrollbar pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-[var(--font-body)] transition-all ${
                category === cat.value
                  ? "bg-violet/20 text-white border border-violet/30"
                  : "text-white/40 hover:text-white/60 hover:bg-white/5 border border-transparent"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/40 text-sm font-[var(--font-body)]">
              No products found. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative bg-surface rounded-2xl overflow-hidden border border-white/[0.06] hover:border-violet/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet/10"
              >
                <a
                  href={`/products/${product.slug}`}
                  className="relative aspect-square bg-card flex items-center justify-center overflow-hidden block"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 bg-coral/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                    {product.discount}% OFF
                  </span>
                  {product.ar && (
                    <span className="absolute top-3 left-3 liquid-glass rounded-full px-2.5 py-1 text-[10px] text-teal font-medium flex items-center gap-1 z-10">
                      <Eye className="w-3 h-3" /> AR
                    </span>
                  )}
                </a>

                <div className="p-4 space-y-2">
                  <span className="text-[10px] text-white/40 font-[var(--font-body)] uppercase tracking-wider">
                    {product.category}
                  </span>
                  <a href={`/products/${product.slug}`}>
                    <h3 className="text-sm font-semibold text-white font-[var(--font-display)] leading-tight line-clamp-2 hover:text-violet-light transition-colors">
                      {product.name}
                    </h3>
                  </a>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${
                          s <= Math.floor(product.rating)
                            ? "text-gold fill-gold"
                            : "text-white/20"
                        }`}
                      />
                    ))}
                    <span className="text-[10px] text-white/40 font-[var(--font-mono)] ml-1">
                      {product.rating}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-[var(--font-mono)] text-base font-bold text-white">
                      {formatINR(product.price)}
                    </span>
                    <span className="font-[var(--font-mono)] text-xs text-white/30 line-through">
                      {formatINR(product.basePrice)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      addItem({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        quantity: 1,
                        image: product.image,
                      });
                      addToast("cart", "Added to Cart", product.name);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-violet/15 text-violet-light text-[11px] font-medium hover:bg-violet/25 transition-colors mt-1"
                  >
                    <ShoppingBag className="w-3 h-3" /> Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center pt-24"><div className="w-8 h-8 border-4 border-violet/30 border-t-violet rounded-full animate-spin"></div></div>}>
      <ProductsContent />
    </Suspense>
  );
}
