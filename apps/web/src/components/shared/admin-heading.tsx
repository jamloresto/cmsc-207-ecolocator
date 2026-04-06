import { cn } from '@/lib/utils';

type AdminHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
};

export function AdminHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: AdminHeadingProps) {
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

      <h2 className="text-foreground text-2xl font-bold tracking-tight">
        {title}
      </h2>

      {description ? (
        <p className="text-muted-foreground text-sm">{description}</p>
      ) : null}
    </div>
  );
}
