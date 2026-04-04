import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export function TableContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'border-border bg-card overflow-hidden rounded-2xl border',
        className,
      )}
    >
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function Table({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <table className={cn('min-w-full border-collapse', className)}>
      {children}
    </table>
  );
}

export function TableHead({ children }: { children: ReactNode }) {
  return <thead className="bg-muted/40">{children}</thead>;
}

export function TableRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <tr
      className={cn('border-border border-t align-top transition', className)}
    >
      {children}
    </tr>
  );
}

export function TableHeaderCell({ children }: { children: ReactNode }) {
  return (
    <th className="text-foreground px-4 py-3 text-left text-sm font-semibold">
      {children}
    </th>
  );
}

export function TableCell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <td className={cn('px-4 py-4 text-sm', className)}>{children}</td>;
}

export function SortableHeader({
  label,
  field,
  sortBy,
  sortOrder,
  onSort,
}: {
  label: string;
  field: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: string) => void;
}) {
  const isActive = sortBy === field;

  return (
    <button
      type="button"
      onClick={() => onSort?.(field)}
      className="hover:text-primary flex items-center gap-1 transition"
    >
      {label}
      {isActive ? (
        <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
      ) : null}
    </button>
  );
}