"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { IoHeartOutline, IoCartOutline, IoTrashOutline, IoArrowBackOutline } from "react-icons/io5";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { formatINR } from "@/lib/utils";
import { products } from "@/lib/data";

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();
  const { addToast } = useToast();

  // Enrich wishlist items with full product data
  const enriched = items
    .map((wi) => {
      const product = products.find((p) => p.id === wi.id);
      return product ? { ...product, wishlistItem: wi } : null;
    })
    .filter(Boolean) as (typeof products[number] & { wishlistItem: { id: string } })[];

  return (
    <>
      <Navbar />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-16 max-w-5xl mx-auto min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <IoHeartOutline className="w-6 h-6 text-red-400 fill-red-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Your Wishlist
            </h1>
          </div>
          <p className="text-sm text-white/50">
            {items.length} {items.length === 1 ? "item" : "items"} saved
          </p>
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <IoHeartOutline className="w-16 h-16 text-white/10 mx-auto mb-6" />
            <h2 className="text-xl font-semibold text-white/60 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-sm text-white/40 mb-8">
              Browse our collection and tap the heart icon to save items you love.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9B87F5] text-white text-sm font-medium hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all"
            >
              <IoArrowBackOutline className="w-4 h-4" />
              Explore Gifts
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {enriched.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-4 p-4 rounded-2xl bg-[#1F2023] border border-[#2E2E38] hover:border-[#7C3AED]/30 transition-all group"
              >
                <Link
                  href={`/products/${product.slug}`}
                  className="relative w-24 h-24 rounded-xl bg-[#0D0F1A] overflow-hidden flex-shrink-0"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="96px"
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </Link>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="text-sm font-semibold text-white truncate hover:text-[#9B87F5] transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-[10px] text-white/40">{product.category}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-bold text-white">
                      {formatINR(product.price)}
                    </span>
                    <span className="text-xs text-white/30 line-through">
                      {formatINR(product.basePrice)}
                    </span>
                    <span className="text-[10px] text-[#10B981] font-bold">
                      {product.discount}% OFF
                    </span>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => {
                        addItem({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          quantity: 1,
                          image: product.image,
                        });
                        addToast("success", "Added to Cart", product.name);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#7C3AED]/15 text-[#9B87F5] text-[11px] font-medium hover:bg-[#7C3AED]/25 transition-colors"
                    >
                      <IoCartOutline className="w-3 h-3" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => {
                        removeItem(product.id);
                        addToast("info", "Removed", `${product.name} removed from wishlist`);
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-red-500/10 text-red-400 text-[11px] hover:bg-red-500/20 transition-colors"
                    >
                      <IoTrashOutline className="w-3 h-3" />
                    </button>
                  </div>
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
