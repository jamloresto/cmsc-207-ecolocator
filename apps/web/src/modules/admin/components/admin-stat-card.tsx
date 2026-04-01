import Link from 'next/link';
import clsx from 'clsx';

import type { AdminStatCardProps } from '@/modules/admin';

export function AdminStatCard({
  title,
  value,
  icon: Icon,
  href,
  description,
}: AdminStatCardProps) {
  const CardWrapper = href ? Link : 'div';

  return (
    <CardWrapper
      href={href || '#'}
      className={clsx(
        'group border-border bg-card block rounded-2xl border p-5 transition-all',
        href && 'hover:border-primary hover:shadow-sm',
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm">{title}</p>

          <p className="text-foreground mt-2 text-2xl font-semibold">{value}</p>

          {description && (
            <p className="text-muted-foreground mt-1 text-xs">{description}</p>
          )}
        </div>

        <div className="bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground rounded-xl p-2 transition">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </CardWrapper>
  );
}
