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
        'border-border bg-card flex flex-col items-center justify-center gap-4 rounded-3xl border p-8 text-center md:p-10',
        className,
      )}
    >
      {icon ? (
        <div className="text-primary bg-primary/10 flex h-14 w-14 items-center justify-center rounded-full">
          {icon}
        </div>
      ) : null}

      <div className="space-y-2">
        <h3 className="text-foreground text-lg font-semibold md:text-xl">
          {title}
        </h3>

        {description ? (
          <p className="text-muted-foreground max-w-xl text-sm leading-6">
            {description}
          </p>
        ) : null}
      </div>

      {action ? <div>{action}</div> : null}
    </div>
  );
}
