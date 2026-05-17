import { Card } from "@/components/ui/card";
import type { DashboardInsights } from "@/types/dashboard";

type TopTagsCardProps = {
  tags: DashboardInsights["mostUsedTags"];
};

export function TopTagsCard({ tags }: TopTagsCardProps) {
  return (
    <Card className="space-y-4.5">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
          Organization
        </p>
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
          Most used tags
        </h2>
      </div>

      {tags.length ? (
        <div className="space-y-2.5">
          {tags.map((tag) => (
            <div
              className="soft-panel flex items-center justify-between rounded-[20px] px-3.5 py-3"
              key={tag.tag}
            >
              <div>
                <p className="text-sm font-semibold leading-6 text-[var(--foreground)]">#{tag.tag}</p>
                <p className="text-xs text-[var(--muted)]">Used across your notes</p>
              </div>
              <span className="rounded-full bg-[color:color-mix(in_srgb,var(--accent)_14%,transparent)] px-3 py-1 text-xs font-semibold text-[var(--accent-strong)]">
                {tag.count}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm leading-7 text-[var(--muted)]">
          Add tags to your notes to see your strongest themes here.
        </p>
      )}
    </Card>
  );
}
