"use client";

import { IoHeartOutline, IoHeart, IoCartOutline, IoStar, IoSparklesOutline } from "react-icons/io5";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useProducts } from "@/lib/useProducts";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";

export function Collections() {
  const { products, loading, error } = useProducts(); // Fetch from backend!
  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const { addToast } = useToast();

  return (
    <section id="collections" className="py-28 bg-[#0D0F1A]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E8A87C]/30 bg-[#E8A87C]/10 px-4 py-1.5 text-sm text-[#E8A87C] mb-6">
            <IoSparklesOutline className="h-4 w-4" /> Curated Gift Hampers
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

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-[#7C3AED]/30 border-t-[#7C3AED] rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-400">
            Failed to load collections: {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 6).map((product) => {
              const wishlisted = isWishlisted(product.id);
              return (
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
                    <IoSparklesOutline className="h-3 w-3" />
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
                          <IoStar
                            key={i}
                            className={`h-3 w-3 ${i < Math.floor(product.rating || 5) ? 'fill-[#E8A87C] text-[#E8A87C]' : 'text-gray-500'}`}
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
                        <IoCartOutline className="h-4 w-4 mr-1" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`rounded-xl border-[#2E2E38] transition-all duration-300 ${
                          wishlisted
                            ? "border-red-500/50 bg-red-500/10 text-red-400"
                            : "text-[#9CA3AF] hover:border-red-500/50 hover:text-red-400"
                        }`}
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
                      >
                        {wishlisted ? (
                          <IoHeart className="h-4 w-4 text-red-500" />
                        ) : (
                          <IoHeartOutline className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

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
