'use client';

import { AdminMobileDrawer } from '@/modules/admin';
import { AdminLogoutButton, useAdminLogout } from '@/modules/auth';

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

        <AdminLogoutButton />
      </div>
    </header>
  );
}
