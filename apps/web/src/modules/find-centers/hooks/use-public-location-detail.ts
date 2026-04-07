import { useQuery } from '@tanstack/react-query';
import { getPublicLocationDetail } from '../api/get-public-location-detail';

export function usePublicLocationDetail(locationId: number | null) {
  return useQuery({
    queryKey: ['public-location-detail', locationId],
    queryFn: () => getPublicLocationDetail(locationId as number),
    enabled: !!locationId,
  });
}
