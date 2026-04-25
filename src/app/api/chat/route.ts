import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json();

    const systemPrompt = `You are GiftGenius AI, a warm and helpful gift recommendation 
assistant for an Indian premium gifting platform. You help users find perfect gift hampers.

Available products in our catalog:
- The Gentleman's Box (₹1,999) — grooming + lifestyle for men
- Self-Care Soother (₹1,299) — candles, skincare, relaxation
- Blush & Bloom (₹1,539) — floral, feminine, elegant
- Whole Lot of Nature (₹1,099) — plants, gardening, eco-gifts
- Hello, Gorgeous (₹999) — beauty, accessories for her
- Satin Rose Bouquet (₹399) — satin roses, romantic

When a user describes their recipient, recommend 1-3 matching products with:
1. Product name + price
2. Why it's a perfect match (2 lines)
3. A warm, personalized message to include with the gift

Always respond in a warm, helpful tone. Use Indian context (occasions like Diwali, 
Raksha Bandhan, birthdays). Keep responses concise and conversational.`;

    // Check if API key is configured
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey || apiKey === "your_key_here") {
      // Fallback to smart local matching when no API key is configured
      const reply = getLocalResponse(message);
      return NextResponse.json({ reply });
    }

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
          ...history.map((h: { role: string; content: string }) => ({
            role: h.role,
            content: h.content,
          })),
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    const reply = data.content?.[0]?.text ?? "I'm having trouble right now. Please try again!";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { reply: "Sorry, I'm having trouble connecting. Please try again!" },
      { status: 500 }
    );
  }
}

function getLocalResponse(message: string): string {
  const msg = message.toLowerCase();
  
  if (msg.includes("mom") || msg.includes("mother")) {
    return "For Mom, I'd recommend:\n\n🌸 **Blush & Bloom** (₹1,539) — A beautiful floral arrangement with elegant feminine touches. Perfect for showing Mom how special she is!\n\n💆 **Self-Care Soother** (₹1,299) — Candles, skincare essentials, and relaxation items. Because Mom deserves a spa day!\n\n💌 Gift message idea: \"To the most wonderful Mom — thank you for everything. With all my love.\"";
  }
  
  if (msg.includes("boyfriend") || msg.includes("husband") || msg.includes("him") || msg.includes("dad") || msg.includes("father") || msg.includes("brother")) {
    return "For him, here are my top picks:\n\n🎩 **The Gentleman's Box** (₹1,999) — Premium grooming & lifestyle essentials. A sophisticated gift that says 'you've got great taste!'\n\n🌿 **Whole Lot of Nature** (₹1,099) — For the nature lover who appreciates eco-friendly living.\n\n💌 Gift message idea: \"To someone truly special — because you deserve the best.\"";
  }
  
  if (msg.includes("girlfriend") || msg.includes("wife") || msg.includes("her") || msg.includes("sister")) {
    return "For her, I'd suggest:\n\n💄 **Hello, Gorgeous** (₹999) — Beauty essentials & accessories that'll make her smile!\n\n🌸 **Blush & Bloom** (₹1,539) — Elegant floral collection, perfect for someone with refined taste.\n\n🌹 **Satin Rose Bouquet** (₹399) — Timeless satin roses that last forever. Ultra romantic!\n\n💌 Gift message idea: \"You make every day brighter. This is just a small token of how much you mean to me.\"";
  }
  
  if (msg.includes("birthday")) {
    return "Birthday gift ideas! 🎂\n\n🎩 **The Gentleman's Box** (₹1,999) — For him\n💄 **Hello, Gorgeous** (₹999) — For her\n💆 **Self-Care Soother** (₹1,299) — For anyone who loves pampering\n\nAll come with premium gift wrapping! Would you like me to help narrow it down based on the birthday person's interests?";
  }
  
  if (msg.includes("corporate") || msg.includes("boss") || msg.includes("colleague") || msg.includes("office")) {
    return "For corporate gifting, I recommend:\n\n🌿 **Whole Lot of Nature** (₹1,099) — Professional yet thoughtful, perfect for a desk-friendly eco gift.\n\n💆 **Self-Care Soother** (₹1,299) — Neutral and universally appreciated.\n\nWe also offer bulk corporate packages with custom branding. Would you like details on that?";
  }
  
  if (msg.includes("budget") || msg.includes("cheap") || msg.includes("affordable") || msg.includes("under")) {
    return "Great budget-friendly options:\n\n🌹 **Satin Rose Bouquet** (₹399) — Beautiful & romantic at a sweet price point\n💄 **Hello, Gorgeous** (₹999) — Premium feel without the premium price\n🌿 **Whole Lot of Nature** (₹1,099) — Thoughtful & eco-conscious\n\nAll include free gift wrapping! What's your budget range?";
  }
  
  if (msg.includes("track") || msg.includes("order")) {
    return "I'd be happy to help track your order! 📦\n\nPlease share your order ID (format: GG-2026-XXXX) and I'll fetch the latest status for you. You can also check your order status on the Orders page.";
  }
  
  return "Great question! 🎁 I'd love to help you find the perfect gift.\n\nCould you tell me:\n1. **Who** is this for? (e.g., Mom, boyfriend, colleague)\n2. **What's the occasion?** (birthday, anniversary, just because)\n3. **Budget range?** (under ₹500, ₹1000-2000, etc.)\n\nThis helps me recommend the best match from our curated collection!";
}
