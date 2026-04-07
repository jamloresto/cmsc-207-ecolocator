import { useQuery } from '@tanstack/react-query';

import { getPublicLocations } from '@/modules/find-centers';

type UseFindCentersParams = {
  search?: string;
  material_slug?: string;
  page?: number;
};

export function useFindCenters(params: UseFindCentersParams) {
  return useQuery({
    queryKey: ['public-locations', params],
    queryFn: () => getPublicLocations(params),
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  });
}
