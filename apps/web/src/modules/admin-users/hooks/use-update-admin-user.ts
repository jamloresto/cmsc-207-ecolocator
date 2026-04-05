'use client';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import type { ApiErrorResponse } from '@/types/api.types';
import {
  updateAdminUser,
  type AdminUserApiResponse,
  type UpdateAdminUserPayload,
} from '@/modules/admin-users';

type UpdateAdminUserInput = {
  userId: number;
  payload: UpdateAdminUserPayload;
};

export function useUpdateAdminUser() {
  return useMutation<
    AdminUserApiResponse,
    AxiosError<ApiErrorResponse>,
    UpdateAdminUserInput
  >({
    mutationFn: ({ userId, payload }) => updateAdminUser(userId, payload),
  });
}
