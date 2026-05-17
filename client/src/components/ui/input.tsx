import type { RefObject } from "react";

type InputProps = {
  label: string;
  name?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  autoComplete?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  hint?: string;
  autoFocus?: boolean;
  inputRef?: RefObject<HTMLInputElement | null>;
};

export function Input({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  autoComplete,
  disabled = false,
  error,
  className = "",
  hint,
  autoFocus = false,
  inputRef,
}: InputProps) {
  return (
    <label className="block space-y-2.5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-[var(--foreground)]">{label}</span>
        {hint ? <span className="text-xs text-[var(--muted)]">{hint}</span> : null}
      </div>
      <input
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        className={`h-14 w-full rounded-[18px] border px-4 py-3 text-sm text-[var(--foreground)] outline-none transition duration-200 placeholder:text-[var(--field-placeholder)] disabled:cursor-not-allowed disabled:opacity-70 ${
          error
            ? "border-rose-300 bg-rose-50/80 focus-ring"
            : "border-[var(--border)] bg-[var(--field-bg)] focus:bg-[var(--field-bg-focus)] focus-ring"
        } ${className}`}
        disabled={disabled}
        name={name}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        ref={inputRef}
        type={type}
        value={value}
      />
      {error ? (
        <span className="text-sm text-rose-600">{error}</span>
      ) : hint ? (
        <span className="text-xs text-[var(--muted)]">{hint}</span>
      ) : null}
    </label>
  );
}
