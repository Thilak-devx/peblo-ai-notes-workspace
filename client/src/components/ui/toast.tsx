"use client";

type ToastProps = {
  message: string;
  variant?: "success" | "error";
};

const variantClasses = {
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/12 dark:text-emerald-200",
  error:
    "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/12 dark:text-rose-200",
};

export function Toast({ message, variant = "success" }: ToastProps) {
  return (
    <div
      aria-live="polite"
      className={`page-fade fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur ${variantClasses[variant]}`}
    >
      {message}
    </div>
  );
}
