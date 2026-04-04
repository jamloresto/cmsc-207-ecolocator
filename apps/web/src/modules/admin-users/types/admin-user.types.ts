import { AdminUser, AdminUserRole } from "@/modules/auth";

export type AdminUsersQueryParams = {
  page?: number;
  per_page?: number;
  search?: string;
  role?: AdminUserRole | '';
  is_active?: 'true' | 'false' | '';
  sort?: string;
  direction?: 'asc' | 'desc';
};

export type PaginatedAdminUsersResponse = {
  data: AdminUser[];
  links: {
    first?: string | null;
    last?: string | null;
    prev?: string | null;
    next?: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
};
