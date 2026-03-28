'use client';

import { ReactNode } from 'react';
import { Search } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

type TableToolbarProps = {
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  filters?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function TableToolbar({
  searchValue = '',
  searchPlaceholder = 'Search...',
  onSearchChange,
  filters,
  actions,
  className,
}: TableToolbarProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className="w-full md:max-w-md">
        <div className="relative">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />

          <Input
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-11"
          />
        </div>
      </div>

      {(filters || actions) && (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
          {filters ? (
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              {filters}
            </div>
          ) : null}

          {actions ? (
            <div className="flex items-center gap-3">{actions}</div>
          ) : null}
        </div>
      )}
    </div>
  );
}
