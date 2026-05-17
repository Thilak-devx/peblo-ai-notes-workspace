"use client";

import { useTheme } from "@/hooks/use-theme";

function SunIcon() {
  return (
    <svg aria-hidden className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2.75V5.25M12 18.75V21.25M21.25 12H18.75M5.25 12H2.75M18.54 5.46L16.77 7.23M7.23 16.77L5.46 18.54M18.54 18.54L16.77 16.77M7.23 7.23L5.46 5.46"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg aria-hidden className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M20.2 14.3A8.25 8.25 0 1 1 9.7 3.8a7 7 0 1 0 10.5 10.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      aria-label="Toggle dark mode"
      className="lift-hover flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] text-sm text-[var(--foreground)] transition duration-200 hover:bg-[var(--surface-strong)]"
      onClick={toggleTheme}
      type="button"
    >
      {theme === "light" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}
