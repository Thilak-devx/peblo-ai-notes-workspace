export default function SharedNoteLoading() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10">
      <div className="glass-panel rounded-[36px] p-8 md:p-10">
        <div className="space-y-4">
          <div className="h-4 w-24 animate-pulse rounded bg-[var(--border)]" />
          <div className="h-12 w-3/4 animate-pulse rounded bg-[var(--surface-strong)]" />
          <div className="h-4 w-full animate-pulse rounded bg-[var(--surface-strong)]" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-[var(--surface-strong)]" />
          <div className="h-40 animate-pulse rounded-[28px] bg-[var(--surface-strong)]" />
        </div>
      </div>
    </main>
  );
}
