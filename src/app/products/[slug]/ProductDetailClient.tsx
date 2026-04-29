"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star, Heart, ShoppingBag, Eye, Share2, ChevronRight,
  Truck, Shield, RotateCcw, Package, Check, Minus, Plus,
} from "lucide-react";
import { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import { formatINR } from "@/lib/utils";
import { products } from "@/lib/data";

export function ProductDetailClient({ product }: { product: Product }) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [qty, setQty] = useState(1);
  const [engraving, setEngraving] = useState("");
  const [giftWrap, setGiftWrap] = useState(false);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "care">("desc");
  const [showAR, setShowAR] = useState(false);

  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const { addToast } = useToast();
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: qty,
      image: product.image,
      tag: selectedColor || selectedSize || undefined,
    });
    addToast("cart", "Added to Cart", `${product.name} × ${qty}`);
  };

  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.tags.some((t) => product.tags.includes(t)))
    .slice(0, 4);

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-white/40 font-[var(--font-body)] mb-8 max-w-7xl mx-auto">
        <Link href="/" className="hover:text-white/60">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/products" className="hover:text-white/60">Products</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-white/60">{product.category}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-white/70">{product.name}</span>
      </nav>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* LEFT: Image Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="relative aspect-square bg-surface rounded-2xl border border-white/[0.04] flex items-center justify-center overflow-hidden group">
            {showAR ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-surface">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-teal/10 to-violet/10 flex items-center justify-center animate-pulse">
                  <span className="text-6xl">📱</span>
                </div>
                <p className="text-sm text-white/60 font-[var(--font-body)] text-center max-w-xs">
                  Point your camera at a flat surface. The product will appear in AR.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAR(false)}
                    className="px-4 py-2 rounded-full bg-white/5 text-white/60 text-xs hover:bg-white/10"
                  >
                    Close AR
                  </button>
                </div>
                {/* AR Grid */}
                <div className="absolute inset-8 border border-teal/20 rounded-xl pointer-events-none" />
                <div className="absolute left-1/2 top-8 bottom-8 w-px bg-teal/10 pointer-events-none" />
                <div className="absolute top-1/2 left-8 right-8 h-px bg-teal/10 pointer-events-none" />
              </div>
            ) : (
              <>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Badges */}
                {product.ar && (
                  <button
                    onClick={() => setShowAR(true)}
                    className="absolute top-4 left-4 liquid-glass rounded-full px-3 py-1.5 text-xs text-teal flex items-center gap-1.5 hover:bg-white/5 transition-colors z-10"
                  >
                    <Eye className="w-3.5 h-3.5" /> View in AR
                  </button>
                )}
                <button className="absolute top-4 right-4 liquid-glass rounded-full p-2.5 text-white/40 hover:text-white transition-colors z-10">
                  <Share2 className="w-4 h-4" />
                </button>
                <span className="absolute bottom-4 left-4 bg-coral/90 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                  {product.discount}% OFF
                </span>
              </>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3">
            {product.images.map((img, i) => (
              <div
                key={i}
                className={`relative w-16 h-16 rounded-xl overflow-hidden cursor-pointer transition-all ${
                  i === 0
                    ? "border-2 border-violet/50"
                    : "border border-white/[0.04] hover:border-white/10"
                }`}
              >
                <Image
                  src={img}
                  alt={`${product.name} view ${i + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT: Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-5"
        >
          <a href="#" className="text-xs text-violet-light hover:underline font-[var(--font-body)]">
            {product.brand}
          </a>

          <h1 className="text-3xl md:text-4xl font-[var(--font-heading)] italic text-white tracking-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${
                    s <= Math.floor(product.rating)
                      ? "text-gold fill-gold"
                      : "text-white/20"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-white/60 font-[var(--font-mono)]">
              {product.rating} ({product.reviews.toLocaleString("en-IN")} reviews)
            </span>
          </div>

          <p className="text-[10px] text-white/30 font-[var(--font-mono)]">
            SKU: {product.sku}
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="font-[var(--font-mono)] text-3xl font-bold text-white">
              {formatINR(product.price)}
            </span>
            <span className="font-[var(--font-mono)] text-lg text-white/30 line-through">
              {formatINR(product.basePrice)}
            </span>
            <span className="bg-coral/90 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
              {product.discount}% OFF
            </span>
            <span className="text-[10px] text-white/30 font-[var(--font-body)]">
              incl. GST
            </span>
          </div>

          {/* Delivery */}
          <div className="liquid-glass rounded-xl px-4 py-3 flex items-center gap-3">
            <Package className="w-4 h-4 text-teal flex-shrink-0" />
            <div className="flex-1">
              <span className="text-xs text-white/70 font-[var(--font-body)]">
                Deliver to{" "}
                <span className="text-white font-semibold">400001</span> — Est.{" "}
                <span className="text-teal font-semibold">Apr 25-27</span>
              </span>
            </div>
            <button className="text-[10px] text-violet-light font-medium">
              Change
            </button>
          </div>

          {/* Colors */}
          <div className="space-y-2">
            <label className="text-xs text-white/50 font-[var(--font-body)]">
              Colour: <span className="text-white">{selectedColor}</span>
            </label>
            <div className="flex gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`w-9 h-9 rounded-full transition-all ${
                    selectedColor === c.name
                      ? "ring-2 ring-white ring-offset-2 ring-offset-void"
                      : "hover:ring-1 hover:ring-white/30"
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Sizes */}
          {product.sizes.length > 1 && (
            <div className="space-y-2">
              <label className="text-xs text-white/50 font-[var(--font-body)]">
                Size: <span className="text-white">{selectedSize}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 rounded-xl text-xs font-[var(--font-body)] transition-all ${
                      selectedSize === s
                        ? "bg-violet/20 border border-violet/40 text-white"
                        : "bg-white/[0.03] border border-white/[0.06] text-white/60 hover:border-white/15"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-2">
            <label className="text-xs text-white/50 font-[var(--font-body)]">
              Quantity
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/60 hover:bg-white/5 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-[var(--font-mono)] text-lg text-white w-8 text-center">
                {qty}
              </span>
              <button
                onClick={() => setQty(Math.min(product.stock, qty + 1))}
                className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/60 hover:bg-white/5 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Engraving */}
          <div className="space-y-2">
            <label className="text-xs text-white/50 font-[var(--font-body)]">
              📝 Add Engraving (optional)
            </label>
            <div className="relative">
              <input
                value={engraving}
                onChange={(e) => setEngraving(e.target.value.slice(0, 30))}
                placeholder="Enter your message..."
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-violet/40 transition-colors font-[var(--font-body)]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-white/30 font-[var(--font-mono)]">
                {engraving.length}/30
              </span>
            </div>
          </div>

          {/* Gift Wrap */}
          <label className="flex items-center gap-3 liquid-glass rounded-xl px-4 py-3 cursor-pointer hover:bg-white/[0.03] transition-colors">
            <input
              type="checkbox"
              checked={giftWrap}
              onChange={(e) => setGiftWrap(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                giftWrap
                  ? "bg-violet border-violet"
                  : "bg-white/5 border border-white/10"
              }`}
            >
              {giftWrap && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className="text-sm text-white/70 font-[var(--font-body)]">
              🎁 Add Gift Wrap (+₹99)
            </span>
          </label>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 w-full py-4 rounded-full bg-gradient-to-r from-violet to-violet-light text-white text-sm font-semibold hover:shadow-lg hover:shadow-violet/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Cart — {formatINR(product.price * qty)}
            </button>
            <button
              onClick={() => {
                const added = toggleItem({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                });
                addToast(
                  added ? "success" : "info",
                  added ? "Saved to Wishlist" : "Removed from Wishlist",
                  product.name
                );
              }}
              className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-full border text-sm font-medium transition-all ${
                wishlisted
                  ? "bg-coral/10 border-coral/30 text-coral"
                  : "bg-white/[0.02] border-white/[0.08] text-white/70 hover:border-white/15"
              }`}
            >
              <Heart
                className={`w-4 h-4 ${wishlisted ? "fill-coral" : ""}`}
              />
              {wishlisted ? "Saved to Wishlist" : "Save to Wishlist"}
            </button>
          </div>

          {/* Earn Coins */}
          <p className="text-xs text-gold font-[var(--font-body)] flex items-center gap-1.5">
            ✨ Earn {Math.floor(product.price * qty * 0.05)} GiftCoins with this purchase
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-4 pt-2">
            {[
              { icon: RotateCcw, label: "7-day return" },
              { icon: Shield, label: "Secure payment" },
              { icon: Truck, label: "98% on-time" },
            ].map((b) => (
              <span
                key={b.label}
                className="flex items-center gap-1.5 text-[11px] text-white/40 font-[var(--font-body)]"
              >
                <b.icon className="w-3 h-3 text-teal" />
                {b.label}
              </span>
            ))}
          </div>

          {/* Stock Warning */}
          {product.stock <= 10 && (
            <p className="text-xs text-coral font-[var(--font-body)] animate-pulse">
              🔴 Only {product.stock} left in stock — order soon!
            </p>
          )}
        </motion.div>
      </div>

      {/* Tabs Section */}
      <div className="max-w-7xl mx-auto mt-16">
        <div className="flex gap-1 mb-6">
          {[
            { key: "desc", label: "Description" },
            { key: "specs", label: "Specifications" },
            { key: "care", label: "Care Instructions" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-5 py-2.5 rounded-full text-xs font-[var(--font-body)] transition-all ${
                activeTab === tab.key
                  ? "bg-violet/20 text-white"
                  : "text-white/40 hover:text-white/60 hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="liquid-glass rounded-2xl p-6 md:p-8">
          {activeTab === "desc" && (
            <p className="text-sm text-white/70 font-[var(--font-body)] font-light leading-relaxed">
              {product.description}
            </p>
          )}
          {activeTab === "specs" && (
            <div className="space-y-3">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div
                  key={key}
                  className="flex justify-between py-2 border-b border-white/5 last:border-0"
                >
                  <span className="text-xs text-white/40 font-[var(--font-body)]">
                    {key}
                  </span>
                  <span className="text-xs text-white/80 font-[var(--font-mono)]">
                    {val}
                  </span>
                </div>
              ))}
            </div>
          )}
          {activeTab === "care" && (
            <p className="text-sm text-white/70 font-[var(--font-body)] font-light leading-relaxed">
              {product.careInstructions}
            </p>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto mt-16">
          <h2 className="text-2xl font-[var(--font-heading)] italic text-white mb-6">
            People Also Gifted
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((rp) => (
              <Link
                key={rp.id}
                href={`/products/${rp.slug}`}
                className="bg-surface rounded-xl border border-white/[0.04] p-4 hover:-translate-y-1 hover:border-violet/20 transition-all duration-300 group"
              >
                <div className="relative aspect-square bg-card rounded-lg overflow-hidden mb-3">
                  <Image
                    src={rp.image}
                    alt={rp.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <p className="text-xs text-white/40 font-[var(--font-body)]">
                  {rp.category}
                </p>
                <p className="text-sm font-semibold text-white font-[var(--font-display)] truncate">
                  {rp.name}
                </p>
                <p className="font-[var(--font-mono)] text-sm text-white mt-1">
                  {formatINR(rp.price)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
