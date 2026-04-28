import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  productId: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  brand: string;
  description: string;
  price: number;
  basePrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  ar: boolean;
  badge: string;
  stock: number;
  sku: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  tags: string[];
  specifications: Map<string, string>;
  careInstructions: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    productId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, required: true },
    categorySlug: { type: String, required: true, index: true },
    brand: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    basePrice: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    image: { type: String, required: true },
    images: [{ type: String }],
    ar: { type: Boolean, default: false },
    badge: { type: String, default: "" },
    stock: { type: Number, required: true, min: 0 },
    sku: { type: String, required: true, unique: true },
    colors: [{ name: String, hex: String }],
    sizes: [{ type: String }],
    tags: [{ type: String, index: true }],
    specifications: { type: Map, of: String },
    careInstructions: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common queries
ProductSchema.index({ price: 1, rating: -1 });
ProductSchema.index({ tags: 1, categorySlug: 1 });
ProductSchema.index({ name: "text", description: "text", tags: "text" });

export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);
