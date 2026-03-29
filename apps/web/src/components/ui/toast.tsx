'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export type ToastItem = {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
};

type ToastProps = ToastItem & {
  onClose: (id: string) => void;
};

const variantStyles: Record<ToastVariant, string> = {
  success: 'border-green-200 bg-green-50 text-green-900',
  error: 'border-red-200 bg-red-50 text-red-900',
  info: 'border-blue-200 bg-blue-50 text-blue-900',
  warning: 'border-yellow-200 bg-yellow-50 text-yellow-900',
};

export function Toast({
  id,
  title,
  description,
  variant = 'info',
  onClose,
}: ToastProps) {
  return (
    <div
      className={cn(
        'relative w-full rounded-lg border p-4 shadow-lg backdrop-blur-sm',
        'flex items-start gap-3',
        variantStyles[variant],
      )}
      role="status"
      aria-live="polite"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        {description ? (
          <p className="mt-1 text-sm opacity-90">{description}</p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => onClose(id)}
        className="absolute p-2 right-2 top-2 inline-flex items-center justify-center rounded-full transition hover:bg-black/10"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
