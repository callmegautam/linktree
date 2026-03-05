import { PLATFORM_ENUM } from "./links";
import { z } from "zod";

const objectId = z
  .string()
  .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), "Invalid ObjectId");

export const createClickCountSchema = z.object({
  // user_id: objectId,
  link_id: objectId,
  // platform: z.enum(PLATFORM_ENUM),
  // country: z.string().min(1).max(2), // ISO-3166-1 alpha-2
  // state: z.string().min(1).max(50),
});

export const incrementClickSchema = z.object({
  link_id: objectId,
  // platform: z.enum(PLATFORM_ENUM),
  // country: z.string().min(1).max(2),
  // state: z.string().min(1).max(50),
});

export const clickCountsResponseSchema = z.object({
  _id: objectId,
  user_id: objectId,
  link_id: objectId,
  platform: z.enum(PLATFORM_ENUM),
  clicks: z.number().int().nonnegative(),
  country: z.string().optional(),
  state: z.string().optional(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const clickCountsQuerySchema = z.object({
  link_id: objectId.optional(),
  user_id: objectId.optional(),
  platform: z.enum(PLATFORM_ENUM).optional(),
  country: z.string().optional(),
  state: z.string().optional(),
});

export type CreateClickCount = z.infer<typeof createClickCountSchema>;
export type IncrementClick = z.infer<typeof incrementClickSchema>;
export type ClickCountsResponse = z.infer<typeof clickCountsResponseSchema>;
export type ClickCountsQuery = z.infer<typeof clickCountsQuerySchema>;
