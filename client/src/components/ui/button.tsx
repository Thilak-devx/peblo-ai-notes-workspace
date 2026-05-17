import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
};

const variantClasses = {
  primary:
    "bg-[linear-gradient(180deg,#ff9a73_0%,#ff6b35_100%)] text-white border border-white/8 shadow-[0_10px_30px_rgba(255,107,53,0.22)] hover:-translate-y-[1px] active:scale-[0.99] focus-ring",
  secondary:
    "border border-[var(--border)] bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] hover:bg-[var(--button-secondary-bg-hover)] hover:-translate-y-[1px] active:scale-[0.99] focus-ring",
  ghost:
    "text-[var(--muted)] hover:bg-[var(--button-ghost-hover)] hover:text-[var(--foreground)] hover:-translate-y-[1px] active:scale-[0.99] focus-ring",
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
  onClick,
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-[18px] px-5 py-3 text-sm font-semibold transition-[background-color,border-color,transform,box-shadow,color] duration-200 disabled:cursor-not-allowed disabled:opacity-55 ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} disabled={disabled} onClick={onClick} type={type}>
      {children}
    </button>
  );
}
