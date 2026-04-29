import { NextResponse } from "next/server";
import { products, searchProducts } from "@/lib/data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const category = searchParams.get("category");
  const ar = searchParams.get("ar");
  const sort = searchParams.get("sort");
  const minPrice = parseInt(searchParams.get("minPrice") || "0");
  const maxPrice = parseInt(searchParams.get("maxPrice") || "999999");

  let results = [...products];

  // Search filter
  if (query) {
    results = searchProducts(query);
  }

  // Category filter
  if (category) {
    results = results.filter((p) => p.categorySlug === category);
  }

  // AR filter
  if (ar === "true") {
    results = results.filter((p) => p.ar);
  }

  // Price filter
  results = results.filter((p) => p.price >= minPrice && p.price <= maxPrice);

  // Sort
  if (sort === "price_asc") results.sort((a, b) => a.price - b.price);
  else if (sort === "price_desc") results.sort((a, b) => b.price - a.price);
  else if (sort === "rating") results.sort((a, b) => b.rating - a.rating);
  else if (sort === "newest") results.reverse();
  else results.sort((a, b) => b.reviews - a.reviews); // default: popularity

  return NextResponse.json({
    products: results,
    total: results.length,
    filters: {
      categories: [...new Set(products.map((p) => p.categorySlug))],
      priceRange: {
        min: Math.min(...products.map((p) => p.price)),
        max: Math.max(...products.map((p) => p.price)),
      },
    },
  });
}
