import { apiClient } from '@/lib/api-client';
import type {
  PaginationParams,
  SearchParams,
  SortOrderParams,
} from '@/types/api.types';

import type { AdminLocationSuggestionsResponse } from '@/modules/admin-location-suggestions';

export type AdminLocationSuggestionSortField =
  | 'created_at'
  | 'updated_at'
  | 'status'
  | 'location_name'
  | 'city_municipality'
  | 'province';

export type AdminLocationSuggestionsQueryParams = PaginationParams &
  SearchParams &
  SortOrderParams<AdminLocationSuggestionSortField> & {
    status?: string;
    province?: string;
    city_municipality?: string;
  };

export async function getAdminLocationSuggestions(
  params: AdminLocationSuggestionsQueryParams = {},
): Promise<AdminLocationSuggestionsResponse> {
  const cleanedParams: Record<string, string | number> = {};

  if (params.page) cleanedParams.page = params.page;
  if (params.per_page) cleanedParams.per_page = params.per_page;
  if (params.search?.trim()) cleanedParams.search = params.search.trim();
  if (params.status && params.status !== 'all') {
    cleanedParams.status = params.status;
  }
  if (params.province?.trim()) {
    cleanedParams.province = params.province.trim();
  }
  if (params.city_municipality?.trim()) {
    cleanedParams.city_municipality = params.city_municipality.trim();
  }
  if (params.sort_by) cleanedParams.sort_by = params.sort_by;
  if (params.sort_order) cleanedParams.sort_order = params.sort_order;

  const response = await apiClient.get('/api/v1/admin/location-suggestions', {
    params: cleanedParams,
  });

  return response.data;
}

export async function getAdminLocationSuggestion(id: number) {
  const response = await apiClient.get(
    `/api/v1/admin/location-suggestions/${id}`,
  );

  return response.data.data;
}

export async function updateAdminLocationSuggestion(
  id: number,
  payload: Record<string, unknown>,
) {
  const response = await apiClient.patch(
    `/api/v1/admin/location-suggestions/${id}`,
    payload,
  );

  return response.data.data;
}

export async function approveLocationSuggestion(id: number) {
  const response = await apiClient.post(
    `/api/v1/admin/location-suggestions/${id}/approve`,
  );

  return response.data;
}

export async function rejectLocationSuggestion(
  id: number,
  payload?: { review_notes?: string },
) {
  const response = await apiClient.post(
    `/api/v1/admin/location-suggestions/${id}/reject`,
    payload ?? {},
  );

  return response.data;
}
