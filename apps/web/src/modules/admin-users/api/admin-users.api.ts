import { apiClient } from '@/lib/api-client';
import type {
  AdminUserApiResponse,
  AdminUsersQueryParams,
  CreateAdminUserPayload,
  PaginatedAdminUsersResponse,
  UpdateAdminUserPayload,
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

export async function getAdminUser(userId: number): Promise<AdminUserApiResponse> {
  const response = await apiClient.get<AdminUserApiResponse>(
    `/api/v1/admin/users/${userId}`,
  );

  return response.data;
}

export async function updateAdminUser(
  userId: number,
  payload: UpdateAdminUserPayload,
): Promise<AdminUserApiResponse> {
  const response = await apiClient.put<AdminUserApiResponse>(
    `/api/v1/admin/users/${userId}`,
    payload,
  );

  return response.data;
}