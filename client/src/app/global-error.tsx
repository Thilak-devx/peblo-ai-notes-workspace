"use client";

import { useEffect } from "react";
import "./globals.css";

export default function GlobalError({
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
    <html lang="en">
      <body className="min-h-screen bg-[var(--background)] px-6 py-10 text-[var(--foreground)]">
        <main className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center">
          <div className="glass-panel w-full rounded-[32px] p-8 text-center md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-600">
              Application error
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em]">
              Something went wrong across the workspace
            </h1>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Try again to reload the app. If the issue keeps happening, check the server and browser logs for the matching error digest.
            </p>
            <button
              className="focus-ring mt-6 inline-flex rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
              onClick={() => unstable_retry()}
              type="button"
            >
              Retry application
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
