import { z } from "zod";
import { userResponseSchema } from "./user";
import { profileResponseSchema } from "./profile";
import { themeResponseSchema } from "./theme";
import { linkResponseSchema } from "./links";

export const usernameIdParamSchema = z.object({
  username: z.string().trim().min(1).max(50),
});

export const homePageResponseSchema = z.object({
  user: userResponseSchema,
  profile: profileResponseSchema,
  theme: themeResponseSchema,
  links: linkResponseSchema.array(),
});

export type UsernameIdParam = z.infer<typeof usernameIdParamSchema>;
export type HomePageResponse = z.infer<typeof homePageResponseSchema>;
