import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  AdminLoginPayload,
  AdminUser,
  AuthState,
} from '@/modules/auth/types/auth.types';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (
      state: AuthState,
      _action: PayloadAction<AdminLoginPayload>,
    ) => {
      state.isLoading = true;
      state.error = null;
    },

    loginSuccess: (state: AuthState, action: PayloadAction<AdminUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },

    loginFailure: (state: AuthState, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
    },

    logoutRequest: (state: AuthState) => {
      state.isLoading = true;
      state.error = null;
    },

    logoutSuccess: (state: AuthState) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },

    clearAuthError: (state: AuthState) => {
      state.error = null;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  clearAuthError,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
