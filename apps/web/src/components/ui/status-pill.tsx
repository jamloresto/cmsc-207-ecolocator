import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type StatusType =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'new'
  | 'read'
  | 'replied'
  | 'archived';

type StatusPillProps = HTMLAttributes<HTMLSpanElement> & {
  status: StatusType;
};

const statusStyles: Record<StatusType, string> = {
  active: 'bg-success/10 text-success border border-success/20',
  inactive: 'bg-muted text-muted-foreground border border-border',
  pending: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  approved: 'bg-success/10 text-success border border-success/20',
  rejected: 'bg-destructive/10 text-destructive border border-destructive/20',
  new: 'bg-primary/10 text-primary border border-primary/20',
  read: 'bg-muted text-muted-foreground border border-border',
  replied: 'bg-secondary text-secondary-foreground border border-transparent',
  archived: 'bg-slate-100 text-slate-600 border border-slate-200',
};

const statusLabels: Record<StatusType, string> = {
  active: 'Active',
  inactive: 'Inactive',
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  new: 'New',
  read: 'Read',
  replied: 'Replied',
  archived: 'Archived',
};

export function StatusPill({
  status,
  className,
  children,
  ...props
}: StatusPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium',
        statusStyles[status],
        className,
      )}
      {...props}
    >
      <span className="h-2 w-2 rounded-full bg-current opacity-70" />
      <span>{children ?? statusLabels[status]}</span>
    </span>
  );
}
