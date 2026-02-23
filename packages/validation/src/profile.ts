// profile.schema.ts
import { z } from "zod";

const hexColorRegex = /^#([0-9A-F]{3}){1,2}$/i;

const BackgroundSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("image"),
    value: z.string().url("Invalid image URL"),
  }),

  z.object({
    type: z.literal("gradient"),
    value: z
      .string()
      .min(1, "Gradient class required")
      .refine(
        (val) => val.startsWith("bg-"),
        "Gradient must be valid Tailwind background class"
      ),
  }),

  z.object({
    type: z.literal("solid"),
    value: z
      .string()
      .regex(hexColorRegex, "Must be valid hex color"),
  }),
]);

export const CreateProfileSchema = z.object({
  display_name: z
    .string()
    .min(1, "Display name required")
    .max(100),

  bio: z
    .string()
    .max(500)
    .optional(),

  avatar_url: z
    .string()
    .url("Invalid avatar URL")
    .optional(),

  background: BackgroundSchema,

  social_links: z
    .record(
      z.string().min(1, "Platform name required"),
      z.string().url("Invalid social link URL")
    )
    .default({}),
});

export type Profile = z.infer<typeof CreateProfileSchema>;