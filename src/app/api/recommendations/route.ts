import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import UserActivity from "@/models/UserActivity";
import { products } from "@/lib/data";

// POST: Track user activity
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, sessionId, activityType, productId, category, searchQuery, metadata } = body;

    if (!userId || !activityType) {
      return NextResponse.json(
        { error: "userId and activityType are required" },
        { status: 400 }
      );
    }

    await connectDB();

    await UserActivity.create({
      userId,
      sessionId: sessionId || "anonymous",
      activityType,
      productId,
      category,
      searchQuery,
      metadata,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Activity tracking error:", error);
    // Don't fail the user experience for tracking errors
    return NextResponse.json(
      {
        success: false,
        accepted: true,
        message: "Activity tracking failed; request accepted but not persisted",
      },
      { status: 202 }
    );
  }
}

// GET: Get personalized recommendations
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      // Return trending products for anonymous users
      const trending = [...products]
        .sort((a, b) => b.reviews - a.reviews)
        .slice(0, 6);
      return NextResponse.json({ recommendations: trending, source: "trending" });
    }

    await connectDB();

    // Get user's recent activity
    const activities = await UserActivity.find({
      userId,
      activityType: { $in: ["view", "click", "add_to_cart", "purchase"] },
    })
      .sort({ timestamp: -1 })
      .limit(50)
      .lean();

    if (activities.length === 0) {
      const popular = [...products]
        .sort((a, b) => b.reviews - a.reviews)
        .slice(0, 6);
      return NextResponse.json({ recommendations: popular, source: "popular" });
    }

    // Score products based on user behavior
    const categoryScores: Record<string, number> = {};
    const tagScores: Record<string, number> = {};
    const viewedProductIds = new Set<string>();

    const WEIGHTS = {
      purchase: 5,
      add_to_cart: 3,
      click: 2,
      view: 1,
    };

    for (const activity of activities) {
      const weight = WEIGHTS[activity.activityType as keyof typeof WEIGHTS] || 1;

      if (activity.productId) {
        viewedProductIds.add(activity.productId);
        const product = products.find((p) => p.id === activity.productId);
        if (product) {
          categoryScores[product.categorySlug] =
            (categoryScores[product.categorySlug] || 0) + weight;
          for (const tag of product.tags) {
            tagScores[tag] = (tagScores[tag] || 0) + weight;
          }
        }
      }

      if (activity.category) {
        categoryScores[activity.category] =
          (categoryScores[activity.category] || 0) + weight;
      }
    }

    // Score all products
    const scoredProducts = products
      .filter((p) => !viewedProductIds.has(p.id)) // Exclude already viewed
      .map((product) => {
        let score = 0;
        score += (categoryScores[product.categorySlug] || 0) * 2;
        for (const tag of product.tags) {
          score += tagScores[tag] || 0;
        }
        score += product.rating * 0.5;
        score += Math.log(product.reviews + 1) * 0.3;
        return { ...product, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    // If not enough, fill with popular
    if (scoredProducts.length < 4) {
        const popular = [...products]
        .sort((a, b) => b.reviews - a.reviews)
        .slice(0, 8 - scoredProducts.length)
        .map((p) => ({ ...p, score: 0 }));
      scoredProducts.push(...popular);
    }

    return NextResponse.json({
      recommendations: scoredProducts,
      source: "personalized",
    });
  } catch (error) {
    console.error("Recommendations error:", error);
    const fallback = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 6);
    return NextResponse.json({ recommendations: fallback, source: "fallback" });
  }
}
