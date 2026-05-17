type TextareaProps = {
  label: string;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  rows?: number;
  hint?: string;
  className?: string;
};

export function Textarea({
  label,
  name,
  placeholder,
  value,
  onChange,
  disabled = false,
  rows = 12,
  hint,
  className = "",
}: TextareaProps) {
  return (
    <label className="block space-y-2.5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-[var(--foreground)]">{label}</span>
        {hint ? <span className="text-xs text-[var(--muted)]">{hint}</span> : null}
      </div>
      <textarea
        className={`premium-scrollbar min-h-48 w-full resize-none rounded-[18px] border border-[var(--border)] bg-[var(--field-bg)] px-4 py-4 text-sm leading-7 text-[var(--foreground)] outline-none transition duration-200 placeholder:text-[var(--field-placeholder)] focus:bg-[var(--field-bg-focus)] focus-ring disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
        disabled={disabled}
        name={name}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        value={value}
      />
      {hint ? <span className="text-xs text-[var(--muted)]">{hint}</span> : null}
    </label>
  );
}
