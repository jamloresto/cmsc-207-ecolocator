'use client';

import { useQuery } from '@tanstack/react-query';
import { getAdminMe } from '@/modules/auth';
import { authQueryKeys } from '@/lib/auth-query-keys';

export function useAdminMe(enabled = true) {
  return useQuery({
    queryKey: authQueryKeys.me,
    queryFn: getAdminMe,
    enabled,
    retry: false,
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
  });
}
