'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authQueryKeys } from '@/lib/auth-query-keys';
import { logoutAdmin } from '@/modules/auth';

export function useAdminLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutAdmin,
    onSuccess: async () => {
      await queryClient.removeQueries({
        queryKey: authQueryKeys.me,
      });
    },
  });
}
