import { apiClient } from '@/lib/api-client';
import type {
  WasteCollectionLocationsQueryParams,
  WasteCollectionLocationsResponse,
  WasteCollectionLocation,
  WasteCollectionLocationPayload,
} from '../types/admin-recycling-center.types';

export async function getAdminWasteCollectionLocations(
  params: WasteCollectionLocationsQueryParams = {},
): Promise<WasteCollectionLocationsResponse> {
  const cleanedParams: Record<string, string | number> = {};

  if (params.page) cleanedParams.page = params.page;
  if (params.per_page) cleanedParams.per_page = params.per_page;
  if (params.search?.trim()) cleanedParams.search = params.search.trim();

  if (params.country_code?.trim())
    cleanedParams.country_code = params.country_code.trim();
  if (params.state_province?.trim())
    cleanedParams.state_province = params.state_province.trim();
  if (params.state_code?.trim())
    cleanedParams.state_code = params.state_code.trim();
  if (params.city_municipality?.trim())
    cleanedParams.city_municipality = params.city_municipality.trim();
  if (params.city_slug?.trim())
    cleanedParams.city_slug = params.city_slug.trim();
  if (params.region?.trim()) cleanedParams.region = params.region.trim();

  if (params.material_type_id !== '') {
    cleanedParams.material_type_id = params.material_type_id as number;
  }

  if (params.material_slug?.trim())
    cleanedParams.material_slug = params.material_slug.trim();

  if (params.sort) cleanedParams.sort = params.sort;
  if (params.direction) cleanedParams.direction = params.direction;

  const response = await apiClient.get('/api/v1/admin/locations', {
    params: cleanedParams,
  });

  return response.data;
}

export async function getAdminWasteCollectionLocation(
  id: number,
): Promise<WasteCollectionLocation> {
  const response = await apiClient.get(`/api/v1/admin/locations/${id}`);
  return response.data.data;
}

export async function createAdminWasteCollectionLocation(
  payload: WasteCollectionLocationPayload,
): Promise<WasteCollectionLocation> {
  const response = await apiClient.post('/api/v1/admin/locations', {
    ...payload,
    latitude: Number(payload.latitude),
    longitude: Number(payload.longitude),
  });

  return response.data.data;
}

export async function updateAdminWasteCollectionLocation(
  id: number,
  payload: WasteCollectionLocationPayload,
): Promise<WasteCollectionLocation> {
  const response = await apiClient.put(`/api/v1/admin/locations/${id}`, {
    ...payload,
    latitude: Number(payload.latitude),
    longitude: Number(payload.longitude),
  });

  return response.data.data;
}

export async function deleteAdminWasteCollectionLocation(
  id: number,
): Promise<{ message: string }> {
  const response = await apiClient.delete(`/api/v1/admin/locations/${id}`);
  return response.data;
}
