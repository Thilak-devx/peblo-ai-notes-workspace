"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isBootstrapping } = useAuth();

  useEffect(() => {
    if (!isBootstrapping && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isBootstrapping, router]);

  if (isBootstrapping) {
    return (
      <div className="rounded-[36px] bg-[var(--surface-strong)] p-8 text-sm text-[var(--muted)]">
        Checking your current session...
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
