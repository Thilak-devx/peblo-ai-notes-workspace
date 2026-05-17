"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/auth/logout-button";
import { appConfig } from "@/config/app";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";

type WorkspaceSidebarProps = {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleCollapse: () => void;
};

function DashboardIcon() {
  return (
    <svg aria-hidden className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24">
      <path
        d="M4.75 5.75h6.5v5.5h-6.5zM12.75 5.75h6.5v8.5h-6.5zM4.75 12.75h6.5v5.5h-6.5zM12.75 15.25h6.5v3h-6.5z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function NotesIcon() {
  return (
    <svg aria-hidden className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24">
      <path
        d="M7.25 4.75h8.5l3 3v11.5a1.5 1.5 0 0 1-1.5 1.5h-10.5a1.5 1.5 0 0 1-1.5-1.5v-13a1.5 1.5 0 0 1 1.5-1.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M9 10h6M9 13.5h6M9 17h4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg aria-hidden className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M10 5.75H6.75a1.5 1.5 0 0 0-1.5 1.5v9.5a1.5 1.5 0 0 0 1.5 1.5H10"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
      <path
        d="M13 8.25 17 12l-4 3.75M8.75 12h8.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function PanelToggleIcon({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <svg
      aria-hidden
      className={`h-4 w-4 transition duration-200 ${isCollapsed ? "rotate-180" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="m14.75 6.75-5.5 5.25 5.5 5.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function FocusLaneIcon() {
  return (
    <svg aria-hidden className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 3.75c-3.04 0-5.5 2.4-5.5 5.35 0 1.88.94 3.24 2.02 4.37.97 1 1.73 2.03 1.98 3.03h3c.25-1 .99-2.03 1.96-3.03 1.1-1.13 2.04-2.49 2.04-4.37 0-2.95-2.46-5.35-5.5-5.35Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M9.75 18.25h4.5M10.5 20.5h3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function WorkspaceSidebar({
  isCollapsed,
  isMobileOpen,
  onCloseMobile,
  onToggleCollapse,
}: WorkspaceSidebarProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const initials = (user?.name || "Workspace User")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const navigationItems = [
    {
      ...appConfig.navigation[0],
      helper: "Overview",
      icon: <DashboardIcon />,
    },
    {
      ...appConfig.navigation[1],
      helper: "Workspace",
      icon: <NotesIcon />,
    },
  ];

  return (
    <aside
      aria-label="Workspace sidebar"
      className={`glass-panel fixed inset-y-4 left-4 z-40 flex h-screen w-[min(84vw,20rem)] flex-col gap-4 overflow-hidden rounded-[28px] px-3.5 py-6 transition duration-300 lg:sticky lg:top-8 lg:z-10 lg:h-[calc(100vh-4rem)] ${
        isMobileOpen ? "translate-x-0" : "-translate-x-[120%]"
      } ${isCollapsed ? "lg:w-[92px] lg:items-center" : "lg:w-[17.4rem]"} lg:translate-x-0`}
    >
      <div className={`space-y-4 ${isCollapsed ? "lg:flex lg:w-full lg:flex-col lg:items-center lg:space-y-4" : ""}`}>
        <div className={`flex items-start justify-between gap-2.5 ${isCollapsed ? "lg:flex-col lg:items-center lg:justify-start" : ""}`}>
          <div className={`min-w-0 ${isCollapsed ? "lg:hidden" : ""}`}>
            <Badge>Focus mode</Badge>
            <div className="mt-2.5 space-y-1">
              <h2 className="text-[0.98rem] font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                Workspace panel
              </h2>
              <p className="max-w-[14rem] text-[13px] leading-5.5 text-[var(--muted)]">
                Keep your navigation calm, quick, and always within reach.
              </p>
            </div>
          </div>

          <div className={`flex items-center gap-2 self-start ${isCollapsed ? "lg:flex-col lg:items-center lg:gap-3" : ""}`}>
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>
            <button
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="focus-ring hidden h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--foreground)] transition duration-200 hover:bg-[var(--surface-strong)] lg:inline-flex"
              onClick={onToggleCollapse}
              type="button"
            >
              <PanelToggleIcon isCollapsed={isCollapsed} />
            </button>
            <button
              aria-label="Close sidebar"
              className="focus-ring inline-flex h-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 text-sm font-medium text-[var(--foreground)] transition duration-200 hover:bg-[var(--surface-strong)] lg:hidden"
              onClick={onCloseMobile}
              type="button"
            >
              Close
            </button>
          </div>
        </div>

        <div className={`rounded-[24px] border border-[color:color-mix(in_srgb,var(--border)_82%,transparent)] bg-[color:color-mix(in_srgb,var(--surface-soft)_88%,transparent)] shadow-[0_18px_40px_-32px_var(--shadow)] backdrop-blur ${isCollapsed ? "lg:flex lg:h-14 lg:w-14 lg:items-center lg:justify-center lg:rounded-2xl lg:p-0" : "p-3"}`}>
          <div className={`flex items-center gap-3 ${isCollapsed ? "lg:justify-center" : ""}`}>
            <div className={`flex shrink-0 items-center justify-center bg-[linear-gradient(135deg,color-mix(in_srgb,var(--accent)_16%,transparent),color-mix(in_srgb,var(--foreground)_10%,transparent))] text-sm font-semibold tracking-[0.04em] text-[var(--foreground)] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] ${isCollapsed ? "h-14 w-14 rounded-2xl" : "h-12 w-12 rounded-[18px]"}`}>
              {initials || "WU"}
            </div>
            <div className={`min-w-0 ${isCollapsed ? "lg:hidden" : ""}`}>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                Signed in
              </p>
              <p className="mt-1 truncate text-[0.96rem] font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                {user?.name || "Workspace user"}
              </p>
              <p className="mt-0.5 truncate text-[11px] leading-5 text-[var(--muted)]/90">
                {user?.email || "user@example.com"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={`flex-1 ${isCollapsed ? "flex w-full flex-col items-center" : ""}`}>
      <nav className={`space-y-3 ${isCollapsed ? "flex w-full flex-col items-center gap-4 space-y-0" : ""}`}>
        {navigationItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={`group focus-ring relative flex overflow-hidden transition duration-200 ${
                isCollapsed
                  ? "h-14 w-14 items-center justify-center rounded-2xl px-0 py-0"
                  : "items-center gap-3 rounded-[18px] px-3 py-3"
              } ${
                isActive
                  ? "bg-[color:color-mix(in_srgb,var(--accent)_13%,transparent)] text-[var(--foreground)] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--accent)_18%,transparent)]"
                  : "text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]"
              }`}
              href={item.href}
              key={item.href}
              onClick={onCloseMobile}
              title={item.label}
            >
              <span
                className={`absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-[color:color-mix(in_srgb,var(--accent)_88%,white)] transition duration-200 ${
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                }`}
              />
              <span
                className={`flex shrink-0 items-center justify-center border transition duration-200 ${
                  isCollapsed ? "h-14 w-14 rounded-2xl border-transparent" : "ml-2 h-9 w-9 rounded-[16px]"
                } ${
                  isActive
                    ? "border-[color:color-mix(in_srgb,var(--accent)_22%,transparent)] bg-[color:color-mix(in_srgb,var(--accent)_14%,transparent)] text-[var(--accent-strong)]"
                    : "border-[color:color-mix(in_srgb,var(--border)_82%,transparent)] bg-[var(--surface-soft)] text-[var(--muted)] group-hover:text-[var(--foreground)]"
                }`}
              >
                {item.icon}
              </span>
              <div className={`min-w-0 flex-1 pr-1.5 ${isCollapsed ? "lg:hidden" : ""}`}>
                <p className="text-[13px] font-semibold leading-5 tracking-[-0.02em]">
                  {item.label}
                </p>
                <p className="mt-1 text-[11px] leading-[1.35] text-[var(--muted)] transition group-hover:text-[var(--muted)]">
                  {item.helper}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] transition ${
                  isCollapsed
                    ? "hidden"
                    : isActive
                      ? "bg-[color:color-mix(in_srgb,var(--accent)_16%,transparent)] text-[var(--accent-strong)]"
                      : "bg-[var(--surface-soft)] text-[var(--muted)]"
                } lg:inline-flex`}
              >
                {item.label.slice(0, 2)}
              </span>
            </Link>
          );
        })}
      </nav>
      </div>

      <div className={`mt-auto space-y-3 ${isCollapsed ? "lg:flex lg:w-full lg:flex-col lg:items-center lg:gap-4 lg:space-y-0" : ""}`}>
        <LogoutButton
          className={`logout-button-shell rounded-[18px] text-sm ${isCollapsed ? "lg:h-14 lg:w-14 lg:justify-center lg:rounded-2xl lg:px-0 lg:py-0" : "justify-start px-2.5 py-2.5"}`}
        >
          <span
            className={`logout-icon-surface flex shrink-0 items-center justify-center rounded-2xl transition-all duration-200 ${isCollapsed ? "h-12 w-12" : "h-12 w-12"}`}
          >
            <LogoutIcon />
          </span>
          <span className={isCollapsed ? "lg:hidden" : ""}>Logout</span>
        </LogoutButton>

        <div
          className={`focus-lane-card rounded-[28px] ${isCollapsed ? "flex h-14 w-14 items-center justify-center rounded-2xl p-0" : "p-3.5"}`}
        >
          {isCollapsed ? (
            <span className="focus-lane-body flex h-14 w-14 items-center justify-center rounded-2xl">
              <FocusLaneIcon />
            </span>
          ) : (
            <>
              <p className="focus-lane-label text-[0.68rem] font-semibold uppercase tracking-[0.25em]">
                Focus lane
              </p>
              <p
                className={`focus-lane-body mt-2 text-[0.92rem] font-semibold leading-6 tracking-[-0.03em] ${isCollapsed ? "lg:hidden" : ""}`}
              >
                Keep ideas moving from capture to insight without losing your place.
              </p>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
