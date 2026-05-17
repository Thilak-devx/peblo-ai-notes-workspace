import { Card } from "@/components/ui/card";

type StatCardProps = {
  label: string;
  value: string | number;
  detail: string;
  accent?: string;
};

export function StatCard({
  label,
  value,
  detail,
  accent = "text-[var(--foreground)]",
}: StatCardProps) {
  return (
    <Card className="group space-y-3.5 overflow-hidden">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium leading-6 text-[var(--muted)]">{label}</p>
        <div className="flex h-9 w-9 items-center justify-center rounded-[18px] border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--muted)] transition duration-200 group-hover:bg-[var(--surface-strong)]">
          <svg aria-hidden className="h-4 w-4" fill="none" viewBox="0 0 24 24">
            <path
              d="M7 12h10M13 8l4 4-4 4"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.7"
            />
          </svg>
        </div>
      </div>
      <div className="space-y-1.5">
        <p className={`text-4xl font-semibold tracking-[-0.03em] ${accent}`}>{value}</p>
        <p className="text-sm leading-6 text-[var(--muted)]">{detail}</p>
      </div>
    </Card>
  );
}
