import { Types, Document, Schema, model } from "mongoose";

export type PlatformType = "instagram" | "x" | "linkedin" | "self";

export interface ClickCountsDocument extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  link_id: Types.ObjectId;
  platform: PlatformType;
  clicks: number;
  country: string;
  state: string;
  created_at: Date;
  updated_at: Date;
}

const ClickCountSchema = new Schema<ClickCountsDocument>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    link_id: { type: Schema.Types.ObjectId, ref: "Link", required: true, index: true },
    platform: { type: String, enum: ["instagram", "x", "linkedin", "self"], required: true },
    clicks: { type: Number, default: 0, min: 0 },
    country: { type: String, required: true },
    state: { type: String, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// Compound index for fast lookups by link + platform + location
ClickCountSchema.index({ link_id: 1, platform: 1, country: 1, state: 1 }, { unique: true });

export const ClickCounts = model<ClickCountsDocument>("ClickCounts", ClickCountSchema);