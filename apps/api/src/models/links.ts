import { PLATFORM_ENUM } from "@linktree/validation";
import { Types, Document, Schema, model } from "mongoose";

export type PlatformType =
  | "instagram"
  | "facebook"
  | "youtube"
  | "spotify"
  | "slack"
  | "x"
  | "snapchat"
  | "github"
  | "linkedin"
  | "discord"
  | "telegram"
  | "substack"
  | "pinterest"
  | "twitch"
  | "whatsapp"
  | "threads"
  | "reddit"
  | "mail"
  | "applemusic";

export interface LinksDocument extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  title: string;
  link: string;
  platform: PlatformType;
  isBlocked: boolean;
  created_at: Date;
  updated_at: Date;
}

const LinksSchema = new Schema<LinksDocument>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 120,
      required: true,
    },
    link: {
      type: String,
      trim: true,
      required: true,
      validate: {
        validator: (v: string) => /^https?:\/\/.+\..+/.test(v),
        message: "Invalid URL format",
      },
    },
    platform: {
      type: String,
      required: true,
      enum: PLATFORM_ENUM,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

// 1. No duplicate titles per user+platform
LinksSchema.index({ user_id: 1, platform: 1, title: 1 }, { unique: true });

// 2. No duplicate links per user+platform
LinksSchema.index({ user_id: 1, platform: 1, link: 1 }, { unique: true });

export const Links = model<LinksDocument>("Link", LinksSchema);
