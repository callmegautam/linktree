import z from "zod";

export const userRoleSchema = z.enum(["user", "admin"]);
export type UserRole = z.infer<typeof userRoleSchema>;

export const userSchema = z.object({
  name: z.string().min(3).max(20),
  username: z.string().min(3).max(20),
  email: z.string().email(),
  role: userRoleSchema,
  password: z.string().min(6).max(20),
});
export type User = z.infer<typeof userSchema>;

export const createUserSchema = userSchema
export type CreateUser = z.infer<typeof createUserSchema>;


export const loginUserSchema = userSchema.pick({
  email: true,
  password: true,
});
export type LoginUser = z.infer<typeof loginUserSchema>;


export const updateProfileSchema = userSchema.partial();
export type UpdateProfile = z.infer<typeof updateProfileSchema>;
