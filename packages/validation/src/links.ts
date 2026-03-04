import { z } from "zod";

export const PLATFORM_ENUM = [
  "instagram",
  "facebook",
  "youtube",
  "spotify",
  "slack",
  "x",
  "snapchat",
  "github",
  "linkedin",
  "discord",
  "telegram",
  "substack",
  "pinterest",
  "twitch",
  "whatsapp",
  "threads",
  "reddit",
  "mail",
  "applemusic",
] as const;

const objectId = z
  .string()
  .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), "Invalid ObjectId");

export const createLinkBodySchema = z.object({
  title: z.string().trim().min(1).max(120),
  link: z.string().url("Invalid URL format"),
  platform: z.enum(PLATFORM_ENUM),
});

export const updateLinkBodySchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  link: z.string().url("Invalid URL format").optional(),
  platform: z.enum(PLATFORM_ENUM).optional(),
});

export const linkResponseSchema = z.object({
  _id: objectId,
  user_id: objectId,
  title: z.string(),
  link: z.string(),
  isBlocked: z.boolean().optional(),
  platform: z.enum(PLATFORM_ENUM),
  created_at: z.date(),
  updated_at: z.date(),
});

export const linkIdParamSchema = z.object({ id: objectId });

export type CreateLinkBody = z.infer<typeof createLinkBodySchema>;
export type UpdateLinkBody = z.infer<typeof updateLinkBodySchema>;
export type LinkResponse = z.infer<typeof linkResponseSchema>;
export type LinkIdParam = z.infer<typeof linkIdParamSchema>;
