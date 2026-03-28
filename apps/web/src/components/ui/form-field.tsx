import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { FormMessage } from '@/components/ui/form-message';

type FormFieldProps = {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  helperText?: string;
  error?: string;
  children: ReactNode;
  className?: string;
};

export function FormField({
  label,
  htmlFor,
  required = false,
  helperText,
  error,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label ? (
        <Label htmlFor={htmlFor} required={required}>
          {label}
        </Label>
      ) : null}

      {children}

      {error ? (
        <FormMessage type="error" message={error} />
      ) : (
        <FormMessage message={helperText} />
      )}
    </div>
  );
}
