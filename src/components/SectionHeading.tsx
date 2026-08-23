interface SectionHeadingProps {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  className?: string;
}

const SectionHeading = ({
  index,
  eyebrow,
  title,
  description,
  className = '',
}: SectionHeadingProps) => (
  <div className={`reveal max-w-3xl ${className}`}>
    <div className="mb-6 flex items-center gap-4">
      <span className="font-display text-sm tracking-[0.2em] text-primary">{index}</span>
      <span className="h-px w-10 bg-border" />
      <span className="text-[12px] uppercase tracking-[0.24em] text-muted-foreground">
        {eyebrow}
      </span>
    </div>
    <h2 className="rule-title text-[clamp(30px,4.4vw,54px)] leading-[1.04]">{title}</h2>
    {description ? (
      <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
        {description}
      </p>
    ) : null}
  </div>
);

export default SectionHeading;
