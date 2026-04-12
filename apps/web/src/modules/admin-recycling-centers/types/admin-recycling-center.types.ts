import { ActiveMaterialType } from '@/modules/admin-material-types';
import type { PaginatedResponse } from '@/types/api.types';

export type WasteCollectionLocation = {
  id: number;
  name: string;
  country_code: string;
  country_name: string;
  state_province: string;
  state_code?: string | null;
  city_municipality: string;
  city_slug?: string | null;
  region?: string | null;
  street_address: string;
  postal_code?: string | null;
  latitude: number;
  longitude: number;
  contact_number?: string | null;
  email?: string | null;
  operating_hours?: string | null;
  notes?: string | null;
  is_active: boolean;
  material_types: ActiveMaterialType[];
  created_at?: string;
  updated_at?: string;
};

export type WasteCollectionLocationsResponse =
  PaginatedResponse<WasteCollectionLocation>;

export type WasteCollectionLocationPayload = {
  name: string;
  country_code: string;
  country_name: string;
  state_province: string;
  state_code?: string;
  city_municipality: string;
  region?: string;
  street_address: string;
  postal_code?: string;
  latitude: number | string;
  longitude: number | string;
  contact_number?: string;
  email?: string;
  operating_hours?: string;
  notes?: string;
  is_active: boolean;
  material_type_ids: number[];
};

export type WasteCollectionLocationsQueryParams = {
  page?: number;
  per_page?: number;
  search?: string;
  country_code?: string;
  state_province?: string;
  state_code?: string;
  city_municipality?: string;
  city_slug?: string;
  region?: string;
  material_type_id?: number | '';
  material_slug?: string;
  sort_by?:
    | 'name'
    | 'city_municipality'
    | 'state_province'
    | 'country_name'
    | 'is_active'
    | 'created_at'
    | 'updated_at';
  sort_order?: 'asc' | 'desc';
};