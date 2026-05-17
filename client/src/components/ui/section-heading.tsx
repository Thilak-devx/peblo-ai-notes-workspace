type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
        {eyebrow}
      </p>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--foreground)] md:text-4xl">
          {title}
        </h1>
        <p className="max-w-xl text-sm leading-7 text-[var(--muted)] md:text-base">
          {description}
        </p>
      </div>
    </div>
  );
}
