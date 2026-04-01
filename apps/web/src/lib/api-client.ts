import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/lib/api';
import { getAccessToken, removeAccessToken } from '@/lib/token';

export type ApiErrorPayload = {
  message?: string;
  errors?: Record<string, string[]>;
};

export class ApiError extends Error {
  status?: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    status?: number,
    errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorPayload>) => {
    const status = error.response?.status;
    const data = error.response?.data;

    const message =
      data?.message ||
      error.message ||
      'Something went wrong. Please try again.';

    const apiError = new ApiError(message, status, data?.errors);

    if (status === 401) {
      removeAccessToken();

      if (typeof window !== 'undefined') {
        const isAdminPage = window.location.pathname.startsWith('/admin');
        const isAdminLoginPage = window.location.pathname === '/admin/login';

        if (isAdminPage && !isAdminLoginPage) {
          window.location.href = '/admin/login';
        }
      }
    }

    return Promise.reject(apiError);
  },
);
