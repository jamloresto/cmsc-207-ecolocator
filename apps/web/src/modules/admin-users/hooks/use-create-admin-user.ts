'use client';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import {
  createAdminUser,
  type AdminUserApiResponse,
  type CreateAdminUserPayload,
} from '@/modules/admin-users';
import { ApiErrorResponse } from '@/types/api.types';

export function useCreateAdminUser() {
  return useMutation<
    AdminUserApiResponse,
    AxiosError<ApiErrorResponse>,
    CreateAdminUserPayload
  >({
    mutationFn: createAdminUser,
  });
}
