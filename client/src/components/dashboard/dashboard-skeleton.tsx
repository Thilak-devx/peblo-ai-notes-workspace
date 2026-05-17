import { Card } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card className="space-y-4" key={index}>
            <div className="h-4 w-24 animate-pulse rounded bg-[var(--border)]" />
            <div className="h-10 w-20 animate-pulse rounded bg-[var(--surface-strong)]" />
            <div className="h-4 w-full animate-pulse rounded bg-[var(--surface-strong)]" />
          </Card>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <Card className="space-y-4">
          <div className="h-4 w-28 animate-pulse rounded bg-[var(--border)]" />
          <div className="h-8 w-48 animate-pulse rounded bg-[var(--surface-strong)]" />
          <div className="grid grid-cols-7 gap-3">
            {Array.from({ length: 7 }).map((_, index) => (
              <div className="h-44 animate-pulse rounded-[20px] bg-[var(--surface-strong)]" key={index} />
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="h-4 w-28 animate-pulse rounded bg-[var(--border)]" />
          <div className="h-8 w-36 animate-pulse rounded bg-[var(--surface-strong)]" />
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="h-16 animate-pulse rounded-[20px] bg-[var(--surface-strong)]" key={index} />
          ))}
        </Card>
      </div>
    </div>
  );
}
