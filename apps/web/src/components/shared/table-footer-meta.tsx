'use client';

import { Pagination } from '@/components/shared/pagination';
import { cn } from '@/lib/utils';

type TableFooterMetaProps = {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  singularLabel: string;
  className?: string;
  onPageChange: (page: number) => void;
};

export function TableFooterMeta({
  currentPage,
  totalPages,
  totalItems,
  singularLabel,
  className,
  onPageChange,
}: TableFooterMetaProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 md:flex-row md:items-center md:justify-between',
        className,
      )}
    >
      <p className="text-muted-foreground text-sm">
        {typeof totalItems === 'number'
          ? `${totalItems} ${singularLabel}${totalItems === 1 ? '' : 's'} found`
          : null}
      </p>

      {totalPages > 1 ? (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      ) : null}
    </div>
  );
}