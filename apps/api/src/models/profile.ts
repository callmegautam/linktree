import { Types, Document, Schema, model } from "mongoose";

export interface ProfileDocument extends Document {
  user_id: Types.ObjectId;
  display_name: string;
  bio?: string;
  avatar_url?: string;
  clicks: number;
  isActive: boolean;
  isDeleted: boolean;
  isBlocked: boolean;
  created_at: Date;
  updated_at: Date;
}

const ProfileSchema = new Schema<ProfileDocument>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    display_name: {
      type: String,
      trim: true,
      minlength: 1,
      maxlength: 50,
      required: true,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 160,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    avatar_url: {
      type: String,
      trim: true,
      // validate: {
      //   validator: (v: string) => /^https?:\/\/.+/.test(v),
      //   message: "Invalid avatar URL",
      // },
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

export const Profile = model<ProfileDocument>("Profile", ProfileSchema);
