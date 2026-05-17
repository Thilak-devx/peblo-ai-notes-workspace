"use client";

import { useEffect, useState } from "react";
import { fetchSharedNote } from "@/lib/api/notes";
import { getApiErrorMessage } from "@/lib/api/errors";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SharedNote } from "@/types/note";

export function SharedNoteView({ shareId }: { shareId: string }) {
  const [note, setNote] = useState<SharedNote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      try {
        setIsLoading(true);
        setError("");
        const result = await fetchSharedNote(shareId);

        if (isMounted) {
          setNote(result);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(getApiErrorMessage(requestError, "Unable to load shared note"));
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
  }, [shareId]);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10">
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            Shared note
          </p>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">
            Peblo AI Notes Workspace
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-[var(--muted)]">
            Public notes keep the reading experience clean and distraction-free while respecting workspace privacy.
          </p>
        </div>

        <Card className="rounded-[36px] p-8 md:p-10">
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-4 w-28 animate-pulse rounded bg-[var(--border)]" />
              <div className="h-10 w-3/4 animate-pulse rounded bg-[var(--surface-strong)]" />
              <div className="h-4 w-full animate-pulse rounded bg-[var(--surface-strong)]" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-[var(--surface-strong)]" />
            </div>
          ) : error ? (
            <div className="space-y-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-600">
                Invalid share link
              </p>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                This shared note is unavailable
              </h2>
              <p className="text-sm leading-7 text-[var(--muted)]">{error}</p>
            </div>
          ) : note ? (
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                  {note.category}
                </p>
                <h2 className="text-4xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">
                  {note.title}
                </h2>
                <p className="text-sm text-[var(--muted)]">
                  Last updated{" "}
                  {note.updatedAt
                    ? new Date(note.updatedAt).toLocaleString()
                    : "recently"}
                </p>
              </div>

              {note.tags.length ? (
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              ) : null}

              <div className="prose prose-slate max-w-none whitespace-pre-wrap text-base leading-8 text-[var(--foreground)]">
                {note.content || "No content available for this shared note."}
              </div>
            </div>
          ) : null}
        </Card>
      </div>
    </main>
  );
}
