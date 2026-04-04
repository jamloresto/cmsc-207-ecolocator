import { apiClient } from '@/lib/api-client';
import type {
  AdminUsersQueryParams,
  PaginatedAdminUsersResponse,
} from '@/modules/admin-users';

export async function getAdminUsers(
  params: AdminUsersQueryParams = {},
): Promise<PaginatedAdminUsersResponse> {
  const response = await apiClient.get('/api/v1/admin/users', { params });
  return response.data;
}
