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
