'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { authQueryKeys } from '@/lib/auth-query-keys';
import { loginAdmin, type AdminLoginPayload } from '@/modules/auth';

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; errors?: Record<string, string[]> }
      | undefined;

    if (data?.errors) {
      const firstError = Object.values(data.errors)[0]?.[0];
      if (firstError) return firstError;
    }

    if (data?.message) return data.message;
  }

  return 'Unable to sign in. Please try again.';
}

export function useAdminLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AdminLoginPayload) => loginAdmin(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: authQueryKeys.me,
      });
    },
    meta: {
      getErrorMessage,
    },
  });
}

export { getErrorMessage as getAdminLoginErrorMessage };
