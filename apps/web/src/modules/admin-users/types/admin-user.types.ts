import { ApiSuccessResponse, PaginatedResponse } from '@/types/api.types';

export type AdminUserRole = 'super_admin' | 'editor';

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: AdminUserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type AdminUsersQueryParams = {
  page?: number;
  per_page?: number;
  search?: string;
  role?: AdminUserRole | '';
  is_active?: 'true' | 'false' | '';
  sort?: string;
  direction?: 'asc' | 'desc';
};

export type PaginatedAdminUsersResponse = PaginatedResponse<AdminUser>;

export type CreateAdminUserPayload = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: AdminUserRole;
  is_active: boolean;
};

export type UpdateAdminUserPayload = {
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  role: AdminUserRole;
  is_active: boolean;
};

export type AdminUserApiResponse = ApiSuccessResponse<AdminUser>;