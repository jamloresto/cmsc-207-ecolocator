import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@/components/shared/table';
import { cn } from '@/lib/utils';

type TableSkeletonProps = {
  columns?: number;
  rows?: number;
  showHeader?: boolean;
};

export function TableSkeleton({
  columns = 4,
  rows = 5,
  showHeader = true,
}: TableSkeletonProps) {
  return (
    <TableContainer>
      <Table>
        {showHeader ? (
          <TableHead>
            <TableRow className="border-t-0">
              {Array.from({ length: columns }).map((_, index) => (
                <TableHeaderCell key={index}>
                  <Skeleton
                    className={cn(
                      'h-4',
                      index === columns - 1 ? 'w-18' : 'w-22',
                    )}
                  />
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHead>
        ) : null}

        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columns }).map((_, cellIndex) => (
                <TableCell key={cellIndex}>
                  <Skeleton
                    className={cn(
                      'h-4',
                      cellIndex === columns - 1
                        ? 'w-24'
                        : cellIndex === 0
                          ? 'w-32'
                          : 'w-3/4',
                    )}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
}
