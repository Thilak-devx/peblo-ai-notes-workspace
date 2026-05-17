"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isBootstrapping } = useAuth();
  const nextPath = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

  useEffect(() => {
    if (!isBootstrapping && !isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
    }
  }, [isAuthenticated, isBootstrapping, nextPath, router]);

  if (isBootstrapping) {
    return (
      <div className="glass-panel flex min-h-[60vh] items-center justify-center rounded-[32px] px-6 py-16">
        <div className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--accent)]">
            Authenticating
          </p>
          <p className="text-lg font-semibold tracking-[-0.03em] text-[var(--foreground)]">
            Restoring your workspace session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
