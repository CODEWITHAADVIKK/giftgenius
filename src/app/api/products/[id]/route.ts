import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ProductModel from "@/models/Product";
import { getProduct as getStaticProduct } from "@/lib/data";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Attempt MongoDB fetch first
    try {
      await connectDB();
      // Find by either `productId` or `slug` or MongoDB `_id`
      const dbProduct = await ProductModel.findOne({
        $or: [{ productId: id }, { slug: id }]
      }).lean();

      if (dbProduct) {
        return NextResponse.json({ product: dbProduct, source: "mongodb" });
      }
    } catch (dbError) {
      // Silently fallback if DB fails
      console.warn("DB fetch failed, falling back to static data for product:", id);
    }

    // Fallback to static data
    const staticProduct = getStaticProduct(id);
    
    if (staticProduct) {
      return NextResponse.json({ product: staticProduct, source: "static" });
    }

    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
