import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`glass-panel lift-hover rounded-[28px] p-5 md:p-6 ${className}`}>{children}</div>
  );
}
