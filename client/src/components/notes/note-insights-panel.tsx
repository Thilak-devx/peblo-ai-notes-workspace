"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type NoteInsightsPanelProps = {
  hasNote: boolean;
  isGeneratingAi: boolean;
  isSharing: boolean;
  aiSummary: string;
  aiActionItems: string[];
  aiSuggestedTitle: string;
  isPublic: boolean;
  shareUrl: string | null;
  onGenerateAi: () => void;
  onApplySuggestedTitle: () => void;
  onShare: () => void;
  onDisableSharing: () => void;
  onCopyShareLink: () => void;
};

export function NoteInsightsPanel({
  hasNote,
  isGeneratingAi,
  isSharing,
  aiSummary,
  aiActionItems,
  aiSuggestedTitle,
  isPublic,
  shareUrl,
  onGenerateAi,
  onApplySuggestedTitle,
  onShare,
  onDisableSharing,
  onCopyShareLink,
}: NoteInsightsPanelProps) {
  if (!hasNote) {
    return (
      <div className="flex h-[720px] w-full min-w-0 flex-col gap-5 overflow-hidden">
        <Card className="empty-state-panel flex-1 space-y-4 overflow-hidden">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            AI insights
          </p>
          <p className="empty-state-copy text-sm leading-7">
            Select or create a note to generate summaries, action items, and a suggested title.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-[720px] w-full min-w-0 flex-col gap-5 overflow-hidden">
      <Card className="space-y-4 overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              AI insights
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
              Summary and next steps
            </h3>
          </div>
          <Button disabled={isGeneratingAi} onClick={onGenerateAi} variant="secondary">
            {isGeneratingAi ? "Generating..." : "Generate"}
          </Button>
        </div>

        <div className="border-t border-[var(--border)] pt-4">
        <p className="text-sm leading-7 text-[var(--muted)]">
          {aiSummary || "Generate AI insights to get a concise summary and practical follow-up actions."}
        </p>
        </div>

        {aiSuggestedTitle ? (
          <div className="elevated-panel rounded-[24px] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">
              Suggested title
            </p>
            <p className="mt-2 text-base font-semibold text-[var(--foreground)]">
              {aiSuggestedTitle}
            </p>
            <div className="mt-4">
              <Button onClick={onApplySuggestedTitle} variant="secondary">
                Apply suggested title
              </Button>
            </div>
          </div>
        ) : null}

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[var(--foreground)]">Action items</p>
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">
              {aiActionItems.length}
            </span>
          </div>

          {aiActionItems.length ? (
            <ul className="space-y-3">
              {aiActionItems.map((item, index) => (
                <li className="soft-panel rounded-[22px] px-4 py-3 text-sm leading-7 text-[var(--foreground)]" key={`${item}-${index}`}>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm leading-7 text-[var(--muted)]">
              AI-generated action items will appear here after analysis.
            </p>
          )}
        </div>
      </Card>

      <Card className="space-y-4 overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Public sharing
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
              Share outside the workspace
            </h3>
          </div>
          <Button
            disabled={isSharing}
            onClick={isPublic ? onDisableSharing : onShare}
            variant="secondary"
          >
            {isSharing ? "Updating..." : isPublic ? "Disable" : "Share"}
          </Button>
        </div>

        <p className="text-sm leading-7 text-[var(--muted)]">
          {isPublic
            ? "Anyone with the link can view this note without signing in."
            : "Create a public read-only link when you want to share this note externally."}
        </p>

        {shareUrl ? (
          <div className="soft-panel rounded-[24px] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
              Public link
            </p>
            <p className="mt-2 break-all font-mono text-sm text-[var(--foreground)]">
              {shareUrl}
            </p>
            <div className="mt-4">
              <Button disabled={isSharing} onClick={onCopyShareLink} variant="secondary">
                Copy link
              </Button>
            </div>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
