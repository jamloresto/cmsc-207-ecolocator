import { apiClient } from '@/lib/api-client';
import type {
  AdminUserApiResponse,
  AdminUsersQueryParams,
  CreateAdminUserPayload,
  PaginatedAdminUsersResponse,
} from '@/modules/admin-users';

export async function getAdminUsers(
  params: AdminUsersQueryParams = {},
): Promise<PaginatedAdminUsersResponse> {
  const response = await apiClient.get('/api/v1/admin/users', { params });
  return response.data;
}

export async function createAdminUser(
  payload: CreateAdminUserPayload,
): Promise<AdminUserApiResponse> {
  const response = await apiClient.post<AdminUserApiResponse>(
    '/api/v1/admin/users',
    payload,
  );

  return response.data;
}
