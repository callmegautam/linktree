import { Types, Document, Schema, model } from "mongoose";

export type BackgroundType = "image" | "gradient" | "solid";

export interface ThemeDocument extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  type: BackgroundType;
  value: string;
}

const ThemeSchema = new Schema<ThemeDocument>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["image", "gradient", "solid"],
      required: true,
    },
    value: {
      type: String,
      required: true,
      // validate: {
      //   validator(v: string) {
      //     if (this.type === "image") return /^https?:\/\/.+/.test(v);
      //     if (this.type === "gradient") return v.startsWith("bg-gradient");
      //     if (this.type === "solid") return /^#[0-9a-fA-F]{6}$/.test(v);
      //     return false;
      //   },
      //   message: "Value does not match the selected background type",
      // },
    },
  },
  { _id: false, timestamps: true }
);

export const ThemeModel = model<ThemeDocument>("Theme", ThemeSchema);