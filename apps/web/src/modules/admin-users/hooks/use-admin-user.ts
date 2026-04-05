'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getAdminUser,
  type AdminUserApiResponse
} from '@/modules/admin-users';

export function useAdminUser(userId: number) {
  return useQuery<AdminUserApiResponse>({
    queryKey: ['admin-user', userId],
    queryFn: () => getAdminUser(userId),
    enabled: Number.isFinite(userId),
  });
}
