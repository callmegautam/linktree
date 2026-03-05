import { fail, ok, Result } from "@/utils";
import { User } from "@/models/users";
import { Profile } from "@/models/profile";
import { ThemeModel } from "@/models/theme";
import { Links } from "@/models/links";

export const getHomePageService = async (
  username: string,
): Promise<Result<any>> => {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return fail("NOT_FOUND", "User not found");
    }
    const profile = await Profile.findOne({ user_id: user._id });
    if (!profile) {
      return fail("NOT_FOUND", "Profile not found");
    }
    const theme = await ThemeModel.findOne({ user_id: user._id });
    if (!theme) {
      return fail("NOT_FOUND", "Theme not found");
    }
    const links = await Links.find({ user_id: user._id });
    if (!links) {
      return fail("NOT_FOUND", "Links not found");
    }

    return ok({
      user,
      profile,
      theme,
      links,
    });
  } catch (error) {
    console.log(error);
    return fail("DB_ERROR", "Failed to get home page");
  }
};
