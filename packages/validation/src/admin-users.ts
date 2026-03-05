import { z } from "zod";

export const adminUsersResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  username: z.string(),
  clicks: z.number(),
  isActive: z.boolean(),
  isDeleted: z.boolean(),
  isBlocked: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type AdminUsersResponse = z.infer<typeof adminUsersResponseSchema>;
