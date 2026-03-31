import { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ErrorStateProps = {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function ErrorState({
  title = 'Something went wrong',
  description = 'We were unable to load the data. Please try again.',
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'border-border bg-card flex min-h-60 flex-col items-center justify-center rounded-2xl border px-6 py-10 text-center',
        className,
      )}
    >
      <AlertCircle className="text-destructive mb-4 h-10 w-10" />

      <h3 className="text-foreground text-lg font-semibold">{title}</h3>

      <p className="text-muted-foreground mt-2 max-w-md text-sm">
        {description}
      </p>

      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
