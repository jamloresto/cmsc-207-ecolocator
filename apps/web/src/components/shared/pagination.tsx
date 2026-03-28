import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

type PaginationButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isActive?: boolean;
};

function PaginationButton({
  className,
  isActive = false,
  ...props
}: PaginationButtonProps) {
  return (
    <button
      className={cn(
        'border-border bg-background text-foreground hover:bg-muted inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50',
        isActive &&
          'bg-primary text-primary-foreground border-primary hover:bg-primary',
        className,
      )}
      {...props}
    />
  );
}

function getPageNumbers(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 'ellipsis-right'] as const;
  }

  if (currentPage >= totalPages - 2) {
    return [
      'ellipsis-left',
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ] as const;
  }

  return [
    'ellipsis-left',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    'ellipsis-right',
  ] as const;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div
      className={cn(
        'flex flex-col gap-4 md:flex-row md:items-center md:justify-between',
        className,
      )}
    >
      <p className="text-muted-foreground text-sm">
        Page <span className="text-foreground font-medium">{currentPage}</span>{' '}
        of <span className="text-foreground font-medium">{totalPages}</span>
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <PaginationButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </PaginationButton>

        {pages.map((page, index) =>
          typeof page === 'number' ? (
            <PaginationButton
              key={page}
              isActive={page === currentPage}
              onClick={() => onPageChange(page)}
            >
              {page}
            </PaginationButton>
          ) : (
            <span
              key={`${page}-${index}`}
              className="text-muted-foreground inline-flex h-10 min-w-10 items-center justify-center text-sm"
            >
              ...
            </span>
          ),
        )}

        <PaginationButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </PaginationButton>
      </div>
    </div>
  );
}
