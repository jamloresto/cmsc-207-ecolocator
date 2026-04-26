import type { PaginatedResponse } from '@/types/api.types';

export type AdminLocationSuggestionStatus =
  | 'all'
  | 'pending'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'archived';

export type AdminLocationSuggestion = {
  id: number;
  name: string;
  email: string;
  contact_info?: string | null;

  location_name: string;
  street_address: string;
  city_municipality?: string | null;
  province?: string | null;

  latitude?: number | null;
  longitude?: number | null;

  materials_accepted?: string[] | string | null;

  notes?: string | null;
  review_notes?: string | null;

  status: AdminLocationSuggestionStatus;

  reviewed_at?: string | null;
  approved_at?: string | null;
  rejected_at?: string | null;

  created_at: string;
  updated_at: string;
};

export type AdminLocationSuggestionsResponse = {
  data: PaginatedResponse<AdminLocationSuggestion>;
};

export type AdminLocationSuggestionsListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  status?: AdminLocationSuggestionStatus;
  province?: string;
  city_municipality?: string;
  sort_by?:
    | 'created_at'
    | 'updated_at'
    | 'status'
    | 'location_name'
    | 'city_municipality'
    | 'province';
  sort_order?: 'asc' | 'desc';
};