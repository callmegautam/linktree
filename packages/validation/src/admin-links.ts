export type LinkStatus = "block" | "unblock";

import { z } from "zod";
export const adminLinksResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  link: z.string(),
  owner: z.string(),
  clicks: z.number(),
  isBlocked: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type AdminLinksResponse = z.infer<typeof adminLinksResponseSchema>;
