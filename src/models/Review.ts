import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  productId: string;
  rating: number;
  title: string;
  comment: string;
  userName: string;
  verified: boolean;
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: String,
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    userName: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    helpful: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate reviews per user per product
ReviewSchema.index({ user: 1, productId: 1 }, { unique: true });
ReviewSchema.index({ productId: 1, rating: -1 });
ReviewSchema.index({ createdAt: -1 });

export default mongoose.models.Review ||
  mongoose.model<IReview>("Review", ReviewSchema);
