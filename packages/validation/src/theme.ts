import { z } from "zod";

/* ------------------ ENUMS ------------------ */

export const BACKGROUND_TYPE_ENUM = ["image", "gradient", "solid"] as const;
export const BUTTON_VARIANT_ENUM = ["solid", "outline"] as const;
export const BUTTON_RADIUS_ENUM = ["square", "rounded"] as const;

/* ------------------ HELPERS ------------------ */

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

const hexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "Must be 6-digit hex color (#ffffff)");

const imageUrl = z
  .string()
  .regex(/^https?:\/\/.+/, "Invalid image URL");

const cssGradient = z
  .string()
  .regex(/^linear-gradient\(.+\)$/, "Must be valid CSS linear-gradient");

/* ------------------ BACKGROUND ------------------ */

export const backgroundSchema = z.object({
  type: z.enum(BACKGROUND_TYPE_ENUM),
  value: z.string(),
}).superRefine((data, ctx) => {
  if (data.type === "image" && !/^https?:\/\/.+/.test(data.value)) {
    ctx.addIssue({
      code: "custom",
      message: "Invalid image URL",
      path: ["value"],
    });
  }

  if (data.type === "gradient" && !/^linear-gradient\(.+\)$/.test(data.value)) {
    ctx.addIssue({
      code: "custom",
      message: "Must be valid CSS linear-gradient",
      path: ["value"],
    });
  }

  if (data.type === "solid" && !/^#[0-9a-fA-F]{6}$/.test(data.value)) {
    ctx.addIssue({
      code: "custom",
      message: "Solid color must be 6-digit hex (#ffffff)",
      path: ["value"],
    });
  }
});

/* ------------------ BUTTON ------------------ */

export const buttonSchema = z.object({
  variant: z.enum(BUTTON_VARIANT_ENUM),
  radius: z.enum(BUTTON_RADIUS_ENUM),
  color: hexColor,
  textColor: hexColor,
});

/* ------------------ TEXT ------------------ */

export const textSchema = z.object({
  font: z.string().min(1),
  pageColor: hexColor,
  titleColor: hexColor,
});

/* ------------------ INPUT SCHEMAS ------------------ */

export const createThemeBodySchema = z.object({
  background: backgroundSchema,
  button: buttonSchema,
  text: textSchema,
});

export const updateThemeBodySchema = z.object({
  background: backgroundSchema.optional(),
  button: buttonSchema.partial().optional(),
  text: textSchema.partial().optional(),
});

/* ------------------ RESPONSE ------------------ */

export const themeResponseSchema = z.object({
  _id: objectId,
  user_id: objectId,
  background: backgroundSchema,
  button: buttonSchema,
  text: textSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

/* ------------------ ROUTE PARAMS ------------------ */

export const themeUserIdParamSchema = z.object({
  userId: objectId,
});

/* ------------------ TYPES ------------------ */

export type CreateThemeBody = z.infer<typeof createThemeBodySchema>;
export type UpdateThemeBody = z.infer<typeof updateThemeBodySchema>;
export type ThemeResponse = z.infer<typeof themeResponseSchema>;
export type ThemeUserIdParam = z.infer<typeof themeUserIdParamSchema>;