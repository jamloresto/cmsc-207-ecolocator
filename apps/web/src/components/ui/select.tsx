'use client';

import { forwardRef, SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

type Option = {
  label: string;
  value: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  options: Option[];
  placeholder?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, placeholder, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(
            'appearance-none',
            'border-input bg-background text-foreground focus:border-ring focus:ring-ring w-full rounded-2xl border px-4 py-3 pr-10 text-sm transition outline-none focus:ring-2',

            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown className="text-muted-foreground pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2" />
      </div>
    );
  },
);

Select.displayName = 'Select';
