import { apiClient } from '@/lib/api-client';
import type { ApiSuccessResponse } from '@/types/api.types';
import type { MapBounds, MapFindCenterLocation } from '@/modules/find-centers';

export type GetMapLocationsParams = MapBounds & {
  material_slug?: string;
  signal?: AbortSignal;
};

export async function getMapLocations(
  params: GetMapLocationsParams,
): Promise<ApiSuccessResponse<MapFindCenterLocation[]>> {
  const response = await apiClient.get('/api/v1/locations/map', {
    params: {
      north: params.north,
      south: params.south,
      east: params.east,
      west: params.west,
      material_slug: params.material_slug,
    },
    signal: params.signal,
  });

  return response.data;
}
