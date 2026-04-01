import { apiClient } from '@/lib/api-client';
import type {
  AdminLoginPayload,
  AdminLoginResponse,
} from '@/modules/auth';

export async function adminLogin(
  payload: AdminLoginPayload,
): Promise<AdminLoginResponse> {
  await apiClient.get('/sanctum/csrf-cookie');

  const response = await apiClient.post('/api/v1/admin/login', payload);
  
  return response.data;
}
