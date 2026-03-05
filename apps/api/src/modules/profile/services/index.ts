import { Profile } from "@/models/profile";
import { User } from "@/models/users";
import { createThemeService } from "@/modules/theme/services";
import { generateToken } from "@/utils";
import { fail, ok, Result } from "@/utils/result";
import {
  ChangeUsernameBody,
  CreateProfileBody,
  ProfileResponse,
  UpdateProfileBody,
  UserResponse,
} from "@linktree/validation";

export const getProfileService = async (
  userId: string,
): Promise<Result<ProfileResponse>> => {
  try {
    const profile = await Profile.findOne({ user_id: userId });

    if (!profile) {
      console.log("profile", profile);
      return fail("NOT_FOUND", "User not found");
    }

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return fail("NOT_FOUND", "User not found");
    }

    const response: ProfileResponse = {
      user_id: profile.user_id.toString(),
      display_name: profile.display_name,
      bio: profile.bio || null,
      username: user.username || null,
      avatar_url: profile.avatar_url || null,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
      clicks: 0, //todo gautam
    };

    return ok(response);
  } catch (error) {
    console.log(error);
    return fail("DB_ERROR", "Failed to get user profile");
  }
};

export const createProfileService = async (
  data: CreateProfileBody,
): Promise<Result<ProfileResponse>> => {
  try {
    const { user_id, display_name, bio, avatar_url } = data;

    const profile = await Profile.create({
      user_id,
      display_name,
      bio,
      avatar_url,
    });

    // console.log('Profile created: ', profile);

    const user = await User.findOne({ _id: user_id });
    if (!user) {
      return fail("NOT_FOUND", "User not found");
    }

    const response: ProfileResponse = {
      user_id: profile.user_id.toString(),
      display_name: profile.display_name,
      bio: profile.bio || null,
      username: user.username || null,
      avatar_url: profile.avatar_url || null,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
      clicks: 0, //todo gautam
    };

    await createThemeService(user_id, {
      background: {
        type: "gradient",
        value: " linear-gradient(180deg, #5cabff, #042e71)",
      },

      button: {
        variant: "solid",
        radius: "rounded",
        color: "#6366f1", // Indigo-500 vibe
        textColor: "#ffffff",
      },

      text: {
        font: "font-sans",
        pageColor: "#e2e8f0", // Soft slate-200
        titleColor: "#ffffff",
      },
    });

    return ok(response);
  } catch (error) {
    console.log(error);
    return fail("DB_ERROR", "Failed to create user profile");
  }
};

export const updateProfileService = async (
  userId: string,
  data: UpdateProfileBody,
): Promise<Result<ProfileResponse>> => {
  try {
    const isUsernameExists = await User.findOne({
      username: data.username,
    }).lean();

    if (isUsernameExists && isUsernameExists._id.toString() !== userId) {
      return fail("ALREADY_EXISTS", "Username already exists");
    }

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { username: data.username },
      { new: true },
    );

    if (!user) {
      return fail("NOT_FOUND", "User not found");
    }

    const profile = await Profile.findOneAndUpdate({ user_id: userId }, data, {
      new: true,
    });

    if (!profile) {
      return fail("NOT_FOUND", "Profile not found");
    }

    const response: ProfileResponse = {
      user_id: profile.user_id.toString(),
      display_name: profile.display_name,
      bio: profile.bio || null,
      username: user.username || null,
      avatar_url: profile.avatar_url || null,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
      clicks: 0, //todo gautam
    };

    return ok(response);
  } catch (error) {
    console.log(error);
    return fail("DB_ERROR", "Failed to update user profile");
  }
};

export const changeUsernameService = async (
  userId: string,
  data: ChangeUsernameBody,
): Promise<Result<UserResponse>> => {
  try {
    const isUsernameExists = await User.findOne({
      username: data.username,
    }).lean();

    if (isUsernameExists && isUsernameExists._id.toString() !== userId) {
      return fail("ALREADY_EXISTS", "Username already exists");
    }

    console.log("User details", userId, "--", data);

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { username: data.username },
      { new: true },
    );

    if (!user) {
      console.log("User not found");
      return fail("NOT_FOUND", "User not found");
    }

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
    });

    const response: UserResponse = {
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
      token,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return ok(response);
  } catch (error) {
    console.log(error);
    return fail("DB_ERROR", "Failed to change username");
  }
};

// export const uploadAvatarService = async (userId: string, filePath: any) => {
//   try {

//   } catch (error) {

//   }
// }
