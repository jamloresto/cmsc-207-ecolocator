'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useAdminMe } from '@/modules/auth';

type Props = {
  children: ReactNode;
};

export function AdminRouteGuard({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === '/admin/login';

  const { data, isLoading, isError } = useAdminMe();

  useEffect(() => {
    if (isLoginPage) {
      if (!isLoading && data?.user) {
        router.replace('/admin');
      }
      return;
    }

    if (!isLoading && (isError || !data?.user)) {
      router.replace('/admin/login');
    }
  }, [data, isError, isLoading, isLoginPage, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading admin panel...</p>
      </div>
    );
  }

  if (!data?.user && !isLoginPage) {
    return null;
  }

  return <>{children}</>;
}
