import { apiClient } from '@/lib/api-client';
import type {
  AdminLoginPayload,
  AdminLoginResponse,
} from '@/modules/auth/types/auth.types';

export async function adminLogin(
  payload: AdminLoginPayload,
): Promise<AdminLoginResponse> {
  const response = await apiClient.post('/api/v1/admin/login', payload);
  return response.data;
}
