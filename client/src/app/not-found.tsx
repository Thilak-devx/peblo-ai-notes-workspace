import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 py-10">
      <div className="glass-panel max-w-xl rounded-[32px] p-8 text-center md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
          Not found
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[var(--foreground)]">
          This page does not exist
        </h1>
        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
          The link may be outdated, or the content may have been removed from the workspace.
        </p>
        <div className="mt-6 flex justify-center">
          <Link
            className="focus-ring inline-flex rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
            href="/dashboard"
          >
            Return to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
