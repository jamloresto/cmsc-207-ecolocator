import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'border-border bg-card flex min-h-60 flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-10 text-center',
        className,
      )}
    >
      {icon ? <div className="text-primary mb-4">{icon}</div> : null}

      <h3 className="text-foreground text-lg font-semibold">{title}</h3>

      {description ? (
        <p className="text-muted-foreground mt-2 max-w-md text-sm">
          {description}
        </p>
      ) : null}

      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
