import { Schema, model, Types, Document } from "mongoose";

export interface UserDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 50,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
      match: /^[a-z0-9_.]+$/,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 120,
      match: /^\S+@\S+\.\S+$/,
      required: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    deletedAt: {
      type: Date,
      default: null,
      select: false,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound index for soft-delete aware unique constraints
UserSchema.index(
  { username: 1, deletedAt: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } }
);
UserSchema.index(
  { email: 1, deletedAt: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } }
);

export const User = model<UserDocument>("User", UserSchema);