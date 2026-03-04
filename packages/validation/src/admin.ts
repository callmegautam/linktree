import { z } from "zod";

export const ROLE_ENUM = ["SUPER_ADMIN", "SUPPORT"] as const;

const objectId = z
  .string()
  .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), "Invalid ObjectId");

export const createAdminBodySchema = z.object({
  name: z.string().trim().min(1).max(50),
  email: z.string().trim().toLowerCase().email("Invalid email format").max(120),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(ROLE_ENUM).optional().default("SUPPORT"),
});

export const updateAdminBodySchema = z.object({
  name: z.string().trim().min(1).max(50).optional(),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email format")
    .max(120)
    .optional(),
  role: z.enum(ROLE_ENUM).optional(),
});

export const adminLoginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

export const adminResponseSchema = z.object({
  id: objectId,
  name: z.string(),
  email: z.string(),
  token: z.string(),
  role: z.enum(ROLE_ENUM),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const adminIdParamSchema = z.object({ id: objectId });

export type CreateAdminBody = z.infer<typeof createAdminBodySchema>;
export type UpdateAdminBody = z.infer<typeof updateAdminBodySchema>;
export type AdminLogin = z.infer<typeof adminLoginSchema>;
export type AdminResponse = z.infer<typeof adminResponseSchema>;
export type AdminIdParam = z.infer<typeof adminIdParamSchema>;