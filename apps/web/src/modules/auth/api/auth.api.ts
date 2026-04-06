import { apiClient } from '@/lib/api-client';
import type { AdminLoginPayload, AdminLoginResponse } from '@/modules/auth';

export async function adminLogin(
  payload: AdminLoginPayload,
): Promise<AdminLoginResponse> {
  await apiClient.get('/sanctum/csrf-cookie');

  const response = await apiClient.post('/api/v1/admin/login', payload);

  return response.data;
}

export async function getAdminMe(): Promise<AdminLoginResponse> {
  const response = await apiClient.get('/api/v1/admin/me');
  return response.data;
}

export async function logoutAdmin(): Promise<{ message: string }> {
  const response = await apiClient.post('/api/v1/admin/logout');
  return response.data;
}