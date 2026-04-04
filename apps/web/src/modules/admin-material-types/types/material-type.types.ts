export type AdminMaterialType = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type AdminMaterialTypesListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  is_active?: 'true' | 'false' | '';
  sort?: 'name' | 'created_at' | 'updated_at';
  direction?: 'asc' | 'desc';
};

export type LaravelPaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};

export type LaravelPaginatedResponse<T> = {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: LaravelPaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
};

export type AdminMaterialTypesListResponse = {
  success: boolean;
  message: string;
  data: LaravelPaginatedResponse<AdminMaterialType>;
};

export type AdminMaterialTypeResponse = {
  success: boolean;
  message: string;
  data: AdminMaterialType;
};

export type CreateMaterialTypePayload = {
  name: string;
  description?: string | null;
  is_active?: boolean;
};

export type UpdateMaterialTypePayload = {
  name: string;
  description?: string | null;
  is_active?: boolean;
};

export type UpdateMaterialTypeStatusPayload = {
  is_active: boolean;
};
