import { apiClient } from '@/lib/api-client';
import {
  buildMaterialTypesQueryParams,
  type AdminMaterialTypeResponse,
  type AdminMaterialTypesListParams,
  type AdminMaterialTypesListResponse,
  type CreateMaterialTypePayload,
  type UpdateMaterialTypePayload,
  type UpdateMaterialTypeStatusPayload,
} from '@/modules/admin-material-types';

export async function getAdminMaterialTypes(
  params: AdminMaterialTypesListParams = {},
): Promise<AdminMaterialTypesListResponse> {
  const response = await apiClient.get<AdminMaterialTypesListResponse>(
    `/api/v1/admin/material-types${buildMaterialTypesQueryParams(params)}`,
  );

  return response.data;
}

export async function getActiveMaterialTypes() {
  const res = await apiClient.get('/api/v1/admin/material-types/all');

  return res.data.data;
}

export async function getAdminMaterialType(
  id: number,
): Promise<AdminMaterialTypeResponse> {
  const response = await apiClient.get<AdminMaterialTypeResponse>(
    `/api/v1/admin/material-types/${id}`,
  );

  return response.data;
}

export async function createAdminMaterialType(
  payload: CreateMaterialTypePayload,
): Promise<AdminMaterialTypeResponse> {
  const response = await apiClient.post<AdminMaterialTypeResponse>(
    '/api/v1/admin/material-types',
    payload,
  );

  return response.data;
}

export async function updateAdminMaterialType(
  id: number,
  payload: UpdateMaterialTypePayload,
): Promise<AdminMaterialTypeResponse> {
  const response = await apiClient.put<AdminMaterialTypeResponse>(
    `/api/v1/admin/material-types/${id}`,
    payload,
  );

  return response.data;
}

export async function updateAdminMaterialTypeStatus(
  id: number,
  payload: UpdateMaterialTypeStatusPayload,
): Promise<AdminMaterialTypeResponse> {
  const response = await apiClient.patch<AdminMaterialTypeResponse>(
    `/api/v1/admin/material-types/${id}/status`,
    payload,
  );

  return response.data;
}
