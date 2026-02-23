import { Types, Document, Schema, model } from "mongoose";

export interface ProfileDocument extends Document {
  user_id: Types.ObjectId;
  display_name: string;
  bio?: string;
  avatar_url?: string;
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
    avatar_url: {
      type: String,
      trim: true,
      validate: {
        validator: (v: string) => /^https?:\/\/.+/.test(v),
        message: "Invalid avatar URL",
      },
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export const Profile = model<ProfileDocument>("Profile", ProfileSchema);