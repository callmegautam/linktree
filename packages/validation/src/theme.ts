// theme.zod.ts
import { z } from "zod";

// --- shared enums/constants ---
export const BACKGROUND_TYPE_ENUM = ["image", "gradient", "solid"] as const;

// --- base helpers ---
const objectId = z
  .string()
  .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), "Invalid ObjectId");

// --- input schemas ---
export const createThemeBodySchema = z.object({
  user_id: objectId,
  type: z.enum(BACKGROUND_TYPE_ENUM),
  value: z.string().superRefine((val, ctx) => {
    const type = (ctx as any).parent.type;
    if (type === "image" && !/^https?:\/\/.+/.test(val))
      ctx.addIssue({ code: "custom", message: "Invalid image URL" });
    if (type === "gradient" && !val.startsWith("bg-gradient"))
      ctx.addIssue({ code: "custom", message: "Gradient must start with 'bg-gradient'" });
    if (type === "solid" && !/^#[0-9a-fA-F]{6}$/.test(val))
      ctx.addIssue({ code: "custom", message: "Solid color must be 6-digit hex (#ffffff)" });
  }),
});

export const updateThemeBodySchema = z.object({
  type: z.enum(BACKGROUND_TYPE_ENUM).optional(),
  value: z.string().superRefine((val, ctx) => {
    const type = (ctx as any).parent.type;
    if (type === "image" && !/^https?:\/\/.+/.test(val))
      ctx.addIssue({ code: "custom", message: "Invalid image URL" });
    if (type === "gradient" && !val.startsWith("bg-gradient"))
      ctx.addIssue({ code: "custom", message: "Gradient must start with 'bg-gradient'" });
    if (type === "solid" && !/^#[0-9a-fA-F]{6}$/.test(val))
      ctx.addIssue({ code: "custom", message: "Solid color must be 6-digit hex (#ffffff)" });
  }).optional(),
});

// --- output/response schemas ---
export const themeResponseSchema = z.object({
  _id: objectId,
  user_id: objectId,
  type: z.enum(BACKGROUND_TYPE_ENUM),
  value: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// --- route params ---
export const themeUserIdParamSchema = z.object({ userId: objectId });

// --- inferred types ---
export type CreateThemeBody = z.infer<typeof createThemeBodySchema>;
export type UpdateThemeBody = z.infer<typeof updateThemeBodySchema>;
export type ThemeResponse = z.infer<typeof themeResponseSchema>;
export type ThemeUserIdParam = z.infer<typeof themeUserIdParamSchema>;