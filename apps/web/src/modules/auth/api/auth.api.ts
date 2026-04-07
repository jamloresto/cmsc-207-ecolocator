import { apiClient } from '@/lib/api-client';
import type {
  AdminLoginPayload,
  AdminLoginResponse,
  AdminLogoutResponse,
  AdminMeResponse,
} from '@/modules/auth';

export async function loginAdmin(
  payload: AdminLoginPayload,
): Promise<AdminLoginResponse> {
  const response = await apiClient.post('/api/v1/admin/login', payload);
  return response.data;
}

export async function getAdminMe(): Promise<AdminMeResponse> {
  const response = await apiClient.get('/api/v1/admin/me');
  return response.data;
}

export async function logoutAdmin(): Promise<AdminLogoutResponse> {
  const response = await apiClient.post('/api/v1/admin/logout');
  return response.data;
}
