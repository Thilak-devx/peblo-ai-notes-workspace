"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { appConfig } from "@/config/app";
import { useTheme } from "@/hooks/use-theme";

type BrandProps = {
  tileClassName?: string;
  loginDarkTile?: boolean;
};

export function Brand({ tileClassName = "", loginDarkTile = false }: BrandProps) {
  const { theme } = useTheme();

  const tileStyle: CSSProperties | undefined =
    loginDarkTile && theme === "dark"
      ? {
          backgroundColor: "#162347",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.03), 0 4px 12px rgba(0,0,0,0.18)",
          color: "#f5f7ff",
        }
      : undefined;

  return (
    <Link className="inline-flex items-center gap-3" href="/dashboard">
      <span
        style={tileStyle}
        className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--foreground)] text-sm font-bold text-white ${tileClassName}`}
      >
        PA
      </span>
      <span>
        <span className="block text-sm font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
          Workspace
        </span>
        <span className="block text-base font-semibold tracking-[-0.03em] text-[var(--foreground)]">
          {appConfig.name}
        </span>
      </span>
    </Link>
  );
}
