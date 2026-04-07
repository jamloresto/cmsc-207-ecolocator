import { useQuery } from '@tanstack/react-query';

import { getPublicActiveMaterialTypes } from '@/modules/find-centers';

export function useFindCenterMaterialTypes() {
  return useQuery({
    queryKey: ['public-active-material-types'],
    queryFn: getPublicActiveMaterialTypes,
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
}
