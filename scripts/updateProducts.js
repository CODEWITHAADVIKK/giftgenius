/**
 * GiftGenius — FakeStore API Import Script
 *
 * This script connects to MongoDB, fetches products from FakeStore API,
 * transforms them to match the GiftGenius schema, and updates the database.
 *
 * Usage:
 *   node scripts/updateProducts.js [mode]
 *
 * Modes:
 *   update  - (Default) Upserts existing products without deleting old ones
 *   replace - Deletes all existing products before importing new ones
 */

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// ── 1. Read .env.local manually to get MONGODB_URI ──
function loadEnvLocal() {
  const envPath = path.resolve(__dirname, "../.env.local");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}
loadEnvLocal();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not set in .env.local");
  process.exit(1);
}

// ── 2. GiftGenius Product Schema ──
const ProductSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    categorySlug: { type: String, required: true },
    brand: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    basePrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    image: { type: String, required: true },
    images: [String],
    ar: { type: Boolean, default: false },
    badge: { type: String, default: "" },
    stock: { type: Number, required: true },
    sku: { type: String, required: true, unique: true },
    colors: [{ name: String, hex: String }],
    sizes: [String],
    tags: [String],
    specifications: { type: Map, of: String },
    careInstructions: { type: String, default: "" },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

// ── Helper to convert a string to a URL-friendly slug ──
function generateSlug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

// ── 3. Main Import Function ──
async function importFakeStoreProducts() {
  const mode = process.argv[2] === "replace" ? "REPLACE" : "UPDATE";

  console.log(`\n🚀 Starting FakeStore API Import — Mode: ${mode}`);
  console.log(`📡 Connecting to MongoDB...`);

  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, { bufferCommands: false });
    console.log("✅ Connected to MongoDB Atlas\n");

    // Fetch from FakeStore
    console.log("📥 Fetching products from https://fakestoreapi.com/products...");
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    
    const fakeProducts = await response.json();
    console.log(`📦 Fetched ${fakeProducts.length} products.\n`);

    // Handle REPLACE mode
    if (mode === "REPLACE") {
      console.log("⚠️  REPLACE MODE: Deleting all existing products...");
      const deleteResult = await Product.deleteMany({});
      console.log(`🗑️  Deleted ${deleteResult.deletedCount} products.\n`);
    }

    let inserted = 0;
    let updated = 0;
    let failed = 0;

    // Process & Transform each product
    for (const item of fakeProducts) {
      try {
        // Transform FakeStore data to match GiftGenius Schema
        // FakeStore price is usually in USD (e.g. 109.95). Multiply by 83 to roughly simulate INR.
        const priceInINR = Math.round(item.price * 83);
        const discountPercentage = Math.floor(Math.random() * 30) + 10; // 10% to 40% discount
        const basePrice = Math.round(priceInINR / (1 - discountPercentage / 100));

        const transformedProduct = {
          productId: `fs-${item.id}`,
          name: item.title,
          slug: generateSlug(item.title),
          category: item.category,
          categorySlug: generateSlug(item.category),
          brand: "FakeStore Imports", // External API doesn't provide brand
          description: item.description,
          price: priceInINR,
          basePrice: basePrice,
          discount: discountPercentage,
          rating: item.rating?.rate || (Math.random() * 2 + 3).toFixed(1), // Random fallback
          reviewCount: item.rating?.count || Math.floor(Math.random() * 500),
          image: item.image,
          images: [item.image],
          ar: false,
          badge: item.rating?.rate > 4.5 ? "Top Rated" : "",
          stock: Math.floor(Math.random() * 50) + 10, // Random stock 10-60
          sku: `FS-IMPT-${item.id}-${Date.now().toString().slice(-4)}`,
          tags: [item.category, "imported", "fakestore"],
          specifications: new Map([
            ["Source", "FakeStore API"],
            ["Original Price USD", `$${item.price}`]
          ]),
          careInstructions: "Standard care instructions apply."
        };

        // Update if exists (by productId), Insert if not
        const result = await Product.updateOne(
          { productId: transformedProduct.productId },
          { $set: transformedProduct },
          { upsert: true }
        );

        if (result.upsertedCount > 0) {
          console.log(`  ✅ Inserted: ${transformedProduct.name.slice(0, 40)}...`);
          inserted++;
        } else if (result.modifiedCount > 0) {
          console.log(`  🔄 Updated:  ${transformedProduct.name.slice(0, 40)}...`);
          updated++;
        } else {
          // It matched but no fields were changed
          console.log(`  ⏭️  Skipped (No changes): ${transformedProduct.name.slice(0, 35)}...`);
        }

      } catch (err) {
        console.error(`  ❌ Failed to process product ID ${item.id}:`, err.message);
        failed++;
      }
    }

    const totalInDb = await Product.countDocuments();

    console.log(`\n🎉 Import Complete!`);
    console.log(`   ✅ Inserted:  ${inserted}`);
    console.log(`   🔄 Updated:   ${updated}`);
    console.log(`   ❌ Failed:    ${failed}`);
    console.log(`\n📊 Total Products in Database: ${totalInDb}`);

  } catch (error) {
    console.error("\n❌ Fatal Error:", error.message);
  } finally {
    // Always disconnect
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB.");
    process.exit(0);
  }
}

importFakeStoreProducts();
