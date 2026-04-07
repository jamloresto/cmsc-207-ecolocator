export type FindCenterMaterialType = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
};

export type FindCenterLocation = {
  id: number;
  name: string;
  country_code: string;
  country_name: string;
  state_province: string | null;
  state_code: string | null;
  city_municipality: string | null;
  city_slug: string | null;
  region: string | null;
  street_address: string | null;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  contact_number: string | null;
  email: string | null;
  operating_hours: string | null;
  notes: string | null;
  is_active: boolean;
  material_types: FindCenterMaterialType[];
};
