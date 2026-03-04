import { PlatformType } from "@/models/links";
import { Profile } from "@/models/profile";
import { User } from "@/models/users";
import { fail, Result, ok } from "@/utils";

export type AdminUsersResponse = {
  id: string;
  name: string;
  email: string;
  username: string;
  clicks: number;
  isActive: boolean;
  isDeleted: boolean;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type UserStatus = "block" | "unblock";

export const getAdminUsersService = async (): Promise<
  Result<AdminUsersResponse[]>
> => {
  try {
    const adminUsers: AdminUsersResponse[] = await User.aggregate([
      {
        $lookup: {
          from: "profiles",
          localField: "_id",
          foreignField: "user_id",
          as: "profile",
        },
      },

      {
        $unwind: {
          path: "$profile",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          id: { $toString: "$_id" },
          name: "$name",
          email: "$email",
          username: "$username",

          clicks: { $ifNull: ["$profile.clicks", 0] },

          isActive: 1,
          isDeleted: 1,
          isBlocked: 1,
          createdAt: 1,
          updatedAt: 1,

          _id: 0,
        },
      },

      { $sort: { createdAt: -1 } },
    ]);

    return ok(adminUsers);
  } catch (error) {
    console.log(error);
    return fail("DB_ERROR", "Failed to get admin users");
  }
};

export const toggleUserStatusService = async (
  userId: string,
  status: UserStatus,
): Promise<Result<string>> => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        isActive: status === "block" ? false : true,
        isBlocked: status === "block" ? true : false,
      },
    );

    if (!user) {
      return fail("NOT_FOUND", "User not found");
    }

    const profile = await Profile.findOneAndUpdate(
      { user_id: userId },
      {
        isActive: status === "block" ? false : true,
        isBlocked: status === "block" ? true : false,
      },
    );

    if (!profile) {
      return fail("NOT_FOUND", "Profile not found");
    }

    return ok(
      `User ${user.name} is ${status === "block" ? "blocked" : "unblocked"}`,
    );
  } catch (error) {
    console.log(error);
    return fail("DB_ERROR", "Failed to toggle user status");
  }
};
