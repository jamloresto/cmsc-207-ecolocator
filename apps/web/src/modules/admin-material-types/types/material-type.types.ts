import {
  PaginatedResponse,
  PaginationParams,
  SearchParams,
  SortDirectionParams,
} from '@/types/api.types';

export type ActiveMaterialType = {
  id: number;
  name: string;
  slug: string;
};

export type AdminMaterialType = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type AdminMaterialTypesListParams = PaginationParams &
  SearchParams &
  SortDirectionParams<'name' | 'created_at' | 'updated_at'> & {
    is_active?: 'true' | 'false' | '';
  };

export type AdminMaterialTypesListResponse = {
  success: boolean;
  message: string;
  data: PaginatedResponse<AdminMaterialType>;
};

export type AdminMaterialTypeResponse = {
  success: boolean;
  message: string;
  data: AdminMaterialType;
};

export type CreateMaterialTypePayload = {
  name: string;
  description?: string | null;
  is_active?: boolean;
};

export type UpdateMaterialTypePayload = {
  name: string;
  description?: string | null;
  is_active?: boolean;
};

export type UpdateMaterialTypeStatusPayload = {
  is_active: boolean;
};
