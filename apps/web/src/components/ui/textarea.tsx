import { forwardRef, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, id, rows = 5, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    if (!label) {
      return (
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            'border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring w-full rounded-lg border px-4 py-3 text-sm transition outline-none focus:ring-2',
            className,
          )}
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
          className={cn(
            'peer border-input bg-background text-foreground focus:border-ring focus:ring-ring w-full rounded-lg border px-4 pt-6 pb-3 text-sm transition outline-none focus:ring-2',
            className,
          )}
          {...props}
        />

        <label
          htmlFor={textareaId}
          className="bg-background text-muted-foreground absolute top-6 left-4 px-1 text-sm transition-all peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs peer-focus:top-2 peer-focus:text-xs"
        >
          {label}
        </label>
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
