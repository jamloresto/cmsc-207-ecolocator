'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Recycle } from 'lucide-react';
import clsx from 'clsx';

import { ADMIN_NAV_ITEMS } from '@/modules/admin';
import { AdminUserRole } from '@/modules/admin-users';

type AdminSidebarProps = {
  role?: AdminUserRole;
};

export function AdminSidebar({ role }: AdminSidebarProps) {
  const pathname = usePathname();

  const items = ADMIN_NAV_ITEMS.filter((item) => {
    if (item.superAdminOnly && role !== 'super_admin') return false;
    return true;
  });

  return (
    <aside className="md:border-border md:bg-card hidden md:flex md:w-72 md:flex-col md:border-r">
      <div className="border-border border-b px-6 py-5">
        <Link href="/admin" className="block">
          <p className="text-foreground text-lg font-semibold">
            <Recycle className="inline-flex" /> EcoLocator Admin
          </p>
          <p className="text-muted-foreground text-sm">Management Dashboard</p>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {items.map((item) => {
          const isActive = (() => {
            if (item.href === '/admin') return pathname === '/admin';
            return (
              pathname === item.href || pathname.startsWith(`${item.href}/`)
            );
          })();
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-background!'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
