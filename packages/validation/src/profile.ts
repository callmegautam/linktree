// profile.zod.ts
import { z } from "zod";

// --- base helpers ---
const objectId = z
  .string()
  .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), "Invalid ObjectId");

// --- input schemas ---
export const createProfileBodySchema = z.object({
  user_id: objectId,
  display_name: z.string().trim().min(1).max(50),
  bio: z.string().trim().max(160).optional(),
  avatar_url: z
    .string()
    .url("Invalid avatar URL")
    .regex(/^https?:\/\/.+/, "Must be HTTP(S) URL")
    .optional(),
});

export const updateProfileBodySchema = z.object({
  display_name: z.string().trim().min(1).max(50).optional(),
  bio: z.string().trim().max(160).optional(),
  avatar_url: z
    .string()
    .url("Invalid avatar URL")
    .regex(/^https?:\/\/.+/, "Must be HTTP(S) URL")
    .optional(),
});

// --- output/response schemas ---
export const profileResponseSchema = z.object({
  user_id: objectId,
  display_name: z.string(),
  bio: z.string().nullable(),
  avatar_url: z.string().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});

// --- route params ---
export const profileUserIdParamSchema = z.object({ userId: objectId });

// --- inferred types ---
export type CreateProfileBody = z.infer<typeof createProfileBodySchema>;
export type UpdateProfileBody = z.infer<typeof updateProfileBodySchema>;
export type ProfileResponse = z.infer<typeof profileResponseSchema>;
export type ProfileUserIdParam = z.infer<typeof profileUserIdParamSchema>;