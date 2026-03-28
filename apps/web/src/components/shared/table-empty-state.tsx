import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type TableEmptyStateProps = {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  colSpan?: number;
  className?: string;
};

export function TableEmptyState({
  title = 'No data found',
  description = 'There are no records to display right now.',
  icon,
  action,
  colSpan = 1,
  className,
}: TableEmptyStateProps) {
  return (
    <tr className={cn(className)}>
      <td colSpan={colSpan} className="p-0">
        <div className="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
          {icon ? (
            <div className="text-primary bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
              {icon}
            </div>
          ) : null}

          <div className="space-y-1">
            <h3 className="text-foreground text-base font-semibold md:text-lg">
              {title}
            </h3>
            <p className="text-muted-foreground text-sm leading-6">
              {description}
            </p>
          </div>

          {action ? <div>{action}</div> : null}
        </div>
      </td>
    </tr>
  );
}
