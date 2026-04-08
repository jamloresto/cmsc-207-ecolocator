'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string;
  description?: string;
  error?: string;
  nowrap?: boolean;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, id, label, description, error, disabled, nowrap = false, ...props }, ref) => {
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
          'flex cursor-pointer items-start gap-3',
          disabled && 'cursor-not-allowed opacity-60',
        )}
      >
        <span className="relative mt-0.5 inline-flex h-5 w-5 shrink-0">
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
              'group border-input bg-background peer-focus:ring-ring flex h-5 w-5 items-center justify-center rounded-md border transition',
              'peer-checked:border-primary peer-checked:bg-primary',
              'peer-focus:ring-2 peer-focus:ring-offset-2',
              error && 'border-destructive',
              className,
            )}
          >
            <Check className="h-3.5 w-3.5 text-background" />
          </span>
        </span>

        {(label || description || error) && (
          <span className="flex flex-col gap-1">
            {label ? (
              <span className={cn("text-foreground text-sm font-medium", nowrap && "whitespace-nowrap")}>
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
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';
