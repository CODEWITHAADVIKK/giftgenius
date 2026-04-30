/**
 * GiftGenius — MongoDB Seed Script
 * Inserts all products from src/lib/data.ts into MongoDB.
 *
 * Usage:
 *   npx ts-node --project tsconfig.json -e "require('./scripts/seed.ts')"
 *   OR (if you have tsx installed):
 *   npx tsx scripts/seed.ts
 *
 * Make sure MONGODB_URI is set in .env.local before running.
 */

import mongoose from "mongoose";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// Load .env.local (Next.js convention)
const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌  MONGODB_URI is not set in .env.local");
  process.exit(1);
}

// ── Inline Product Schema (mirrors src/models/Product.ts) ──
const ProductSchema = new mongoose.Schema(
  {
    productId:    { type: String, required: true, unique: true, index: true },
    name:         { type: String, required: true },
    slug:         { type: String, required: true, unique: true, index: true },
    category:     { type: String, required: true },
    categorySlug: { type: String, required: true, index: true },
    brand:        { type: String, required: true },
    description:  { type: String, required: true },
    price:        { type: Number, required: true },
    basePrice:    { type: Number, required: true },
    discount:     { type: Number, default: 0 },
    rating:       { type: Number, default: 0 },
    reviewCount:  { type: Number, default: 0 },
    image:        { type: String, required: true },
    images:       [{ type: String }],
    ar:           { type: Boolean, default: false },
    badge:        { type: String, default: "" },
    stock:        { type: Number, required: true },
    sku:          { type: String, required: true, unique: true },
    colors:       [{ name: String, hex: String }],
    sizes:        [{ type: String }],
    tags:         [{ type: String }],
    specifications: { type: Map, of: String },
    careInstructions: { type: String, default: "" },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

// ── Product data (from src/lib/data.ts) ──
const products = [
  {
    productId: "gg-001",
    name: "Celestial Silver Photo Frame",
    slug: "celestial-silver-photo-frame",
    category: "Home Decor",
    categorySlug: "home-decor",
    brand: "GiftGenius Originals",
    description:
      "Handcrafted sterling silver photo frame with celestial engravings. Each piece is individually polished by artisans in Jaipur. The perfect keepsake for cherished memories — ideal for weddings, anniversaries, and housewarmings.",
    price: 2499, basePrice: 3499, discount: 29, rating: 4.8, reviewCount: 2847,
    image: "/products/frame.png", images: ["/products/frame.png"],
    ar: true, badge: "Trending in Mumbai", stock: 4, sku: "GG-001-SILV-FRM",
    colors: [{ name: "Silver", hex: "#C0C0C0" }, { name: "Gold", hex: "#FFD700" }, { name: "Rose Gold", hex: "#B76E79" }],
    sizes: ["6×8", "8×10", "10×12"],
    tags: ["wedding", "anniversary", "housewarming", "photo"],
    specifications: new Map(Object.entries({ Material: "Sterling Silver 925", Weight: "340g", Dimensions: "8×10 inches", Finish: "Mirror Polish", Origin: "Jaipur, Rajasthan" })),
    careInstructions: "Wipe with a soft dry cloth. Avoid contact with water or chemicals. Store in the provided velvet pouch.",
  },
  {
    productId: "gg-002",
    name: "Designer Rakhi Gift Set",
    slug: "designer-rakhi-gift-set",
    category: "Festival", categorySlug: "festival", brand: "GiftGenius Festive",
    description: "Premium rakhi set featuring hand-tied silk threads with Swarovski crystal accents. Comes with artisan sweets, kumkum-chawal, and a personalised greeting card.",
    price: 799, basePrice: 1299, discount: 38, rating: 4.6, reviewCount: 1203,
    image: "/products/rakhi.png", images: ["/products/rakhi.png"],
    ar: false, badge: "Festival Pick", stock: 52, sku: "GG-002-RKHI-SET",
    colors: [{ name: "Red & Gold", hex: "#DC2626" }, { name: "Purple & Silver", hex: "#7C3AED" }],
    sizes: ["Standard"],
    tags: ["raksha-bandhan", "festival", "sibling", "traditional"],
    specifications: new Map(Object.entries({ Contents: "2 Rakhis, Sweets Box, Kumkum-Chawal, Card", Material: "Silk Thread, Swarovski Crystal", "Shelf Life": "Sweets: 15 days", Packaging: "Premium Gift Box" })),
    careInstructions: "Consume sweets within 15 days. Store rakhi away from moisture.",
  },
  {
    productId: "gg-003",
    name: "Crystal Aurora Lamp",
    slug: "crystal-aurora-lamp",
    category: "Lighting", categorySlug: "lighting", brand: "Lumière Studio",
    description: "A mesmerising colour-changing crystal lamp inspired by the Northern Lights. 16 RGB modes with touch control and remote. USB-C rechargeable with 12-hour battery life.",
    price: 1899, basePrice: 2599, discount: 27, rating: 4.9, reviewCount: 3421,
    image: "/products/lamp.png", images: ["/products/lamp.png"],
    ar: true, badge: "Best Seller", stock: 18, sku: "GG-003-CRYS-LMP",
    colors: [{ name: "Clear Crystal", hex: "#E0E7FF" }, { name: "Smoky", hex: "#6B7280" }],
    sizes: ["Small (15cm)", "Large (25cm)"],
    tags: ["home-decor", "lighting", "birthday", "diwali"],
    specifications: new Map(Object.entries({ Material: "K9 Crystal Glass", Modes: "16 RGB Colours", Battery: "3000mAh (12 hours)", Charging: "USB-C", Height: "15cm / 25cm" })),
    careInstructions: "Clean with microfiber cloth. Do not submerge in water.",
  },
  {
    productId: "gg-004",
    name: "Personalised Name Mug",
    slug: "personalised-name-mug",
    category: "Personalized", categorySlug: "personalized", brand: "GiftGenius Custom",
    description: "Premium ceramic mug with your custom name or message in elegant calligraphy. Microwave & dishwasher safe. Available in matte black with gold foil or white with copper foil.",
    price: 599, basePrice: 999, discount: 40, rating: 4.5, reviewCount: 5612,
    image: "/products/mug.png", images: ["/products/mug.png"],
    ar: false, badge: "Based on wishlist", stock: 120, sku: "GG-004-PERS-MUG",
    colors: [{ name: "Matte Black", hex: "#1F2937" }, { name: "Pure White", hex: "#FFFFFF" }, { name: "Navy Blue", hex: "#1E3A5F" }],
    sizes: ["330ml", "450ml"],
    tags: ["personalized", "birthday", "corporate", "daily-use"],
    specifications: new Map(Object.entries({ Material: "Premium Ceramic", Capacity: "330ml / 450ml", Finish: "Gold / Copper Foil", Safety: "Microwave & Dishwasher Safe", Personalization: "Up to 30 characters" })),
    careInstructions: "Dishwasher safe. Avoid abrasive scrubbers on printed area.",
  },
  {
    productId: "gg-005",
    name: "Gold Filigree Bracelet",
    slug: "gold-filigree-bracelet",
    category: "Jewellery", categorySlug: "jewellery", brand: "Aurelia Fine Jewels",
    description: "18K gold-plated bracelet featuring traditional Indian filigree work from Cuttack, Odisha. Adjustable clasp fits all wrist sizes. Comes with a BIS hallmark certificate.",
    price: 4999, basePrice: 6999, discount: 29, rating: 4.7, reviewCount: 891,
    image: "/products/bracelet.png", images: ["/products/bracelet.png"],
    ar: true, badge: "Premium Pick", stock: 8, sku: "GG-005-GOLD-BRC",
    colors: [{ name: "Yellow Gold", hex: "#FFD700" }, { name: "Rose Gold", hex: "#B76E79" }, { name: "White Gold", hex: "#E8E8E8" }],
    sizes: ["Adjustable"],
    tags: ["jewellery", "wedding", "anniversary", "diwali", "premium"],
    specifications: new Map(Object.entries({ Material: "18K Gold Plated Brass", Weight: "18g", Closure: "Adjustable Lobster Clasp", Certification: "BIS Hallmark", Origin: "Cuttack, Odisha" })),
    careInstructions: "Store in anti-tarnish pouch. Avoid perfume and water contact.",
  },
  {
    productId: "gg-006",
    name: "Wireless Speaker Pro",
    slug: "wireless-speaker-pro",
    category: "Electronics", categorySlug: "electronics", brand: "SoundCraft",
    description: "360° spatial audio speaker with deep bass and crystal-clear treble. IPX7 waterproof, 24-hour battery, and multi-device pairing. Premium fabric finish.",
    price: 3299, basePrice: 4999, discount: 34, rating: 4.4, reviewCount: 2156,
    image: "/products/speaker.png", images: ["/products/speaker.png"],
    ar: false, badge: "Tech Lover's Choice", stock: 25, sku: "GG-006-SPKR-PRO",
    colors: [{ name: "Charcoal", hex: "#374151" }, { name: "Midnight Blue", hex: "#1E3A5F" }, { name: "Sage Green", hex: "#6B8F71" }],
    sizes: ["Standard"],
    tags: ["electronics", "birthday", "corporate", "tech"],
    specifications: new Map(Object.entries({ Driver: "52mm Full Range", Battery: "6000mAh (24 hours)", Connectivity: "Bluetooth 5.3, AUX, USB-C", Waterproof: "IPX7", Weight: "680g" })),
    careInstructions: "Wipe with damp cloth. Charge fully before first use.",
  },
  {
    productId: "gg-007",
    name: "Kashmiri Pashmina Scarf",
    slug: "kashmiri-pashmina-scarf",
    category: "Fashion", categorySlug: "fashion", brand: "Kashmir Looms",
    description: "Authentic GI-tagged Kashmiri Pashmina hand-woven by master artisans. 100% pure pashmina wool with traditional Sozni embroidery. Each piece takes 3-6 months to complete.",
    price: 3799, basePrice: 5499, discount: 31, rating: 4.8, reviewCount: 672,
    image: "/products/scarf.png", images: ["/products/scarf.png"],
    ar: false, badge: "Handcrafted", stock: 6, sku: "GG-007-PSHM-SCF",
    colors: [{ name: "Ivory", hex: "#FFFFF0" }, { name: "Burgundy", hex: "#800020" }, { name: "Midnight Blue", hex: "#191970" }],
    sizes: ["Standard (200×80cm)"],
    tags: ["fashion", "luxury", "wedding", "anniversary", "handcrafted"],
    specifications: new Map(Object.entries({ Material: "100% Pure Pashmina Wool", Dimensions: "200×80 cm", Embroidery: "Sozni (Hand)", Certification: "GI Tagged", Origin: "Srinagar, Kashmir" })),
    careInstructions: "Dry clean only. Store flat in breathable bag. Avoid direct sunlight.",
  },
  {
    productId: "gg-008",
    name: "Artisan Candle Collection",
    slug: "artisan-candle-collection",
    category: "Wellness", categorySlug: "wellness", brand: "Flicker & Co.",
    description: "Set of 4 hand-poured soy wax candles in premium glass vessels. Scents: Indian Sandalwood, Darjeeling Tea, Bombay Rose, and Himalayan Cedar. 40-hour burn time each.",
    price: 1299, basePrice: 1999, discount: 35, rating: 4.6, reviewCount: 1834,
    image: "/products/candles.png", images: ["/products/candles.png"],
    ar: true, badge: "Gift Set", stock: 30, sku: "GG-008-CNDL-SET",
    colors: [{ name: "Warm Amber", hex: "#D97706" }, { name: "Cool Sage", hex: "#6B8F71" }],
    sizes: ["Set of 4"],
    tags: ["wellness", "diwali", "housewarming", "birthday", "candles"],
    specifications: new Map(Object.entries({ Material: "100% Soy Wax", Scents: "Sandalwood, Tea, Rose, Cedar", "Burn Time": "40 hours each", Weight: "200g each", Vessel: "Reusable Glass" })),
    careInstructions: "Trim wick to 5mm before each use. Burn for max 4 hours at a time.",
  },
];

async function seed() {
  console.log("🌱  GiftGenius DB Seeder");
  console.log(`📡  Connecting to: ${MONGODB_URI!.replace(/:([^@]+)@/, ":****@")}`);

  await mongoose.connect(MONGODB_URI!);
  console.log("✅  Connected to MongoDB");

  let inserted = 0;
  let skipped = 0;

  for (const product of products) {
    try {
      await Product.findOneAndUpdate(
        { productId: product.productId },
        { $setOnInsert: product },
        { upsert: true, new: false }
      );
      const exists = await Product.findOne({ productId: product.productId });
      if (exists?.createdAt?.getTime() === exists?.updatedAt?.getTime()) {
        inserted++;
      } else {
        skipped++;
      }
    } catch {
      // Use updateOne with $set to update existing
      await Product.updateOne(
        { productId: product.productId },
        { $set: product },
        { upsert: true }
      );
      inserted++;
    }
  }

  // Simple upsert approach
  inserted = 0;
  for (const product of products) {
    const result = await Product.updateOne(
      { productId: product.productId },
      { $set: product },
      { upsert: true }
    );
    if (result.upsertedCount > 0) inserted++;
    else skipped++;
  }

  console.log(`\n🎉  Seeding complete!`);
  console.log(`   ✅  ${inserted} products inserted`);
  console.log(`   ⏭️   ${skipped} products already existed (updated)`);
  console.log(`\n📦  Total products in DB: ${await Product.countDocuments()}`);

  await mongoose.disconnect();
  console.log("🔌  Disconnected. Done!");
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
