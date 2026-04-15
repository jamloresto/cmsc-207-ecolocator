import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type = 'text', label, id, placeholder, error, ...props },
    ref,
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    const inputClasses = cn(
      'w-full rounded-lg border px-4 text-sm transition outline-none',
      error
        ? 'border-destructive text-destructive focus:border-destructive focus:ring-destructive/20'
        : 'border-input bg-background text-foreground focus:border-ring focus:ring-ring',
      label ? 'peer pt-6 pb-3' : 'py-3',
      !label && 'placeholder:text-muted-foreground',
      'focus:ring-2',
      className,
    );

    if (!label) {
      return (
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={inputClasses}
          placeholder={placeholder}
          aria-invalid={!!error}
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
          className={inputClasses}
          aria-invalid={!!error}
          {...props}
        />

        <label
          htmlFor={inputId}
          className={cn(
            'absolute top-1/2 left-4 -translate-y-1/2 px-1 text-sm transition-all',
            error ? 'text-destructive' : 'bg-background text-muted-foreground',
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
