export type AdminLoginFormValues = {
  email: string;
  password: string;
};

export type AdminLoginPayload = {
  email: string;
  password: string;
};

export type AdminUserRole = 'super_admin' | 'editor';

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: AdminUserRole;
  is_active: boolean;
};

export type AdminLoginResponse = {
  message: string;
  user: AdminUser;
  token?: string;
};

export type AdminApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

export type AuthState = {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};
