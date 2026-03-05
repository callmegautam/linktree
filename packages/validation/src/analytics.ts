import { z } from "zod";
import { PLATFORM_ENUM } from "./links";

export const analyticsSchema = z.object({
  totalUsers: z.number(),
  totalLinks: z.number(),
  totalClicks: z.number(),
  activeUsers: z.number(),
});

export const topPerformingLinksSchema = z.object({
  link: z.object({
    title: z.string(),
    link: z.string(),
    platform: z.enum(PLATFORM_ENUM),
  }),
  clicks: z.number(),
  date: z.date(),
});

export const recentActivitySchema = z.object({
  user: z.string(),
  link: z.object({
    title: z.string(),
    link: z.string(),
    platform: z.enum(PLATFORM_ENUM),
  }),
  clicks: z.number(),
  date: z.date(),
});

export const analyticsResponseSchema = z.object({
  analytics: analyticsSchema,
  recentActivity: z.array(recentActivitySchema),
  topPerformingLinks: z.array(topPerformingLinksSchema),
});

export type AnalyticsResponse = z.infer<typeof analyticsResponseSchema>;

export type Analytics = z.infer<typeof analyticsSchema>;
export type RecentActivity = z.infer<typeof recentActivitySchema>;
export type TopPerformingLinks = z.infer<typeof topPerformingLinksSchema>;
