"use client";

import { useState } from "react";
import { Heart, ShoppingCart, Star, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { products } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

export function Collections() {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { addItem } = useCart();
  const { addToast } = useToast();

  return (
    <section id="collections" className="py-28 bg-[#0D0F1A]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E8A87C]/30 bg-[#E8A87C]/10 px-4 py-1.5 text-sm text-[#E8A87C] mb-6">
            <Sparkles className="h-4 w-4" /> Curated Gift Hampers
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Best Gift Hampers at{" "}
            <span className="bg-gradient-to-r from-[#E8A87C] to-[#7C3AED] bg-clip-text text-transparent">
              GiftGenius
            </span>
          </h2>
          <p className="text-[#9CA3AF] text-lg max-w-2xl mx-auto">
            Timeless elegance meets impeccable taste. Gifts that leave a lasting
            impression.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative rounded-2xl border border-[#2E2E38] bg-[#1F2023] overflow-hidden hover:border-[#7C3AED]/50 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] transition-all duration-500"
            >
              {/* Badge */}
              {product.badge && (
                <div className="absolute top-3 left-3 z-10 rounded-full bg-[#7C3AED] px-3 py-1 text-xs font-semibold text-white">
                  {product.badge}
                </div>
              )}

              {/* AI Match Score */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-sm px-2 py-1 text-xs text-[#9B87F5]">
                <Sparkles className="h-3 w-3" />
                98% match
              </div>

              {/* Image */}
              <div className="relative overflow-hidden h-56">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F2023] via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="rounded-full bg-[#7C3AED]/20 px-2 py-0.5 text-xs text-[#9B87F5]">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-3 w-3 fill-[#E8A87C] text-[#E8A87C]"
                      />
                    ))}
                  </div>
                </div>
                <h3 className="text-white font-semibold text-lg mb-3">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl font-bold text-white">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-[#9CA3AF] line-through">
                    ₹{product.basePrice.toLocaleString()}
                  </span>
                  <span className="ml-auto rounded-full bg-[#10B981]/20 px-2 py-0.5 text-xs text-[#10B981]">
                    {Math.round(
                      (1 - product.price / product.basePrice) * 100
                    )}
                    % OFF
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#9B87F5] text-white hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:scale-[1.02] transition-all duration-300"
                    size="sm"
                    onClick={() => {
                      addItem({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image });
                      addToast("success", "Added to Cart", `${product.name} has been added to your cart.`);
                    }}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`rounded-xl border-[#2E2E38] transition-all duration-300 ${
                      wishlist.includes(product.id)
                        ? "border-red-500/50 bg-red-500/10 text-red-400"
                        : "text-[#9CA3AF] hover:border-red-500/50 hover:text-red-400"
                    }`}
                    onClick={() =>
                      setWishlist((prev) =>
                        prev.includes(product.id)
                          ? prev.filter((id) => id !== product.id)
                          : [...prev, product.id]
                      )
                    }
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        wishlist.includes(product.id) ? "fill-red-500" : ""
                      }`}
                    />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link
            href="/products"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "rounded-full border-[#2E2E38] text-[#9CA3AF] px-10 hover:border-[#7C3AED]/50 hover:text-white hover:bg-white/5 transition-all"
            )}
          >
            View All Collections
          </Link>
        </div>
      </div>
    </section>
  );
}
