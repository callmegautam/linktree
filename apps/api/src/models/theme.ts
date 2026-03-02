import { Types, Document, Schema, model } from "mongoose";

export type BackgroundType = "image" | "gradient" | "solid";
export type ButtonVariant = "solid" | "outline";
export type ButtonRadius = "square" | "rounded";

export interface ThemeDocument extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;

  background: {
    type: BackgroundType;
    value: string;
  };

  button: {
    variant: ButtonVariant;
    radius: ButtonRadius;
    color: string;        // background or border color
    textColor: string;
  };

  text: {
    font: string;         // e.g. "Inter", "Poppins"
    pageColor: string;    // normal text color
    titleColor: string;   // headings color
  };

  created_at: Date;
  updated_at: Date;
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

    background: {
      type: {
        type: String,
        enum: ["image", "gradient", "solid"],
        required: true,
      },
      value: {
        type: String,
        required: true,
      },
    },

    button: {
      variant: {
        type: String,
        enum: ["solid", "outline"],
        default: "solid",
      },
      radius: {
        type: String,
        enum: ["square", "rounded"],
        default: "rounded",
      },
      color: {
        type: String,
        required: true,
      },
      textColor: {
        type: String,
        required: true,
      },
    },

    text: {
      font: {
        type: String,
        default: "Inter",
      },
      pageColor: {
        type: String,
        required: true,
      },
      titleColor: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

export const ThemeModel = model<ThemeDocument>("Theme", ThemeSchema);