import { ReactNode } from 'react';

import { AdminRouteGuard } from '@/modules/auth';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminRouteGuard>{children}</AdminRouteGuard>;
}
