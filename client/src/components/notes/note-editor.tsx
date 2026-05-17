"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type NoteEditorProps = {
  hasNote: boolean;
  title: string;
  content: string;
  tags: string[];
  category: string;
  isArchived: boolean;
  saveState: "idle" | "saving" | "saved" | "error";
  hasUnsavedChanges: boolean;
  lastUpdatedLabel: string;
  focusTitleSignal: number;
  isBusy: boolean;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onTagsChange: (value: string[]) => void;
  onCategoryChange: (value: string) => void;
  onCreateNote: () => void;
  onDuplicateNote: () => void;
  onSaveNow: () => void;
  onArchiveToggle: () => void;
  onDelete: () => void;
};

const categoryOptions = [
  "General",
  "Work",
  "Research",
  "Meetings",
  "Personal",
  "Ideas",
];

export function NoteEditor({
  hasNote,
  title,
  content,
  tags,
  category,
  isArchived,
  saveState,
  hasUnsavedChanges,
  lastUpdatedLabel,
  focusTitleSignal,
  isBusy,
  onTitleChange,
  onContentChange,
  onTagsChange,
  onCategoryChange,
  onCreateNote,
  onDuplicateNote,
  onSaveNow,
  onArchiveToggle,
  onDelete,
}: NoteEditorProps) {
  const titleInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!hasNote) {
      return;
    }

    titleInputRef.current?.focus();
    titleInputRef.current?.select();
  }, [focusTitleSignal, hasNote]);

  if (!hasNote) {
    return (
      <div className="glass-panel flex h-[720px] w-full min-w-0 max-w-full items-center justify-center overflow-hidden rounded-[30px] px-8 py-16">
        <div className="flex max-w-[320px] flex-col items-center justify-center gap-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
              Notes workspace
            </p>
          <h2 className="text-5xl font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)]">
            Create a note to start writing
          </h2>
          <p className="text-base leading-8 text-[var(--muted)]">
            Your editor, autosave flow, AI suggestions, and sharing tools will appear here.
          </p>
          <div className="mt-2 flex justify-center">
            <Button onClick={onCreateNote}>New note</Button>
          </div>
        </div>
      </div>
    );
  }

  const safeTags = tags ?? [];
  const statusConfig =
    saveState === "error"
      ? {
          label: "Save failed",
          className:
            "border-rose-200/80 bg-rose-50/90 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200",
        }
      : saveState === "saving"
        ? {
            label: "Saving...",
            className:
              "border-[color:color-mix(in_srgb,var(--accent)_22%,transparent)] bg-[color:color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--accent-strong)]",
          }
        : hasUnsavedChanges
          ? {
              label: "Unsaved changes",
              className:
                "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--foreground)]",
            }
          : {
              label: "Saved",
              className:
                "border-emerald-200/80 bg-emerald-50/90 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200",
            };

  return (
    <div className="glass-panel flex h-[720px] w-full min-w-0 max-w-full flex-col overflow-hidden rounded-[28px] p-5 md:p-6 xl:p-7">
      <div className="border-b border-[var(--border)] pb-5">
        <div className="flex flex-col gap-5 2xl:flex-row 2xl:items-start 2xl:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
              Editor
            </p>
            <h2 className="mt-3 truncate text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
              {title.trim() || "Untitled note"}
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${statusConfig.className}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    saveState === "saving" ? "animate-pulse bg-current" : "bg-current"
                  }`}
                />
                {statusConfig.label}
              </div>
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
                {lastUpdatedLabel}
              </span>
              {isArchived ? (
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                  Archived
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button className="px-4 py-2.5" disabled={isBusy} onClick={onCreateNote} variant="ghost">
              New
            </Button>
            <Button className="px-4 py-2.5" disabled={isBusy} onClick={onDuplicateNote} variant="ghost">
              Duplicate
            </Button>
            <Button
              className="px-4 py-2.5"
              disabled={isBusy || !hasUnsavedChanges}
              onClick={onSaveNow}
              variant="secondary"
            >
              Save
            </Button>
            <Button className="px-4 py-2.5" disabled={isBusy} onClick={onArchiveToggle} variant="secondary">
              {isArchived ? "Unarchive" : "Archive"}
            </Button>
            <Button className="px-4 py-2.5" disabled={isBusy} onClick={onDelete} variant="ghost">
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex min-h-0 flex-1 flex-col space-y-6">
        <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr] xl:items-start">
        <Input
          autoFocus
          className="h-14 w-full min-w-0 px-4 py-3"
          disabled={isBusy}
          inputRef={titleInputRef}
          label="Title"
          onChange={onTitleChange}
          placeholder="Untitled note"
          value={title}
        />

          <label className="block min-w-0">
            <div className="mb-2 flex min-h-[24px] items-center gap-3">
              <span className="text-sm font-semibold text-[var(--foreground)]">Category</span>
            </div>
          <select
            className="focus-ring h-14 w-full min-w-0 rounded-[18px] border border-[var(--border)] bg-[var(--field-bg)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition duration-200 focus:bg-[var(--field-bg-focus)]"
            disabled={isBusy}
            onChange={(event) => onCategoryChange(event.target.value)}
            value={category}
          >
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        </div>

        <Input
          className="min-h-[56px] w-full min-w-0 px-4 py-3"
          disabled={isBusy}
          label="Tags"
          onChange={(value) =>
            onTagsChange(
              value
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
            )
          }
          placeholder="research, planning, weekly-review"
          value={(safeTags ?? []).join(", ")}
        />
        
        <Textarea
          className="min-h-[360px] max-h-none w-full min-w-0 flex-1 resize-none overflow-y-auto"
          disabled={isBusy}
          label="Content"
          onChange={onContentChange}
          placeholder="Capture ideas, meeting notes, or your next draft here..."
          rows={16}
          value={content}
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--muted)]">
          <span>Autosave runs quietly in the background.</span>
          <span>Use Ctrl/Cmd + S to save immediately.</span>
        </div>
      </div>
    </div>
  );
}
