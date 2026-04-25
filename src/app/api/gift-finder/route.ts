import { NextRequest, NextResponse } from "next/server";

// Static product data (replace with MongoDB query when DB is connected)
const PRODUCTS = [
  { id: "1", name: "The Gentleman's Box", price: 1999, image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=400&fit=crop", tags: ["him", "men", "grooming", "lifestyle"], occasion: ["birthday", "anniversary", "corporate"], budgetMax: 2000 },
  { id: "2", name: "Self-Care Soother", price: 1299, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop", tags: ["selfcare", "her", "relaxation", "candles", "skincare"], occasion: ["birthday", "getwell", "thankyou"], budgetMax: 1500 },
  { id: "3", name: "Blush & Bloom", price: 1539, image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=400&fit=crop", tags: ["her", "women", "floral", "feminine", "elegant"], occasion: ["birthday", "anniversary", "valentine"], budgetMax: 1600 },
  { id: "4", name: "Whole Lot of Nature", price: 1099, image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop", tags: ["plants", "nature", "hobby", "eco", "gardening"], occasion: ["housewarming", "birthday"], budgetMax: 1200 },
  { id: "5", name: "Hello, Gorgeous", price: 999, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop", tags: ["her", "beauty", "accessories", "makeup"], occasion: ["birthday", "friendship"], budgetMax: 1000 },
  { id: "6", name: "Satin Rose Bouquet", price: 399, image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=400&fit=crop", tags: ["romantic", "flowers", "her", "roses"], occasion: ["anniversary", "valentine", "romantic"], budgetMax: 500 },
];

export async function POST(req: NextRequest) {
  try {
    const { recipient, occasion, budget, interests } = await req.json();

    let filtered = [...PRODUCTS];

    // Filter by budget
    if (budget) {
      const budgetNum = parseInt(String(budget).replace(/[^0-9]/g, ""));
      if (budgetNum > 0) {
        filtered = filtered.filter((p) => p.price <= budgetNum);
      }
    }

    // Filter by occasion
    if (occasion) {
      const occ = occasion.toLowerCase();
      const occasionMatches = filtered.filter((p) =>
        p.occasion.some((o) => occ.includes(o) || o.includes(occ))
      );
      if (occasionMatches.length > 0) filtered = occasionMatches;
    }

    // Filter by recipient
    if (recipient) {
      const rec = recipient.toLowerCase();
      const recipientMatches = filtered.filter((p) =>
        p.tags.some((t) => rec.includes(t) || t.includes(rec))
      );
      if (recipientMatches.length > 0) filtered = recipientMatches;
    }

    // Score by interests
    if (interests && Array.isArray(interests) && interests.length > 0) {
      filtered = filtered
        .map((p) => ({
          ...p,
          score: interests.filter((i: string) =>
            p.tags.some((t) => t.includes(i.toLowerCase()))
          ).length,
        }))
        .sort((a, b) => b.score - a.score);
    }

    // Return top 3
    const recommendations = filtered.slice(0, 3);

    return NextResponse.json({
      success: true,
      recommendations: recommendations.length > 0 ? recommendations : PRODUCTS.slice(0, 3),
    });
  } catch (error) {
    console.error("Gift finder error:", error);
    return NextResponse.json({ error: "Gift finder error" }, { status: 500 });
  }
}
