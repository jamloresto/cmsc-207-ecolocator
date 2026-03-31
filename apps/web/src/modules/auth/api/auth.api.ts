import { API_BASE_URL } from '@/lib/api';
import type {
  AdminApiErrorResponse,
  AdminLoginPayload,
  AdminLoginResponse,
} from '@/modules/auth/types/auth.types';

export async function adminLogin(
  payload: AdminLoginPayload,
): Promise<AdminLoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as
    | AdminLoginResponse
    | AdminApiErrorResponse;

  if (!response.ok) {
    throw new Error(
      data.message || 'Unable to sign in. Please check your credentials.',
    );
  }

  return data as AdminLoginResponse;
}
