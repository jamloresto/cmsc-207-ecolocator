import { apiClient } from '@/lib/api-client';
import type { FindCenterMaterialType } from '@/modules/find-centers';

export async function getFindCenterMaterialTypes(): Promise<
  FindCenterMaterialType[]
> {
  const response = await apiClient.get('/api/v1/material-types/active');

  return response.data.data ?? [];
}
