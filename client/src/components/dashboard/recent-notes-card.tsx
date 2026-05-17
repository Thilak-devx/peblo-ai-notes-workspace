import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { DashboardInsights } from "@/types/dashboard";

type RecentNotesCardProps = {
  notes: DashboardInsights["recentlyEditedNotes"];
};

export function RecentNotesCard({ notes }: RecentNotesCardProps) {
  return (
    <Card className="space-y-4.5">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
          Recent activity
        </p>
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
          Recently edited notes
        </h2>
      </div>

      {notes.length ? (
        <div className="space-y-2.5">
          {notes.map((note) => (
            <Link
              className="lift-hover block rounded-[20px] border border-[var(--border)] bg-[var(--surface-soft)] px-3.5 py-3.5 transition hover:bg-[var(--surface-strong)]"
              href="/notes"
              key={note.id}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                    {note.title || "Untitled note"}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {note.category} {note.archived ? "| Archived" : ""}
                  </p>
                </div>
                <p className="text-xs font-mono text-[var(--muted)]">
                  {note.updatedAt
                    ? new Date(note.updatedAt).toLocaleDateString()
                    : "Today"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm leading-7 text-[var(--muted)]">
          Your latest edited notes will appear here once activity begins.
        </p>
      )}
    </Card>
  );
}
