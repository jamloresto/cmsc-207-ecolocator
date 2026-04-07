import { useQuery } from '@tanstack/react-query';

import { getMapLocations, type MapBounds } from '@/modules/find-centers';

type UseMapLocationsParams = {
  bounds: MapBounds | null;
  materialSlug?: string;
};

export function useMapLocations({
  bounds,
  materialSlug,
}: UseMapLocationsParams) {
  return useQuery({
    queryKey: ['map-locations', bounds, materialSlug],
    queryFn: () =>
      getMapLocations({
        north: bounds!.north,
        south: bounds!.south,
        east: bounds!.east,
        west: bounds!.west,
        material_slug: materialSlug || undefined,
      }),
    enabled: Boolean(bounds),
    staleTime: 1000 * 30,
    placeholderData: (previousData) => previousData,
  });
}
