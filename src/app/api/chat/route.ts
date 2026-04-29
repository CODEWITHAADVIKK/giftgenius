import { NextRequest, NextResponse } from "next/server";
import { chatLimiter } from "@/lib/rate-limit";
import { products } from "@/lib/data";

// ─── Intent Detection Engine (NLU) ───────────────────────────────────────────
// Simulates Rasa NLU intent extraction locally for zero-dependency operation.
// Extracts: intent, recipient, occasion, budget, category from natural language.

interface IntentResult {
  intent: string;
  entities: {
    recipient?: string;
    occasion?: string;
    budget?: number;
    category?: string;
  };
  confidence: number;
}

function detectIntent(message: string): IntentResult {
  const msg = message.toLowerCase();
  const entities: IntentResult["entities"] = {};
  let intent = "general_query";
  let confidence = 0.5;

  // ── Recipient extraction ──
  const recipientPatterns: Record<string, string[]> = {
    mother:    ["mom", "mother", "maa", "mummy", "amma"],
    father:    ["dad", "father", "papa", "daddy", "baba"],
    sister:    ["sister", "sis", "didi", "behen"],
    brother:   ["brother", "bro", "bhai", "bhaiya"],
    wife:      ["wife", "spouse", "partner"],
    husband:   ["husband", "hubby"],
    girlfriend: ["girlfriend", "gf"],
    boyfriend: ["boyfriend", "bf"],
    friend:    ["friend", "bestie", "buddy", "dost"],
    colleague: ["colleague", "boss", "coworker", "office", "corporate", "client"],
    child:     ["kid", "child", "son", "daughter", "baby"],
  };

  for (const [recipient, patterns] of Object.entries(recipientPatterns)) {
    if (patterns.some((p) => msg.includes(p))) {
      entities.recipient = recipient;
      break;
    }
  }

  // ── Occasion extraction ──
  const occasionPatterns: Record<string, string[]> = {
    birthday:    ["birthday", "bday", "born"],
    anniversary: ["anniversary", "wedding anniversary"],
    diwali:      ["diwali", "deepavali"],
    rakhi:       ["rakhi", "raksha bandhan", "rakshabandhan"],
    valentines:  ["valentine", "valentines"],
    wedding:     ["wedding", "marriage", "shaadi"],
    housewarming: ["housewarming", "griha pravesh", "new home"],
    christmas:   ["christmas", "xmas"],
    thank_you:   ["thank you", "thanks", "appreciation"],
  };

  for (const [occasion, patterns] of Object.entries(occasionPatterns)) {
    if (patterns.some((p) => msg.includes(p))) {
      entities.occasion = occasion;
      break;
    }
  }

  // ── Budget extraction ──
  const budgetMatch = msg.match(/(?:under|below|within|budget|upto|up to|max|less than)\s*₹?\s*(\d+)/i)
    || msg.match(/₹\s*(\d+)/);
  if (budgetMatch) {
    entities.budget = parseInt(budgetMatch[1]);
  }

  // ── Category extraction ──
  const categoryPatterns: Record<string, string[]> = {
    electronics: ["tech", "gadget", "electronic", "speaker", "headphone"],
    jewellery:   ["jewellery", "jewelry", "bracelet", "necklace", "ring", "gold"],
    wellness:    ["candle", "skincare", "self-care", "wellness", "spa", "relaxation"],
    fashion:     ["fashion", "scarf", "shawl", "clothing", "pashmina"],
    personalized: ["personalized", "personalised", "custom", "name", "mug", "photo"],
    home:        ["home", "decor", "lamp", "frame", "plant"],
  };

  for (const [category, patterns] of Object.entries(categoryPatterns)) {
    if (patterns.some((p) => msg.includes(p))) {
      entities.category = category;
      break;
    }
  }

  // ── Intent classification ──
  if (entities.recipient || entities.occasion || entities.budget || entities.category) {
    intent = "gift_suggestion";
    confidence = 0.9;
  }

  if (msg.includes("track") || msg.includes("order") || msg.includes("delivery") || msg.includes("status")) {
    intent = "order_tracking";
    confidence = 0.85;
  }

  if (msg.includes("price") || msg.includes("cost") || msg.includes("how much")) {
    intent = "price_inquiry";
    confidence = 0.8;
  }

  if (msg.match(/^(hi|hello|hey|namaste|good morning|good evening)/)) {
    intent = "greeting";
    confidence = 0.95;
  }

  if (msg.includes("return") || msg.includes("refund") || msg.includes("exchange")) {
    intent = "support";
    confidence = 0.85;
  }

  return { intent, entities, confidence };
}

// ─── Gift Discovery Engine ───────────────────────────────────────────────────
// Matches products from catalog based on extracted entities.

interface GiftProduct {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  slug: string;
  category: string;
  rating: number;
  matchScore: number;
  matchReason: string;
}

function discoverGifts(entities: IntentResult["entities"]): GiftProduct[] {
  let scored = products.map((p) => {
    let score = 50; // base
    let reason = "Great gift choice";

    // Budget matching
    if (entities.budget) {
      if (p.price <= entities.budget) {
        score += 30;
        reason = `Within your ₹${entities.budget.toLocaleString()} budget`;
      } else {
        score -= 20;
      }
    }

    // Category matching
    if (entities.category) {
      if (p.category.toLowerCase().includes(entities.category)) {
        score += 25;
        reason = `Matches ${entities.category} preference`;
      }
    }

    // Recipient-based scoring
    if (entities.recipient) {
      const femaleRecipients = ["mother", "sister", "wife", "girlfriend"];
      const maleRecipients = ["father", "brother", "husband", "boyfriend"];

      if (femaleRecipients.includes(entities.recipient)) {
        if (["Jewellery", "Wellness", "Fashion", "Personalized"].some(c => p.category.includes(c))) {
          score += 20;
          reason = `Perfect for ${entities.recipient}`;
        }
      }
      if (maleRecipients.includes(entities.recipient)) {
        if (["Electronics", "Personalized"].some(c => p.category.includes(c))) {
          score += 20;
          reason = `Great pick for ${entities.recipient}`;
        }
      }
    }

    // Occasion-based boost
    if (entities.occasion) {
      score += 5;
      const occasionName = entities.occasion.replace(/_/g, " ");
      reason = `Ideal for ${occasionName}`;
    }

    // Rating boost
    score += p.rating * 2;

    return {
      id: p.id,
      name: p.name,
      price: p.price,
      originalPrice: p.basePrice,
      image: p.image,
      slug: p.slug,
      category: p.category,
      rating: p.rating,
      matchScore: Math.min(score, 100),
      matchReason: reason,
    };
  });

  // Sort by score, return top 3
  scored.sort((a, b) => b.matchScore - a.matchScore);
  return scored.slice(0, 3);
}

// ─── Response Generation ─────────────────────────────────────────────────────

function generateResponse(intent: IntentResult, giftProducts: GiftProduct[]): { reply: string; products: GiftProduct[] } {
  switch (intent.intent) {
    case "greeting":
      return {
        reply: "Namaste! 🙏 Welcome to GiftGenius AI! I'm here to help you find the perfect gift.\n\nTell me:\n• **Who** is this for? (Mom, friend, boss)\n• **What's the occasion?** (Birthday, Diwali, Anniversary)\n• **Budget range?** (under ₹1000, ₹2000, etc.)\n\nOr just describe what you're looking for!",
        products: [],
      };

    case "gift_suggestion": {
      const { recipient, occasion, budget } = intent.entities;
      let intro = "Here are my top picks for you! 🎁\n\n";

      if (recipient && occasion) {
        intro = `Perfect ${occasion.replace(/_/g, " ")} gifts for your ${recipient}! 🎁\n\n`;
      } else if (recipient) {
        intro = `Great gift ideas for your ${recipient}! 🎁\n\n`;
      } else if (occasion) {
        intro = `Amazing ${occasion.replace(/_/g, " ")} gift ideas! 🎁\n\n`;
      }

      if (budget) {
        intro += `*Budget: under ₹${budget.toLocaleString()}*\n\n`;
      }

      const productLines = giftProducts.map((p, i) =>
        `${i + 1}. **${p.name}** — ₹${p.price.toLocaleString()} ~~₹${p.originalPrice.toLocaleString()}~~\n   ⭐ ${p.rating}/5 · ${p.matchReason}`
      ).join("\n\n");

      return {
        reply: intro + productLines + "\n\n💡 *Click any product to view details, or tell me more about what you're looking for!*",
        products: giftProducts,
      };
    }

    case "order_tracking":
      return {
        reply: "I'd be happy to help track your order! 📦\n\nPlease share your **order ID** (format: GG-2026-XXXX) and I'll fetch the latest status.\n\nYou can also check your order status on the [Orders page](/orders).",
        products: [],
      };

    case "price_inquiry":
      return {
        reply: "Here's our price range:\n\n• 💰 **Under ₹599** — Mugs, candles, keychains\n• 🎁 **₹599–₹1,299** — Curated combos, skincare sets\n• ✨ **₹1,299–₹3,799** — Premium hampers, electronics\n• 💎 **₹3,799+** — Luxury jewellery, designer items\n\nTell me your budget and I'll find the perfect match!",
        products: [],
      };

    case "support":
      return {
        reply: "I understand you need help with returns/refunds. 🛟\n\n• **Returns**: Free within 7 days of delivery\n• **Refunds**: Processed within 5-7 business days\n• **Exchange**: Available for all products\n\nFor immediate assistance, email us at **support@giftgenius.ai** or call **1800-GIFT-AI**.",
        products: [],
      };

    default:
      return {
        reply: "Great question! 🎁 I'd love to help you find the perfect gift.\n\nCould you tell me:\n1. **Who** is this for? (Mom, boyfriend, colleague)\n2. **What's the occasion?** (Birthday, anniversary, Diwali)\n3. **Budget range?** (under ₹500, ₹1000-2000)\n\nOr just describe what you need — like *\"gift for my sister's birthday under 1500\"* and I'll find the best matches!",
        products: [],
      };
  }
}

// ─── API Route ───────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const limited = chatLimiter(req);
  if (limited) return limited;

  try {
    const { message, history = [] } = await req.json();

    // Step 1: Detect intent (NLU)
    const intent = detectIntent(message);

    // Step 2: Discover matching gifts if intent is gift-related
    const giftProducts = intent.intent === "gift_suggestion"
      ? discoverGifts(intent.entities)
      : [];

    // Step 3: Try GPT/Claude API for enhanced response (if available)
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (apiKey && apiKey !== "your_key_here" && apiKey.length > 10) {
      try {
        const systemPrompt = `You are GiftGenius AI, a warm gift recommendation assistant for an Indian premium gifting platform.

DETECTED INTENT: ${intent.intent}
ENTITIES: ${JSON.stringify(intent.entities)}
MATCHING PRODUCTS: ${JSON.stringify(giftProducts.map(p => ({ name: p.name, price: p.price, category: p.category, rating: p.rating })))}

Use the detected intent and matching products to give a warm, personalized response.
Include product recommendations from the MATCHING PRODUCTS list when relevant.
Keep responses concise, warm, and use Indian context (Diwali, Rakhi, etc.).
Format with markdown bold and emojis for readability.`;

        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 800,
            system: systemPrompt,
            messages: [
              ...history.slice(-6).map((h: { role: string; content: string }) => ({
                role: h.role,
                content: h.content,
              })),
              { role: "user", content: message },
            ],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.content?.[0]?.text;
          if (reply) {
            return NextResponse.json({ reply, products: giftProducts, intent: intent.intent });
          }
        }
      } catch (apiError) {
        console.warn("AI API fallback to local:", apiError);
      }
    }

    // Step 4: Fallback to local response generation
    const { reply, products: resultProducts } = generateResponse(intent, giftProducts);
    return NextResponse.json({ reply, products: resultProducts, intent: intent.intent });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { reply: "Sorry, I'm having trouble connecting. Please try again!", products: [] },
      { status: 500 }
    );
  }
}
