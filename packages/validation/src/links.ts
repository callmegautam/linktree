// links.zod.ts
import { z } from "zod";

// --- shared enums/constants ---
export const PLATFORM_ENUM = ["instagram", "x", "linkedin"] as const;

// --- base helpers ---
const objectId = z
  .string()
  .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), "Invalid ObjectId");

// --- input schemas ---
export const createLinkBodySchema = z.object({
  title: z.string().trim().min(1).max(120),
  link: z.string().url("Invalid URL format"),
  platform: z.enum(PLATFORM_ENUM),
});

export const updateLinkBodySchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  link: z.string().url("Invalid URL format").optional(),
});

// --- output/response schemas ---
export const linkResponseSchema = z.object({
  _id: objectId,
  user_id: objectId,
  title: z.string(),
  link: z.string(),
  platform: z.enum(PLATFORM_ENUM),
  created_at: z.date(),
  updated_at: z.date(),
});

// --- route params ---
export const linkIdParamSchema = z.object({ id: objectId });

// --- inferred types ---
export type CreateLinkBody = z.infer<typeof createLinkBodySchema>;
export type UpdateLinkBody = z.infer<typeof updateLinkBodySchema>;
export type LinkResponse = z.infer<typeof linkResponseSchema>;
export type LinkIdParam = z.infer<typeof linkIdParamSchema>;