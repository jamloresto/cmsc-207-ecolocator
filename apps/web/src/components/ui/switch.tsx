'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string;
  description?: string;
  error?: string;
};

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, id, label, description, error, disabled, ...props }, ref) => {
    const generatedId =
      id ??
      label
        ?.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');

    return (
      <label
        htmlFor={generatedId}
        className={cn(
          'flex cursor-pointer items-start justify-between gap-4',
          disabled && 'cursor-not-allowed opacity-60',
        )}
      >
        {(label || description || error) && (
          <span className="flex flex-col gap-1">
            {label ? (
              <span className="text-foreground text-sm font-medium">
                {label}
              </span>
            ) : null}

            {description && !error ? (
              <span className="text-muted-foreground text-sm leading-5">
                {description}
              </span>
            ) : null}

            {error ? (
              <span className="text-destructive text-sm leading-5">
                {error}
              </span>
            ) : null}
          </span>
        )}

        <span className="relative inline-flex shrink-0">
          <input
            ref={ref}
            id={generatedId}
            type="checkbox"
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />

          <span
            className={cn(
              'bg-muted peer-focus:ring-ring relative inline-flex h-6 w-11 rounded-full transition',
              'peer-checked:bg-primary',
              'peer-focus:ring-2 peer-focus:ring-offset-2',
              'after:bg-background after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:shadow-sm after:transition-transform after:duration-200',
              'peer-checked:after:translate-x-5',
              error && 'ring-destructive ring-1',
              className,
            )}
          />
        </span>
      </label>
    );
  },
);

Switch.displayName = 'Switch';
