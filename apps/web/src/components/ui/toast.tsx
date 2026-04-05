'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastVariant = 'success' | 'info' | 'warning' | 'danger';

export type ToastItem = {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration: number;
  showProgress: boolean;
};

type ToastProps = ToastItem & {
  onClose: (id: string) => void;
};

const variantClasses: Record<ToastVariant, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  info: 'border-slate-200 bg-white text-slate-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
  danger: 'border-red-200 bg-red-50 text-red-900',
};

const progressBarClasses: Record<ToastVariant, string> = {
  success: 'bg-emerald-500',
  info: 'bg-slate-900',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
};

export function Toast({
  id,
  title,
  description,
  variant,
  duration,
  showProgress,
  onClose,
}: ToastProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border shadow-lg',
        variantClasses[variant],
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{title}</p>

          {description ? (
            <p className="mt-1 text-sm opacity-90">{description}</p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => onClose(id)}
          className="rounded-md p-1 opacity-70 transition hover:bg-black/5 hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {showProgress ? (
        <div className="absolute bottom-0 left-0 h-1 w-full bg-black/5">
          <div
            className={cn(
              'animate-toast-progress h-full origin-left',
              progressBarClasses[variant],
            )}
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      ) : null}
    </div>
  );
}
