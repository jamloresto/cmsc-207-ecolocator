'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { Toast, ToastItem, ToastVariant } from '@/components/ui/toast';

type ToastInput = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

type ToastContextType = {
  toast: (input: ToastInput) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const DEFAULT_TOAST_DURATION = 4000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, variant = 'info', duration }: ToastInput) => {
      const id = crypto.randomUUID();
      const resolvedDuration = duration ?? DEFAULT_TOAST_DURATION;
      const showProgress = duration !== undefined;

      setToasts((prev) => [
        ...prev,
        {
          id,
          title,
          description,
          variant,
          duration: resolvedDuration,
          showProgress,
        },
      ]);

      window.setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, resolvedDuration);
    },
    [],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed top-4 right-4 z-100 flex w-full max-w-sm flex-col gap-3">
        {toasts.map((item) => (
          <div key={item.id} className="pointer-events-auto">
            <Toast {...item} onClose={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }

  return context;
}
