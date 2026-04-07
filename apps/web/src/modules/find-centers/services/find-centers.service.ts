import { apiClient } from '@/lib/api-client';

import type { PaginatedResponse } from '@/types/api.types';
import type { FindCenterLocation, FindCenterMaterialType } from '@/modules/find-centers';

export type GetPublicLocationsParams = {
  search?: string;
  material_slug?: string;
  page?: number;
  per_page?: number;
};

export async function getPublicLocations(
  params: GetPublicLocationsParams = {},
): Promise<PaginatedResponse<FindCenterLocation>> {
  const cleanedParams: Record<string, string | number> = {};

  if (params.page) cleanedParams.page = params.page;
  if (params.per_page) cleanedParams.per_page = params.per_page;
  if (params.search?.trim()) cleanedParams.search = params.search.trim();
  if (params.material_slug) cleanedParams.material_slug = params.material_slug;

  const response = await apiClient.get('/api/v1/locations', {
    params: cleanedParams,
  });

  return response.data;
}

export async function getPublicActiveMaterialTypes(): Promise<
  FindCenterMaterialType[]
> {
  const response = await apiClient.get('/api/v1/material-types');

  return response.data.data;
}
