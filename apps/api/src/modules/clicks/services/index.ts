import { ClickCounts } from "@/models/clicks";
import { Links, type PlatformType } from "@/models/links";
import { Profile } from "@/models/profile";
import { User } from "@/models/users";
import { fail, ok, Result } from "@/utils/result";
import { Types } from "mongoose";

export type IncrementClick = {
  // userId: string;
  linkId: string;
  // platform: PlatformType;
  //   country: string;
  //   state: string;
};

export const increaseHomePageClicksService = async (
  username: string,
): Promise<Result<string>> => {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return fail("NOT_FOUND", "User not found");
    }
    const profile = await Profile.findOneAndUpdate(
      { user_id: user._id },
      { $inc: { clicks: 1 } },
      { new: true },
    );
    if (!profile) {
      return fail("NOT_FOUND", "Profile not found");
    }
    return ok(
      `${user.username}'s home page clicks increased to ${profile.clicks}`,
    );
  } catch (error) {
    console.log(error);
    return fail("DB_ERROR", "Failed to increase home page clicks");
  }
};

export const increaseLinkClicksService = async ({
  linkId,
}: IncrementClick): Promise<Result<string>> => {
  try {
    const link = await Links.findOne({ _id: linkId });
    if (!link) {
      return fail("NOT_FOUND", "Link not found");
    }

    const clickCount = await ClickCounts.create({
      user_id: link.user_id,
      link_id: linkId,
      platform: link.platform,
      clicks: 1,
      country: "IN",
      state: "MH",
    });
    if (!clickCount) {
      return fail("NOT_FOUND", "Click count not found");
    }
    return ok(`${link.title}'s link clicks increased to ${clickCount.clicks}`);
  } catch (error) {
    console.log(error);
    return fail("DB_ERROR", "Failed to increase link clicks");
  }
};
