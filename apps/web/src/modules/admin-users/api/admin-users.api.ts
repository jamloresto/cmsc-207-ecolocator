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
  const cleanedParams: Record<string, string | number> = {};

  if (params.page) cleanedParams.page = params.page;
  if (params.per_page) cleanedParams.per_page = params.per_page;
  if (params.search?.trim()) cleanedParams.search = params.search.trim();
  if (params.role) {
    cleanedParams.role = params.role;
  }
  if (params.is_active !== '') {
    cleanedParams.is_active = params.is_active === 'true' ? 1 : 0;
  }
  if (params.sort) cleanedParams.sort = params.sort;
  if (params.direction) cleanedParams.direction = params.direction;

  const response = await apiClient.get('/api/v1/admin/users', {
    params: cleanedParams,
  });

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