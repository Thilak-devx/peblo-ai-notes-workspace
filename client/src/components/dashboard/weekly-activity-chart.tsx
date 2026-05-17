import { Card } from "@/components/ui/card";
import type { DashboardInsights } from "@/types/dashboard";

type WeeklyActivityChartProps = {
  activity: DashboardInsights["weeklyActivity"];
};

export function WeeklyActivityChart({ activity }: WeeklyActivityChartProps) {
  const highestCount = Math.max(...activity.map((day) => day.count), 1);

  return (
    <Card className="space-y-5">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
          Weekly activity
        </p>
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
          Editing momentum
        </h2>
      </div>

      <div className="grid grid-cols-7 gap-2.5 md:gap-3">
        {activity.map((day) => {
          const height = `${Math.max((day.count / highestCount) * 100, 10)}%`;

          return (
            <div className="space-y-2.5 text-center" key={day.date}>
              <div className="flex h-40 items-end rounded-[22px] bg-[var(--surface-soft)] px-1.5 py-2.5 md:h-44 md:px-2 md:py-3">
                <div
                  className="w-full rounded-[18px] bg-gradient-to-t from-[var(--accent-strong)] via-[var(--accent)] to-[color:color-mix(in_srgb,var(--accent)_30%,white)] transition-all duration-300"
                  style={{ height }}
                  title={`${day.count} edits`}
                />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                  {day.label}
                </p>
                <p className="mt-1 text-[13px] font-semibold text-[var(--foreground)]">
                  {day.count}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
