import { LabelHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean;
};

export function Label({
  children,
  className,
  required = false,
  ...props
}: LabelProps) {
  return (
    <label
      className={cn('text-foreground text-sm font-medium', className)}
      {...props}
    >
      {children}
      {required && <span className="text-destructive ml-1">*</span>}
    </label>
  );
}
