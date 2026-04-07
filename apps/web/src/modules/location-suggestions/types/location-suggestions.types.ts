import { AdminLocationSuggestion } from "@/modules/admin-location-suggestions";

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
