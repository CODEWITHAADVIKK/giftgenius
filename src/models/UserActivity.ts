import mongoose, { Schema, Document } from "mongoose";

export type ActivityType =
  | "view"
  | "click"
  | "add_to_cart"
  | "purchase"
  | "search"
  | "wishlist"
  | "review";

export interface IUserActivity extends Document {
  userId: string;
  sessionId: string;
  activityType: ActivityType;
  productId?: string;
  category?: string;
  searchQuery?: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

const UserActivitySchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
    },
    activityType: {
      type: String,
      enum: ["view", "click", "add_to_cart", "purchase", "search", "wishlist", "review"],
      required: true,
      index: true,
    },
    productId: {
      type: String,
      index: true,
    },
    category: {
      type: String,
    },
    searchQuery: {
      type: String,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

// TTL index: auto-delete activity logs older than 90 days
UserActivitySchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });
// Compound index for recommendation queries
UserActivitySchema.index({ userId: 1, activityType: 1, timestamp: -1 });
UserActivitySchema.index({ productId: 1, activityType: 1 });

export default mongoose.models.UserActivity ||
  mongoose.model<IUserActivity>("UserActivity", UserActivitySchema);
