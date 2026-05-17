import type { ReactNode } from "react";
import { Brand } from "@/components/layout/brand";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  brandTileClassName?: string;
  loginDarkTile?: boolean;
};

export function AuthShell({
  title,
  description,
  children,
  brandTileClassName,
  loginDarkTile = false,
}: AuthShellProps) {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-10 px-5 py-6 sm:px-6 sm:py-8 lg:flex-row lg:items-center">
      <section className="page-fade flex-1 space-y-8">
        <Brand loginDarkTile={loginDarkTile} tileClassName={brandTileClassName} />
        <SectionHeading
          eyebrow="Client App"
          title={title}
          description={description}
        />
        <div className="grid gap-4 md:grid-cols-2">
          {[
            "App Router structure with dedicated auth and app route groups.",
            "Shared UI primitives to keep future feature work consistent.",
            "Tailwind-driven visual system ready for reusable product surfaces.",
            "Axios client preconfigured for backend communication.",
          ].map((item) => (
            <Card className="p-5" key={item}>
              <p className="text-sm leading-7 text-[var(--muted)]">{item}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="w-full max-w-xl">
        <Card className="rounded-[36px] bg-[var(--surface-strong)] p-7 shadow-[0_32px_72px_-42px_var(--shadow)] md:p-10">
          {children}
        </Card>
      </section>
    </main>
  );
}
