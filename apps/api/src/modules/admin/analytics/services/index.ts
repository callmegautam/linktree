import { ClickCounts } from "@/models/clicks";
import { Links, type PlatformType } from "@/models/links";
import { User, UserDocument } from "@/models/users";
import { fail, ok, Result } from "@/utils";

export type Analytics = {
  totalUsers: number;
  totalLinks: number;
  totalClicks: number;
  activeUsers: number;
};

export type RecentActivity = {
  user: string;
  link: {
    title: string;
    link: string;
    platform: PlatformType;
  };
  clicks: number;
  date: string;
};

export type TopPerformingLinks = {
  link: {
    title: string;
    link: string;
    platform: string;
  };
  clicks: number;
  date: string;
};

export type AnalyticsResponse = {
  analytics: Analytics;
  recentActivity: RecentActivity[];
  topPerformingLinks: TopPerformingLinks[];
};

export const getAnalyticsService = async (): Promise<
  Result<AnalyticsResponse>
> => {
  try {
    const [totalUsers, totalLinks, totalClicks] = await Promise.all([
      User.countDocuments(),
      Links.countDocuments(),
      ClickCounts.countDocuments(),
    ]);

    const demoInactiveUsers = Math.floor(Math.random() * totalUsers);
    const activeUsers = totalUsers - demoInactiveUsers;

    const analytics: Analytics = {
      totalUsers,
      totalLinks,
      totalClicks,
      activeUsers,
    };

    const recentActivity: RecentActivity[] = await ClickCounts.aggregate([
      {
        $lookup: {
          from: "links",
          localField: "link_id",
          foreignField: "_id",
          as: "link",
        },
      },
      { $unwind: "$link" },

      {
        $lookup: {
          from: "users",
          localField: "link.user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },

      {
        $group: {
          _id: "$link_id",
          clicks: { $sum: "$clicks" },
          date: { $first: "$created_at" },
          title: { $first: "$link.title" },
          link: { $first: "$link.link" },
          platform: { $first: "$link.platform" },
          username: { $first: "$user.username" },
        },
      },

      {
        $project: {
          _id: 0,
          user: "$username",
          link: {
            title: "$title",
            link: "$link",
            platform: "$platform",
          },
          clicks: 1,
          date: {
            $dateToString: {
              format: "%Y-%m-%dT%H:%M:%S.%LZ",
              date: "$date",
            },
          },
        },
      },

      { $sort: { date: -1 } },
      { $limit: 10 },
    ]);

    const topPerformingLinks: TopPerformingLinks[] =
      await ClickCounts.aggregate([
        {
          $group: {
            _id: "$link_id",
            clicks: { $sum: "$clicks" },
            date: { $first: "$created_at" },
          },
        },

        {
          $lookup: {
            from: "links",
            localField: "_id",
            foreignField: "_id",
            as: "link",
          },
        },

        { $unwind: "$link" },

        {
          $project: {
            _id: 0,
            link: {
              title: "$link.title",
              link: "$link.link",
              platform: "$link.platform",
            },
            clicks: 1,
            date: {
              $dateToString: {
                format: "%Y-%m-%dT%H:%M:%S.%LZ",
                date: "$date",
              },
            },
          },
        },

        { $sort: { clicks: -1 } },
        { $limit: 5 },
      ]);

    return ok({
      analytics,
      recentActivity,
      topPerformingLinks,
    });
  } catch (error) {
    console.log(error);
    return fail("DB_ERROR", "Failed to get analytics");
  }
};
