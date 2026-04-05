import { AdminUser, AdminUserRole } from '@/modules/auth';
import { PaginatedResponse } from '@/types/api.types';

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

export type AdminUserApiResponse = {
  data: AdminUser;
};