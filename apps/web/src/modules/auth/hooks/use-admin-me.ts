'use client';

import { useQuery } from '@tanstack/react-query';
import { getAdminMe } from '@/modules/auth';

export function useAdminMe() {
  return useQuery({
    queryKey: ['admin', 'me'],
    queryFn: getAdminMe,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}
