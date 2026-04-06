import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAdminWasteCollectionLocation,
  deleteAdminWasteCollectionLocation,
  getAdminWasteCollectionLocation,
  getAdminWasteCollectionLocations,
  updateAdminWasteCollectionLocation,
} from '../api/admin-recycling-centers.api';
import type {
  WasteCollectionLocationPayload,
  WasteCollectionLocationsQueryParams,
} from '../types/admin-recycling-center.types';

export function useWasteCollectionLocations(
  params: WasteCollectionLocationsQueryParams,
) {
  return useQuery({
    queryKey: ['admin-recycling-centers', params],
    queryFn: () => getAdminWasteCollectionLocations(params),
  });
}

export function useWasteCollectionLocation(id?: string | number) {
  return useQuery({
    queryKey: ['admin-recycling-center', id],
    queryFn: () => getAdminWasteCollectionLocation(id as number),
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
        queryKey: ['admin-recycling-centers'],
      });
    },
  });
}

export function useUpdateWasteCollectionLocation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: WasteCollectionLocationPayload) =>
      updateAdminWasteCollectionLocation(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin-recycling-centers'],
      });
      queryClient.invalidateQueries({
        queryKey: ['admin-recycling-center', id],
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
        queryKey: ['admin-recycling-centers'],
      });
    },
  });
}
