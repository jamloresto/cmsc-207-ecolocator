'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Recycle, X } from 'lucide-react';
import clsx from 'clsx';

import { ThemeToggle } from '@/components/theme/theme-toggle';

import { ADMIN_NAV_ITEMS } from '@/modules/admin';

type AdminMobileDrawerProps = {
  role?: 'super_admin' | 'editor';
};

export function AdminMobileDrawer({
  role = 'super_admin',
}: AdminMobileDrawerProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const items = ADMIN_NAV_ITEMS.filter((item) => {
    if (item.superAdminOnly && role !== 'super_admin') return false;
    return true;
  });

  const drawer = (
    <div className="fixed inset-0 z-100 md:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={() => setOpen(false)}
        aria-label="Close admin menu overlay"
      />

      <div className="bg-card absolute top-0 left-0 z-101 flex h-full w-72 flex-col shadow-xl">
        <div className="border-border flex items-center justify-between border-b px-5 py-4">
          <div>
            <p className="text-foreground text-base font-semibold">
              <Recycle className="inline-flex" /> EcoLocator Admin
            </p>
            <p className="text-muted-foreground text-sm">
              Management Dashboard
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="border-border text-foreground inline-flex h-10 w-10 items-center justify-center rounded-lg border"
            aria-label="Close admin menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {items.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
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

        <div className="fixed bottom-8 left-8">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border-border bg-background text-foreground inline-flex h-10 w-10 items-center justify-center rounded-lg border md:hidden"
        aria-label="Open admin menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mounted && open ? createPortal(drawer, document.body) : null}
    </>
  );
}
