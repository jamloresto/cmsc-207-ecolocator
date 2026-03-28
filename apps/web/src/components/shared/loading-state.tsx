import { cn } from '@/lib/utils';

type LoadingStateProps = {
  message?: string;
  className?: string;
};

export function LoadingState({
  message = 'Loading...',
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        'border-border bg-card flex flex-col items-center justify-center gap-4 rounded-3xl border p-8 text-center md:p-10',
        className,
      )}
    >
      <div className="border-foreground border-t-card! border-dotted! h-10 w-10 animate-spin rounded-full border-4" />

      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
}
