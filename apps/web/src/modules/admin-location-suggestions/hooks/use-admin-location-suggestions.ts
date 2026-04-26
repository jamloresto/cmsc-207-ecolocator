'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  approveLocationSuggestion,
  getAdminLocationSuggestions,
  rejectLocationSuggestion,
  updateAdminLocationSuggestion,
  type AdminLocationSuggestionsQueryParams,
} from '@/modules/admin-location-suggestions';

export function useAdminLocationSuggestions(
  params: AdminLocationSuggestionsQueryParams,
) {
  return useQuery({
    queryKey: ['admin-location-suggestions', params],
    queryFn: () => getAdminLocationSuggestions(params),
  });
}

export function useApproveLocationSuggestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => approveLocationSuggestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin-location-suggestions'],
      });
      queryClient.invalidateQueries({
        queryKey: ['admin-dashboard-stats'],
      });
    },
  });
}

export function useRejectLocationSuggestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, review_notes }: { id: number; review_notes?: string }) =>
      rejectLocationSuggestion(id, { review_notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin-location-suggestions'],
      });
      queryClient.invalidateQueries({
        queryKey: ['admin-dashboard-stats'],
      });
    },
  });
}

export function useUpdateLocationSuggestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Record<string, unknown>;
    }) => updateAdminLocationSuggestion(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin-location-suggestions'],
      });
      queryClient.invalidateQueries({
        queryKey: ['admin-dashboard-stats'],
      });
    },
  });
}