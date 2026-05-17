"use client";

import { useState } from "react";
import { WorkspaceSidebar } from "@/components/layout/workspace-sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <main className="page-fade mx-auto flex min-h-screen max-w-[1420px] flex-col gap-5 px-4 py-4 sm:px-5 sm:py-5 lg:flex-row lg:gap-5 lg:px-6 lg:py-7">
      <div className="glass-panel flex items-center justify-between rounded-[28px] px-4 py-3 lg:hidden">
        <button
          aria-label="Open sidebar"
          className="lift-hover rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2 text-sm font-semibold text-[var(--foreground)]"
          onClick={() => setIsSidebarOpen(true)}
          type="button"
        >
          Menu
        </button>
        <ThemeToggle />
      </div>

      {isSidebarOpen ? (
        <button
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-30 bg-slate-950/35 backdrop-blur-[2px] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          type="button"
        />
      ) : null}

      <WorkspaceSidebar
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
        onToggleCollapse={() => setIsSidebarCollapsed((current) => !current)}
      />

      <section className="min-w-0 flex-1 pb-2">{children}</section>
    </main>
  );
}
