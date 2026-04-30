/**
 * useProducts — custom hook
 * Fetches product data from /api/products.
 * Falls back to empty array on error and exposes loading/error state.
 *
 * File: src/lib/useProducts.ts
 */

"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Shared Product type (API response shape) ──────────────────────────────
export interface ApiProduct {
  /** MongoDB _id OR static id (e.g. "gg-001") */
  id: string;
  /** productId field from MongoDB documents */
  productId?: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  brand: string;
  description: string;
  price: number;
  basePrice: number;
  discount: number;
  rating: number;
  /** reviewCount from MongoDB, "reviews" from static data */
  reviews?: number;
  reviewCount?: number;
  image: string;
  images: string[];
  ar: boolean;
  badge: string;
  stock: number;
  sku: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  tags: string[];
  specifications: Record<string, string>;
  careInstructions: string;
}

interface UseProductsOptions {
  category?: string;
  query?: string;
  sort?: string;
  ar?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

interface UseProductsResult {
  products: ApiProduct[];
  total: number;
  source: "mongodb" | "static" | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Normalize a raw API product so both MongoDB docs and static-data shapes
 * expose the same fields (id, reviews, specifications as plain object).
 */
function normalize(raw: Record<string, unknown>): ApiProduct {
  return {
    ...raw,
    // MongoDB uses productId; static data uses id
    id: (raw.productId as string) || (raw.id as string) || (raw._id as string) || "",
    reviews: (raw.reviewCount as number) ?? (raw.reviews as number) ?? 0,
    reviewCount: (raw.reviewCount as number) ?? (raw.reviews as number) ?? 0,
    // specifications may arrive as a plain object or MongoDB Map serialised to {}
    specifications:
      raw.specifications && typeof raw.specifications === "object"
        ? (raw.specifications as Record<string, string>)
        : {},
  } as ApiProduct;
}

export function useProducts(options: UseProductsOptions = {}): UseProductsResult {
  const { category, query, sort, ar, minPrice, maxPrice } = options;

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [source, setSource] = useState<"mongodb" | "static" | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    // Build query string from options
    const params = new URLSearchParams();
    if (query)    params.set("q", query);
    if (category && category !== "all") params.set("category", category);
    if (ar)       params.set("ar", "true");
    if (sort && sort !== "popular") params.set("sort", sort);
    if (minPrice !== undefined) params.set("minPrice", String(minPrice));
    if (maxPrice !== undefined) params.set("maxPrice", String(maxPrice));

    const url = `/api/products${params.toString() ? `?${params}` : ""}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const raw: Record<string, unknown>[] = Array.isArray(data.products)
          ? data.products
          : [];
        setProducts(raw.map(normalize));
        setTotal(data.total ?? raw.length);
        setSource(data.source ?? null);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        console.error("[useProducts] Fetch failed:", err.message);
        setError(err.message);
        setProducts([]);
        setTotal(0);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, query, sort, ar, minPrice, maxPrice, tick]);

  return { products, total, source, loading, error, refetch };
}
