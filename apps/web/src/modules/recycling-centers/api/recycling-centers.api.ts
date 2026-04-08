import { apiClient } from '@/lib/api-client';
import type {
  PublicRecyclingCentersParams,
  PublicRecyclingCentersResponse,
} from '@/modules/recycling-centers';

export async function getPublicRecyclingCenters(
  params: PublicRecyclingCentersParams,
) {
  const { data } = await apiClient.get<PublicRecyclingCentersResponse>(
    '/api/v1/locations',
    {
      params: {
        material_slugs: params.material_slugs?.length
          ? params.material_slugs
          : undefined,
        search: params.search || undefined,
        page: params.page || 1,
      },
    },
  );

  return data;
}
