"use client";

import { Badge } from "@/components/ui/badge";
import type { Note } from "@/types/note";

type NoteListProps = {
  notes: Note[];
  selectedNoteId: string | null;
  isLoading: boolean;
  onSelect: (noteId: string) => void | Promise<void>;
};

function formatUpdatedAt(value?: string) {
  if (!value) {
    return "Just now";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(date);
}

export function NoteList({
  notes,
  selectedNoteId,
  isLoading,
  onSelect,
}: NoteListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            className="animate-pulse rounded-[24px] border border-[var(--border)] bg-[var(--surface-soft)] p-4"
            key={index}
          >
            <div className="h-4 w-28 rounded bg-[var(--border)]" />
            <div className="mt-3 h-3 w-full rounded bg-[var(--surface-strong)]" />
            <div className="mt-2 h-3 w-2/3 rounded bg-[var(--surface-strong)]" />
          </div>
        ))}
      </div>
    );
  }

  if (!notes.length) {
    return (
      <div className="empty-state-panel rounded-[28px] border border-dashed border-[var(--border)] bg-[var(--surface-soft)] px-5 py-9 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
          No notes found
        </p>
        <p className="empty-state-copy mt-3 text-sm leading-7">
          Try changing the filters or create a new note to start your workspace.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {notes.map((note) => {
        const isActive = note.id === selectedNoteId;
        const safeTags = Array.isArray(note.tags) ? note.tags : [];

        return (
          <button
            aria-pressed={isActive}
            className={`lift-hover w-full min-h-[148px] rounded-[24px] border px-4 py-4 text-left transition ${
              isActive
                ? "border-[var(--accent)] bg-[var(--surface-strong)] shadow-[0_20px_40px_-28px_var(--shadow-strong)]"
                : "border-[var(--border)] bg-[var(--surface-soft)] hover:border-[color:color-mix(in_srgb,var(--accent)_20%,var(--border))] hover:bg-[var(--surface-strong)]"
            }`}
            key={note.id}
            onClick={() => onSelect(note.id)}
            type="button"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                  {note.title?.trim() || "Untitled note"}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
                  {note.content?.trim() || "No content yet. Start typing to build your note."}
                </p>
              </div>
              {note.archived ? <Badge>Archived</Badge> : null}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[var(--surface-strong)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
                {note.category || "General"}
              </span>
              {safeTags.slice(0, 2).map((tag) => (
                <span
                  className="rounded-full bg-[color:color-mix(in_srgb,var(--accent)_14%,transparent)] px-3 py-1 text-xs font-medium text-[var(--accent-strong)]"
                  key={tag}
                >
                  #{tag}
                </span>
              ))}
              <span className="ml-auto text-xs font-mono text-[var(--muted)]">
                {formatUpdatedAt(note.updatedAt || note.createdAt)}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
