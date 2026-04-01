export type MaterialType = {
  name: string;
  slug: string;
  description: string;
};

export type MaterialTypesResponse = {
  success: boolean;
  message: string;
  data: MaterialType[];
};
