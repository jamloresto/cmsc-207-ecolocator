import type { ReactNode } from 'react';

import { AdminHeader, AdminSidebar } from '@/modules/admin';
import { AdminRouteGuard } from '@/modules/auth';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const role: 'super_admin' | 'editor' = 'super_admin';

  return (
    <AdminRouteGuard>
      <div className="bg-muted/40 min-h-screen">
        <div className="flex min-h-screen">
          <AdminSidebar role={role} />

          <div className="flex min-w-0 flex-1 flex-col">
            <AdminHeader role={role} />
            <main className="flex-1 p-4 md:p-6">{children}</main>
          </div>
        </div>
      </div>
    </AdminRouteGuard>
  );
}
