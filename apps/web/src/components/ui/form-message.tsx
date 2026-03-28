import { cn } from '@/lib/utils';

type FormMessageProps = {
  message?: string;
  type?: 'default' | 'error' | 'success';
  className?: string;
};

export function FormMessage({
  message,
  type = 'default',
  className,
}: FormMessageProps) {
  if (!message) return null;

  const styles = {
    default: 'text-muted-foreground',
    error: 'text-destructive',
    success: 'text-success',
  };

  return <p className={cn('text-xs', styles[type], className)}>{message}</p>;
}
