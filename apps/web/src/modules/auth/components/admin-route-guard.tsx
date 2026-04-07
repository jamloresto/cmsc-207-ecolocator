'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { useAdminMe } from '@/modules/auth';
import { AdminUserRole } from '@/modules/admin-users';

type AdminRouteGuardProps = {
  children: ReactNode;
  allowedRoles?: AdminUserRole;
};

export function AdminRouteGuard({
  children,
  allowedRoles,
}: AdminRouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { data, isLoading, isError } = useAdminMe(true);

  useEffect(() => {
    if (isLoading) return;

    if (isError || !data?.user) {
      router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (allowedRoles?.length && !allowedRoles.includes(data.user.role)) {
      router.replace('/admin');
    }
  }, [allowedRoles, data?.user, isError, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (isError || !data?.user) {
    return null;
  }

  if (allowedRoles?.length && !allowedRoles.includes(data.user.role)) {
    return null;
  }

  return <>{children}</>;
}
