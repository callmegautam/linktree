import { z } from "zod";

const objectId = z
  .string()
  .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), "Invalid ObjectId");

export const USERNAME_REGEX = /^[a-z0-9_.]+$/;
export const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export const registerBodySchema = z.object({
  name: z.string().trim().min(1).max(50),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3)
    .max(30)
    .regex(
      USERNAME_REGEX,
      "Username can only contain lowercase letters, numbers, underscores and dots",
    ),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(120)
    .regex(EMAIL_REGEX, "Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export const loginBodySchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const updateUserBodySchema = z.object({
  name: z.string().trim().min(1).max(50).optional(),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3)
    .max(30)
    .regex(
      USERNAME_REGEX,
      "Username can only contain lowercase letters, numbers, underscores and dots",
    )
    .optional(),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(120)
    .regex(EMAIL_REGEX, "Invalid email format")
    .optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export const changeUsernameSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3)
    .max(30)
    .regex(
      USERNAME_REGEX,
      "Username can only contain lowercase letters, numbers, underscores and dots",
    ),
});

export const userResponseSchema = z.object({
  id: objectId,
  name: z.string(),
  username: z.string(),
  email: z.string(),
  token: z.string(),
  isActive: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  isBlocked: z.boolean().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const userIdParamSchema = z.object({ id: objectId });

export type RegisterBody = z.infer<typeof registerBodySchema>;
export type LoginBody = z.infer<typeof loginBodySchema>;
export type UpdateUserBody = z.infer<typeof updateUserBodySchema>;
export type ChangePasswordBody = z.infer<typeof changePasswordSchema>;
export type ChangeUsernameBody = z.infer<typeof changeUsernameSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type UserIdParam = z.infer<typeof userIdParamSchema>;
