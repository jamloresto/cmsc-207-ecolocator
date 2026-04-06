import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAdminWasteCollectionLocation,
  deleteAdminWasteCollectionLocation,
  getAdminWasteCollectionLocation,
  getAdminWasteCollectionLocations,
  updateAdminWasteCollectionLocation,
} from '../api/waste-collection-locations.api';
import type {
  WasteCollectionLocationPayload,
  WasteCollectionLocationsQueryParams,
} from '../types/waste-collection-location.types';

export function useWasteCollectionLocations(
  params: WasteCollectionLocationsQueryParams,
) {
  return useQuery({
    queryKey: ['admin-waste-collection-locations', params],
    queryFn: () => getAdminWasteCollectionLocations(params),
  });
}

export function useWasteCollectionLocation(id?: string | number) {
  return useQuery({
    queryKey: ['admin-waste-collection-location', id],
    queryFn: () => getAdminWasteCollectionLocation(id as string | number),
    enabled: !!id,
  });
}

export function useCreateWasteCollectionLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: WasteCollectionLocationPayload) =>
      createAdminWasteCollectionLocation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin-waste-collection-locations'],
      });
    },
  });
}

export function useUpdateWasteCollectionLocation(id: string | number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: WasteCollectionLocationPayload) =>
      updateAdminWasteCollectionLocation(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin-waste-collection-locations'],
      });
      queryClient.invalidateQueries({
        queryKey: ['admin-waste-collection-location', id],
      });
    },
  });
}

export function useDeleteWasteCollectionLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteAdminWasteCollectionLocation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin-waste-collection-locations'],
      });
    },
  });
}
