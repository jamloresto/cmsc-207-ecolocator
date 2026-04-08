'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getPublicRecyclingCenters,
  type PublicRecyclingCentersParams,
} from '@/modules/recycling-centers';

export function usePublicRecyclingCenters(
  params: PublicRecyclingCentersParams,
) {
  return useQuery({
    queryKey: ['public-recycling-centers', params],
    queryFn: () => getPublicRecyclingCenters(params),
    placeholderData: (previousData) => previousData,
  });
}
