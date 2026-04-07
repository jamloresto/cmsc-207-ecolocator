export type FindCenterMaterialType = {
  name: string;
  slug: string;
};

export type MapFindCenterLocation = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  material_types: FindCenterMaterialType[];
};

export type MapBounds = {
  north: number;
  south: number;
  east: number;
  west: number;
};

export type FindCenterLocationDetail = {
  id: number;
  name: string;
  country_code: string | null;
  country_name: string | null;
  state_province: string | null;
  state_code: string | null;
  city_municipality: string | null;
  city_slug: string | null;
  region: string | null;
  street_address: string | null;
  postal_code: string | null;
  latitude: number;
  longitude: number;
  contact_number: string | null;
  email: string | null;
  operating_hours: string | null;
  notes: string | null;
  is_active: boolean;
  material_types: {
    id: number;
    name: string;
    slug: string;
  }[];
};