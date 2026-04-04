import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type TableSkeletonProps = {
  column?: number;
  rows?: number;
};

export function TableSkeleton({ column = 4, rows = 5 }: TableSkeletonProps) {
  return (
    <div className="border-border bg-card overflow-hidden border w-full">
      <div className="divide-border divide-y">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className={cn('grid items-center gap-4 p-4')}
            style={{
              gridTemplateColumns: `repeat(${column}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: column }).map((_, cellIndex) => (
              <Skeleton
                key={cellIndex}
                className={cn(
                  'h-4',
                  cellIndex === column - 1 ? 'w-24' : 'w-3/4',
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
