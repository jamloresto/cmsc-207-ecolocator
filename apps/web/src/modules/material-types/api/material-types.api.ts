import { API_BASE_URL } from '@/lib/api';
import type { MaterialTypesResponse } from '@/modules/material-types/types/material-type.types';

export async function getMaterialTypes(): Promise<MaterialTypesResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/material-types`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  const data = (await response.json()) as MaterialTypesResponse;

  if (!response.ok) {
    throw new Error(data?.message || 'Failed to fetch material types.');
  }

  return data;
}
