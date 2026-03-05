import { ClickCounts } from "@/models/clicks";
import { Links, type PlatformType } from "@/models/links";
import { User, UserDocument } from "@/models/users";
import { fail, ok, Result } from "@/utils";
import { AdminLinksResponse, LinkStatus } from "@linktree/validation";

export const getAdminLinksService = async (): Promise<
  Result<AdminLinksResponse[]>
> => {
  try {
    const adminLinks: AdminLinksResponse[] = await Links.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },

      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "clickcounts",
          localField: "_id",
          foreignField: "link_id",
          as: "clicks",
        },
      },

      {
        $addFields: {
          clicks: {
            $sum: "$clicks.clicks",
          },
        },
      },

      {
        $project: {
          id: { $toString: "$_id" },
          title: 1,
          link: 1,

          owner: "$user.username",

          clicks: { $ifNull: ["$clicks", 0] },

          isBlocked: 1,
          createdAt: 1,
          updatedAt: 1,

          _id: 0,
        },
      },

      { $sort: { createdAt: -1 } },
    ]);

    return ok(adminLinks);
  } catch (error) {
    console.log(error);
    return fail("DB_ERROR", "Failed to get admin links");
  }
};

export const toggleLinkStatusService = async (
  linkId: string,
  status: LinkStatus,
): Promise<Result<string>> => {
  try {
    const link = await Links.findOneAndUpdate(
      { _id: linkId },
      { isBlocked: status === "block" ? true : false },
      { new: true },
    );

    if (!link) {
      return fail("NOT_FOUND", "Link not found");
    }

    return ok(
      `Link ${link.title} is ${status === "block" ? "blocked" : "unblocked"}`,
    );
  } catch (error) {
    console.log(error);
    return fail("DB_ERROR", "Failed to toggle link status");
  }
};

export const deleteLinkService = async (
  linkId: string,
): Promise<Result<string>> => {
  try {
    const link = await Links.findOneAndDelete({ _id: linkId });
    if (!link) {
      return fail("NOT_FOUND", "Link not found");
    }

    return ok(`Link ${link.title} deleted successfully`);
  } catch (error) {
    console.log(error);
    return fail("DB_ERROR", "Failed to delete link");
  }
};
