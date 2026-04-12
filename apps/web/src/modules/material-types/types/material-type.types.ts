export type MaterialType = {
  name: string;
  slug: string;
  description: string;
  icon: string;
};

export type MaterialTypesResponse = {
  success: boolean;
  message: string;
  data: MaterialType[];
};
