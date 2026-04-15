import { forwardRef, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, id, rows = 5, error, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    const textareaClasses = cn(
      'w-full rounded-lg border text-sm transition outline-none focus:ring-2',
      error
        ? 'border-destructive text-destructive focus:border-destructive focus:ring-destructive/20'
        : 'border-input bg-background text-foreground focus:border-ring focus:ring-ring',
      label ? 'peer px-4 pt-6 pb-3' : 'px-4 py-3',
      !label && 'placeholder:text-muted-foreground',
      className,
    );

    if (!label) {
      return (
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={textareaClasses}
          aria-invalid={!!error}
          {...props}
        />
      );
    }

    return (
      <div className="relative w-full">
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          placeholder=" "
          className={textareaClasses}
          aria-invalid={!!error}
          {...props}
        />

        <label
          htmlFor={textareaId}
          className={cn(
            'absolute left-4 px-1 text-sm transition-all',
            error ? 'text-destructive' : 'bg-background text-muted-foreground',
            'top-6',
            'peer-focus:top-2 peer-focus:text-xs',
            'peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs',
          )}
        >
          {label}
        </label>
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
