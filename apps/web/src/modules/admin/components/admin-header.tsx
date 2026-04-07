'use client';

import { LogOut } from 'lucide-react';

import { AdminMobileDrawer } from '@/modules/admin';
import { useAdminLogout } from '@/modules/auth';

type AdminHeaderProps = {
  title?: string;
  subtitle?: string;
  role?: 'super_admin' | 'editor';
};

export function AdminHeader({
  title = 'Dashboard',
  subtitle = 'Overview of admin activity and platform data.',
  role = 'super_admin',
}: AdminHeaderProps) {
  const logoutMutation = useAdminLogout();

  function handleLogout() {
    logoutMutation.mutate();
  }

  return (
    <header className="border-border bg-background/95 border-b backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <AdminMobileDrawer role={role} />

          <div>
            <h1 className="text-foreground text-xl font-semibold">{title}</h1>
            <p className="text-muted-foreground text-sm">{subtitle}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="border-border bg-card text-foreground hover:bg-muted inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
