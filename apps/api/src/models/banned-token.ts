import { Schema, model, Document, Types } from "mongoose";

export interface BannedTokenDocument extends Document {
  _id: Types.ObjectId;
  token: string;
  bannedAt: Date;
}

const BannedTokenSchema = new Schema<BannedTokenDocument>(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    bannedAt: {
      type: Date,
      default: Date.now,
      expires: 0, // rely on TTL index below
    },
  },
  {
    versionKey: false,
  }
);

// TTL index: auto-remove after 7 days (60 * 60 * 24 * 7 = 604 800 s)
BannedTokenSchema.index({ bannedAt: 1 }, { expireAfterSeconds: 604800 });

export const BannedToken = model<BannedTokenDocument>("BannedToken", BannedTokenSchema);