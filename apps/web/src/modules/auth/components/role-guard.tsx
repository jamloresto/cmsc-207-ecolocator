'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { AdminUserRole } from '@/modules/admin-users';
import { useAdminMe } from '@/modules/auth';

type RoleGuardProps = {
  children: ReactNode;
  allowedRoles: AdminUserRole[];
  redirectTo?: string;
};

export function RoleGuard({
  children,
  allowedRoles,
  redirectTo = '/admin',
}: RoleGuardProps) {
  const router = useRouter();
  const { data, isLoading } = useAdminMe();

  const user = data?.user;
  const hasAccess = !!user && allowedRoles.includes(user.role as AdminUserRole);

  useEffect(() => {
    if (!isLoading && user && !hasAccess) {
      router.replace(redirectTo);
    }
  }, [hasAccess, isLoading, redirectTo, router, user]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground text-sm">Checking permissions...</p>
      </div>
    );
  }

  if (!user || !hasAccess) {
    return null;
  }

  return <>{children}</>;
}
