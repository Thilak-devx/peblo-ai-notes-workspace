"use client";

import { useEffect, useState } from "react";
import { fetchDashboardInsights } from "@/lib/api/dashboard";
import { getApiErrorMessage } from "@/lib/api/errors";
import { RecentNotesCard } from "@/components/dashboard/recent-notes-card";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { StatCard } from "@/components/dashboard/stat-card";
import { TopTagsCard } from "@/components/dashboard/top-tags-card";
import { WeeklyActivityChart } from "@/components/dashboard/weekly-activity-chart";
import { Card } from "@/components/ui/card";
import type { DashboardInsights } from "@/types/dashboard";

export function DashboardInsightsView() {
  const [insights, setInsights] = useState<DashboardInsights | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await fetchDashboardInsights();

        if (isMounted) {
          setInsights(response);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(getApiErrorMessage(requestError, "Unable to load dashboard insights"));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void run();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error || !insights) {
    return (
      <Card className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-600">
          Insights unavailable
        </p>
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
          The dashboard could not load right now
        </h2>
        <p className="text-sm leading-7 text-[var(--muted)]">{error}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-5 lg:space-y-6">
      <div className="grid gap-4 md:grid-cols-3 lg:gap-5">
        <StatCard
          detail="All notes currently inside your workspace."
          label="Total notes"
          value={insights.totalNotes}
        />
        <StatCard
          accent="text-[var(--success)]"
          detail="Notes still active and ready for editing."
          label="Active notes"
          value={insights.activeNotes}
        />
        <StatCard
          detail="AI summaries generated across your saved notes."
          label="AI usage"
          value={insights.aiSummariesGenerated}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr] lg:gap-5">
        <WeeklyActivityChart activity={insights.weeklyActivity} />
        <TopTagsCard tags={insights.mostUsedTags} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr] lg:gap-5">
        <RecentNotesCard notes={insights.recentlyEditedNotes} />
        <Card className="space-y-4.5">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Archive health
            </p>
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
              Workspace balance
            </h2>
          </div>

          <div className="archive-health-panel rounded-[28px] p-8">
            <p className="archive-health-label text-xs uppercase tracking-[0.22em]">
              Archived notes
            </p>

            <h2 className="archive-health-number mt-4 text-6xl font-semibold">
              {insights.archivedNotes}
            </h2>

            <p className="archive-health-body mt-4 max-w-[280px] text-sm leading-7">
              Archive counts help you keep the live workspace focused while preserving important context in the background.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
