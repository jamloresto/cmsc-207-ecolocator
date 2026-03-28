import { cn } from '@/lib/utils';

type SectionSubheadingProps = {
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
};

export function SectionSubheading({
  title,
  description,
  align = 'left',
  className,
}: SectionSubheadingProps) {
  const isCenter = align === 'center';

  return (
    <div className={cn('space-y-1', isCenter && 'text-center', className)}>
      <h3 className="text-foreground text-lg font-semibold md:text-xl">
        {title}
      </h3>

      {description && (
        <p className="text-muted-foreground text-sm leading-6">{description}</p>
      )}
    </div>
  );
}
