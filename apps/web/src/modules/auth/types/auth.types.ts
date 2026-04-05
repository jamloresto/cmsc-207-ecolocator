import { AdminUser } from "@/modules/admin-users";

export type AdminLoginPayload = {
  email: string;
  password: string;
};

export type AdminLoginResponse = {
  message: string;
  user: AdminUser;
  token?: string;
};

export type AuthState = {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};
