import Link from "next/link";
import { Button } from "@/components/ui/button";
import { appConfig } from "@/config/app";

type WorkspaceHeaderProps = {
  title: string;
  subtitle: string;
};

export function WorkspaceHeader({
  title,
  subtitle,
}: WorkspaceHeaderProps) {
  return (
    <header className="workspace-hero page-fade relative flex flex-col justify-center gap-6 overflow-hidden rounded-[28px] px-10 py-9 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 items-start gap-4">
        <Link className="shrink-0" href="/dashboard">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f3f5fb] text-base font-semibold text-[#0b1733] dark:border dark:border-white/5 dark:bg-[#162347] dark:text-[#f5f7ff] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_4px_12px_rgba(0,0,0,0.18)]">
            PA
          </span>
        </Link>

        <div className="min-w-0">
          <p className="workspace-hero-label mb-1 text-[13px] font-medium uppercase tracking-[0.28em]">
            Workspace
          </p>
          <p className="workspace-hero-name text-base font-semibold tracking-[-0.03em]">
            {appConfig.name}
          </p>
          <h1 className="workspace-hero-title mt-2 text-[30px] font-semibold leading-tight tracking-[-0.04em]">
            {title}
          </h1>
          <p className="workspace-hero-description mt-5 max-w-[780px] text-[18px] leading-8">{subtitle}</p>
        </div>
      </div>

      <span
        aria-hidden
        className="workspace-hero-divider absolute bottom-0 left-10 right-10 h-px"
      />

      <div className="flex flex-wrap gap-2.5 md:justify-end">
        <Button
          className="workspace-hero-secondary"
          href="/login"
          variant="secondary"
        >
          Preview auth
        </Button>
        <Button className="bg-[#ff8a5b] text-white hover:bg-[#ff9a73]" href="/notes">
          Open notes shell
        </Button>
      </div>
    </header>
  );
}
