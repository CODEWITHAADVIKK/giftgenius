import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import { sanitizeString } from "@/lib/sanitize";
import { apiLimiter } from "@/lib/rate-limit";

// GET reviews for a product
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const reviews = await Review.find({ productId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const stats = await Review.aggregate([
      { $match: { productId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          avgRating: { $avg: "$rating" },
          count1: {
            $sum: {
              $cond: [{ $eq: ["$rating", 1] }, 1, 0],
            },
          },
          count2: {
            $sum: {
              $cond: [{ $eq: ["$rating", 2] }, 1, 0],
            },
          },
          count3: {
            $sum: {
              $cond: [{ $eq: ["$rating", 3] }, 1, 0],
            },
          },
          count4: {
            $sum: {
              $cond: [{ $eq: ["$rating", 4] }, 1, 0],
            },
          },
          count5: {
            $sum: {
              $cond: [{ $eq: ["$rating", 5] }, 1, 0],
            },
          },
        },
      },
    ]);

    const overall = stats[0] || {
      total: 0,
      avgRating: 0,
      count1: 0,
      count2: 0,
      count3: 0,
      count4: 0,
      count5: 0,
    };

    return NextResponse.json({
      reviews,
      stats: {
        total: overall.total,
        averageRating: Math.round((overall.avgRating || 0) * 10) / 10,
        distribution: [
          overall.count1,
          overall.count2,
          overall.count3,
          overall.count4,
          overall.count5,
        ],
      },
    });
  } catch (error) {
    console.error("Reviews fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST a new review
export async function POST(req: NextRequest) {
  const limited = apiLimiter(req);
  if (limited) return limited;

  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Please log in to write a review" },
        { status: 401 }
      );
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET is not configured for reviews");
      return NextResponse.json(
        { error: "Authentication is not configured." },
        { status: 500 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret) as { userId: string };
    } catch (err) {
      if (
        err instanceof jwt.JsonWebTokenError ||
        err instanceof jwt.TokenExpiredError
      ) {
        return NextResponse.json(
          { error: "Invalid or expired token" },
          { status: 401 }
        );
      }
      throw err;
    }

    const body = await req.json();
    const { productId, rating, title, comment, userName } = body;

    const numericRating = Number(rating);
    if (!Number.isFinite(numericRating)) {
      return NextResponse.json(
        { error: "Rating must be a number between 1 and 5" },
        { status: 400 }
      );
    }

    if (!productId || !title || !comment) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (numericRating < 1 || numericRating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check for duplicate review
    const existing = await Review.findOne({
      user: decoded.userId,
      productId,
    });

    if (existing) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 409 }
      );
    }

    const review = await Review.create({
      user: decoded.userId,
      productId,
      rating: Math.round(numericRating),
      title: sanitizeString(title).slice(0, 100),
      comment: sanitizeString(comment).slice(0, 1000),
      userName: sanitizeString(userName || "Anonymous").slice(0, 50),
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Review creation error:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
