import { Types } from "mongoose";
import { Note } from "../models/Note";
import { ApiError } from "../utils/api-error";

type DashboardInsight = {
  totalNotes: number;
  archivedNotes: number;
  aiSummariesGenerated: number;
  activeNotes: number;
  recentlyEditedNotes: Array<{
    id: string;
    title: string;
    category: string;
    archived: boolean;
    updatedAt?: Date;
  }>;
  mostUsedTags: Array<{
    tag: string;
    count: number;
  }>;
  weeklyActivity: Array<{
    label: string;
    date: string;
    count: number;
  }>;
};

function ensureValidUserId(userId: string) {
  if (!Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user id");
  }
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatDayLabel(date: Date) {
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

export async function getDashboardInsights(userId: string): Promise<DashboardInsight> {
  ensureValidUserId(userId);

  const objectUserId = new Types.ObjectId(userId);
  const today = startOfDay(new Date());
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);

  const [overviewResults, weeklyResults] = await Promise.all([
    Note.aggregate([
      {
        $match: {
          userId: objectUserId,
        },
      },
      {
        $facet: {
          counts: [
            {
              $group: {
                _id: null,
                totalNotes: { $sum: 1 },
                archivedNotes: {
                  $sum: { $cond: [{ $eq: ["$archived", true] }, 1, 0] },
                },
                activeNotes: {
                  $sum: { $cond: [{ $eq: ["$archived", false] }, 1, 0] },
                },
                aiSummariesGenerated: {
                  $sum: {
                    $cond: [
                      {
                        $gt: [
                          {
                            $strLenCP: {
                              $ifNull: ["$aiSummary", ""],
                            },
                          },
                          0,
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
              },
            },
          ],
          recentlyEditedNotes: [
            { $sort: { updatedAt: -1 } },
            { $limit: 5 },
            {
              $project: {
                _id: 1,
                title: 1,
                category: 1,
                archived: 1,
                updatedAt: 1,
              },
            },
          ],
          mostUsedTags: [
            { $unwind: { path: "$tags", preserveNullAndEmptyArrays: false } },
            {
              $group: {
                _id: { $toLower: "$tags" },
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1, _id: 1 } },
            { $limit: 6 },
            {
              $project: {
                _id: 0,
                tag: "$_id",
                count: 1,
              },
            },
          ],
        },
      },
    ]),
    Note.aggregate([
      {
        $match: {
          userId: objectUserId,
          updatedAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$updatedAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const overview = overviewResults[0];
  const counts = overview?.counts?.[0] || {
    totalNotes: 0,
    archivedNotes: 0,
    activeNotes: 0,
    aiSummariesGenerated: 0,
  };

  const weeklyMap = new Map<string, number>(
    weeklyResults.map((entry) => [String(entry._id), Number(entry.count)]),
  );

  const weeklyActivity = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(sevenDaysAgo);
    date.setDate(sevenDaysAgo.getDate() + index);
    const isoDate = date.toISOString().slice(0, 10);

    return {
      label: formatDayLabel(date),
      date: isoDate,
      count: weeklyMap.get(isoDate) || 0,
    };
  });

  return {
    totalNotes: counts.totalNotes,
    archivedNotes: counts.archivedNotes,
    activeNotes: counts.activeNotes,
    aiSummariesGenerated: counts.aiSummariesGenerated,
    recentlyEditedNotes: (overview?.recentlyEditedNotes || []).map(
      (note: {
        _id: unknown;
        title: string;
        category: string;
        archived: boolean;
        updatedAt?: Date;
      }) => ({
        id: String(note._id),
        title: note.title,
        category: note.category,
        archived: note.archived,
        updatedAt: note.updatedAt,
      }),
    ),
    mostUsedTags: overview?.mostUsedTags || [],
    weeklyActivity,
  };
}
