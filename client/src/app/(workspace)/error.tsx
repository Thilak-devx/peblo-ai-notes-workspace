"use client";

import { useEffect } from "react";

export default function WorkspaceError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="glass-panel rounded-[32px] p-8 text-center md:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-600">
        Workspace error
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">
        We couldn&apos;t render this workspace view
      </h2>
      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
        Refresh the current segment to retry loading notes, insights, and related UI state.
      </p>
      <button
        className="focus-ring mt-6 inline-flex rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
        onClick={() => unstable_retry()}
        type="button"
      >
        Retry workspace
      </button>
    </div>
  );
}
