'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getAdminUsers,
  type AdminUsersQueryParams,
} from '@/modules/admin-users';

export function useAdminUsers(params: AdminUsersQueryParams) {
  console.log("Admin Users: ", params)
  return useQuery({
    queryKey: ['admin-users', params],
    queryFn: () => getAdminUsers(params),
  });
}
