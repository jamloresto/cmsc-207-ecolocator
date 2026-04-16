import { AdminLocationSuggestion } from '@/modules/admin-location-suggestions';

export type LocationSuggestionFormValues = {
  name: string;
  email: string;
  location_name: string;
  location_email: string;
  location_contact: string;
  address: string;
  province: string;
  city_municipality: string;
  materials_accepted: string[];
  materials_other: string;
  notes: string;

  latitude: string;
  longitude: string;
  country_code: string;
  country_name: string;
  state_code: string;
  region: string;
  postal_code: string;
};

export type SubmitLocationSuggestionPayload = {
  name: string;
  email: string;
  location_name: string;
  location_email?: string | null;
  contact_number?: string | null;
  address: string;
  province: string;
  city_municipality: string;
  materials_accepted: string;
  notes: string;

  latitude?: string | null;
  longitude?: string | null;
  country_code?: string | null;
  country_name?: string | null;
  state_code?: string | null;
  region?: string | null;
  postal_code?: string | null;
};

export type SubmitLocationSuggestionResponse = {
  message: string;
  data: AdminLocationSuggestion;
};

export type LocationSuggestionsState = {
  isSubmitting: boolean;
  isSuccess: boolean;
  successMessage: string | null;
  error: string | null;
};
