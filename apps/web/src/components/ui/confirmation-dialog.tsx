'use client';

import { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ConfirmationDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
  icon?: ReactNode;
};

export function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  icon,
}: ConfirmationDialogProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
          <div
            className={cn(
              'flex aspect-square h-12 w-12 items-center justify-center rounded-full',
              variant === 'danger'
                ? 'bg-destructive/10 text-destructive'
                : 'bg-primary/10 text-primary',
            )}
          >
            {icon ?? <AlertTriangle className="h-6 w-6" />}
          </div>

          <div className="text-center md:text-left space-y-2">
            <h3 className="text-foreground text-lg font-semibold">{title}</h3>
            <p className="text-muted-foreground text-sm leading-6">
              {description}
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 md:flex-row md:justify-end">
          <Button variant="outline" onClick={onClose}>
            {cancelLabel}
          </Button>

          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
