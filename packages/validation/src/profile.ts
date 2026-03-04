import { z } from "zod";

const objectId = z
  .string()
  .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), "Invalid ObjectId");

export const createProfileBodySchema = z.object({
  user_id: objectId,
  display_name: z.string().trim().min(1).max(50),
  bio: z.string().trim().max(160).optional(),
  avatar_url: z
    .string()
    // .url("Invalid avatar URL")
    // .regex(/^https?:\/\/.+/, "Must be HTTP(S) URL")
    .optional(),
});

export const updateProfileBodySchema = z.object({
  display_name: z.string().trim().min(1).max(50).optional(),
  bio: z.string().trim().max(160).optional(),
  avatar_url: z
    .string()
    // .url("Invalid avatar URL")
    // .regex(/^https?:\/\/.+/, "Must be HTTP(S) URL")
    .optional(),
  username: z.string().trim().min(1).max(50).optional(),
});

export const profileResponseSchema = z.object({
  user_id: objectId,
  display_name: z.string(),
  bio: z.string().nullable(),
  username: z.string().nullable(),
  avatar_url: z.string().nullable(),
  clicks: z.number(),
  isActive: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  isBlocked: z.boolean().optional(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const profileUserIdParamSchema = z.object({ userId: objectId });

export type CreateProfileBody = z.infer<typeof createProfileBodySchema>;
export type UpdateProfileBody = z.infer<typeof updateProfileBodySchema>;
export type ProfileResponse = z.infer<typeof profileResponseSchema>;
export type ProfileUserIdParam = z.infer<typeof profileUserIdParamSchema>;
