import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ProductModel from "@/models/Product";
import { products as staticProducts, searchProducts as staticSearch } from "@/lib/data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const category = searchParams.get("category");
  const ar = searchParams.get("ar");
  const sort = searchParams.get("sort");
  const minPrice = parseInt(searchParams.get("minPrice") || "0");
  const maxPrice = parseInt(searchParams.get("maxPrice") || "999999");

  // ── Try MongoDB first, fall back to static data ──
  let useDB = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let dbProducts: any[] = [];

  try {
    await connectDB();
    const count = await ProductModel.countDocuments();
    if (count > 0) {
      dbProducts = await ProductModel.find({}).lean();
      useDB = true;
    }
  } catch {
    // DB unavailable — silently fall back to static data
  }

  if (useDB) {
    // ── MongoDB path ──
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let results: any[] = dbProducts;

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          (p.tags || []).some((t: string) => t.includes(q)) ||
          p.description?.toLowerCase().includes(q)
      );
    }
    if (category) results = results.filter((p) => p.categorySlug === category);
    if (ar === "true") results = results.filter((p) => p.ar);
    results = results.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    if (sort === "price_asc") results.sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") results.sort((a, b) => b.price - a.price);
    else if (sort === "rating") results.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    else if (sort === "newest") results.reverse();
    else results.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));

    const allCategories = [...new Set(dbProducts.map((p) => p.categorySlug as string))];
    const allPrices = dbProducts.map((p) => p.price as number);

    return NextResponse.json({
      products: results,
      total: results.length,
      source: "mongodb",
      filters: {
        categories: allCategories,
        priceRange: {
          min: Math.min(...allPrices),
          max: Math.max(...allPrices),
        },
      },
    });
  }

  // ── Static data fallback ──
  let results = [...staticProducts];
  if (query) results = staticSearch(query);
  if (category) results = results.filter((p) => p.categorySlug === category);
  if (ar === "true") results = results.filter((p) => p.ar);
  results = results.filter((p) => p.price >= minPrice && p.price <= maxPrice);

  if (sort === "price_asc") results.sort((a, b) => a.price - b.price);
  else if (sort === "price_desc") results.sort((a, b) => b.price - a.price);
  else if (sort === "rating") results.sort((a, b) => b.rating - a.rating);
  else if (sort === "newest") results.reverse();
  else results.sort((a, b) => b.reviews - a.reviews);

  return NextResponse.json({
    products: results,
    total: results.length,
    source: "static",
    filters: {
      categories: [...new Set(staticProducts.map((p) => p.categorySlug))],
      priceRange: {
        min: Math.min(...staticProducts.map((p) => p.price)),
        max: Math.max(...staticProducts.map((p) => p.price)),
      },
    },
  });
}
