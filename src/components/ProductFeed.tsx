"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, Eye, Star } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { products as CATALOG } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

function ProductCard({
  product,
  index,
}: {
  product: (typeof CATALOG)[0];
  index: number;
}) {
  const { addItem } = useCart();
  const { addToast } = useToast();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative bg-surface rounded-2xl overflow-hidden border border-white/[0.06] hover:border-violet/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet/10"
    >
      {/* Image Area */}
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

        {/* Discount Badge */}
        <span className="absolute top-3 right-3 bg-coral/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
          {product.discount}% OFF
        </span>

        {/* AR Badge */}
        {product.ar && (
          <span className="absolute top-3 left-3 liquid-glass rounded-full px-2.5 py-1 text-[10px] text-teal font-medium flex items-center gap-1 z-10">
            <Eye className="w-3 h-3" /> AR
          </span>
        )}
      </a>

      {/* Hover Actions */}
      <div className="absolute bottom-[calc(50%)] left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 z-10">
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
          className="flex-1 liquid-glass-strong rounded-full py-2 text-[11px] font-medium text-white flex items-center justify-center gap-1.5 hover:bg-white/10 transition-colors"
        >
          <ShoppingBag className="w-3 h-3" /> Add to Cart
        </button>
        <button className="liquid-glass rounded-full p-2 hover:bg-white/10 transition-colors">
          <Heart className="w-3.5 h-3.5 text-white/60" />
        </button>
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <span className="text-[10px] text-white/40 font-[var(--font-body)] uppercase tracking-wider">
          {product.category}
        </span>
        <a href={`/products/${product.slug}`}>
          <h3 className="text-sm font-semibold text-white font-[var(--font-display)] leading-tight line-clamp-2 hover:text-violet-light transition-colors">
            {product.name}
          </h3>
        </a>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-3 h-3 ${
                star <= Math.floor(product.rating)
                  ? "text-gold fill-gold"
                  : "text-white/20"
              }`}
            />
          ))}
          <span className="text-[10px] text-white/40 font-[var(--font-mono)]">
            ({product.reviews.toLocaleString("en-IN")})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="font-[var(--font-mono)] text-base font-bold text-white">
            {formatINR(product.price)}
          </span>
          <span className="font-[var(--font-mono)] text-xs text-white/30 line-through">
            {formatINR(product.basePrice)}
          </span>
        </div>

        {/* AI Badge */}
        <span className="inline-flex items-center gap-1.5 liquid-glass rounded-full px-2.5 py-1 text-[10px] text-violet-light font-[var(--font-body)]">
          <span className="w-1 h-1 rounded-full bg-violet-light animate-pulse" />
          {product.badge}
        </span>
      </div>
    </motion.div>
  );
}

export function ProductFeed() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-heading)] italic text-white tracking-tight"
          >
            Your Picks, Powered by AI
          </motion.h2>
        </div>
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="liquid-glass rounded-full px-3.5 py-1.5 text-xs text-white/50 font-[var(--font-body)] flex items-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
          Feed updates every 4 hours ✦
        </motion.span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {CATALOG.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}
