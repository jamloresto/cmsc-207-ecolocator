import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, id, placeholder, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    if (!label) {
      return (
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            'border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring w-full rounded-lg border px-4 py-3 text-sm transition outline-none focus:ring-2',
            className,
          )}
          placeholder={placeholder}
          {...props}
        />
      );
    }

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          id={inputId}
          type={type}
          placeholder=" "
          className={cn(
            'peer border-input bg-background text-foreground focus:border-ring focus:ring-ring w-full rounded-lg border px-4 pt-6 pb-3 text-sm transition outline-none focus:ring-2',
            className,
          )}
          {...props}
        />

        <label
          htmlFor={inputId}
          className={cn(
            'bg-background text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2 px-1 text-sm transition-all',
            'peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm',
            'peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs',
            'peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:text-xs',
          )}
        >
          {label}
        </label>
      </div>
    );
  },
);

Input.displayName = 'Input';
