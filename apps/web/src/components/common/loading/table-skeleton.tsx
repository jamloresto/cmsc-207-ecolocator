import { Skeleton } from '@/components/ui/skeleton';

type TableSkeletonProps = {
  rows?: number;
};

export function TableSkeleton({ rows = 5 }: TableSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border p-4">
        <Skeleton className="h-6 w-40" />
      </div>

      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="grid items-center gap-4 p-4 md:grid-cols-4"
          >
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}