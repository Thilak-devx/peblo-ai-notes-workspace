export default function WorkspaceLoading() {
  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-[32px] p-6">
        <div className="h-4 w-24 animate-pulse rounded bg-[var(--border)]" />
        <div className="mt-4 h-10 w-72 animate-pulse rounded bg-[var(--surface-strong)]" />
        <div className="mt-3 h-4 w-full animate-pulse rounded bg-[var(--surface-strong)]" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <div className="glass-panel rounded-[32px] p-6">
          <div className="space-y-4">
            <div className="h-10 animate-pulse rounded-2xl bg-[var(--surface-strong)]" />
            <div className="h-10 animate-pulse rounded-2xl bg-[var(--surface-strong)]" />
            <div className="h-10 animate-pulse rounded-2xl bg-[var(--surface-strong)]" />
          </div>
        </div>
        <div className="glass-panel min-h-[60vh] rounded-[32px] p-6">
          <div className="space-y-4">
            <div className="h-10 w-2/3 animate-pulse rounded bg-[var(--surface-strong)]" />
            <div className="h-56 animate-pulse rounded-[28px] bg-[var(--surface-strong)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
