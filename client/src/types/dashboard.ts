export type DashboardInsights = {
  totalNotes: number;
  archivedNotes: number;
  activeNotes: number;
  aiSummariesGenerated: number;
  recentlyEditedNotes: Array<{
    id: string;
    title: string;
    category: string;
    archived: boolean;
    updatedAt?: string;
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

export type DashboardInsightsResponse = {
  status: "success";
  insights: DashboardInsights;
};
