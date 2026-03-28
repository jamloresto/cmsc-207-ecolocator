import { cn } from '@/lib/utils';

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: SectionHeadingProps) {
  const isCenter = align === 'center';

  return (
    <div
      className={cn(
        'space-y-3',
        isCenter && 'mx-auto max-w-3xl text-center',
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-primary text-sm font-semibold tracking-[0.16em] uppercase">
          {eyebrow}
        </p>
      ) : null}

      <h2 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
        {title}
      </h2>

      {description ? (
        <p className="text-muted-foreground text-base leading-7 md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
