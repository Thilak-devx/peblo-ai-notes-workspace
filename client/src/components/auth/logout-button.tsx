"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

type LogoutButtonProps = {
  className?: string;
  children?: ReactNode;
};

export function LogoutButton({
  className = "",
  children,
}: LogoutButtonProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      className={`w-full ${className}`}
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await logout();
          router.push("/login");
          router.refresh();
        });
      }}
      variant="secondary"
    >
      {isPending ? "Logging out..." : children || "Logout"}
    </Button>
  );
}
