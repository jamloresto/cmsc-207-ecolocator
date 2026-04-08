import { PaginatedResponse } from '@/types/api.types';

export type RecyclingCenterMaterialType = {
  id?: number;
  name: string;
  slug: string;
};

export type RecyclingCenter = {
  id: number;
  name: string;
  country_code?: string | null;
  country_name?: string | null;
  state_province?: string | null;
  state_code?: string | null;
  city_municipality?: string | null;
  city_slug?: string | null;
  region?: string | null;
  street_address?: string | null;
  postal_code?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  contact_number?: string | null;
  email?: string | null;
  operating_hours?: string | null;
  notes?: string | null;
  material_types: RecyclingCenterMaterialType[];
};

export type PublicRecyclingCentersParams = {
  material_slugs?: string[];
  search?: string;
  page?: number;
};

export type PublicRecyclingCentersResponse = PaginatedResponse<RecyclingCenter>;

export type ActiveMaterialType = {
  id?: number;
  name: string;
  slug: string;
  description?: string | null;
};
