import { useQuery } from '@tanstack/react-query';
import { getFindCenterMaterialTypes } from '@/modules/find-centers';

export function useFindCenterMaterialTypes() {
  return useQuery({
    queryKey: ['find-center-material-types'],
    queryFn: getFindCenterMaterialTypes,
    staleTime: 1000 * 60 * 60,
  });
}