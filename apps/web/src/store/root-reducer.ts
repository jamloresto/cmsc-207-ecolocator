import { combineReducers } from '@reduxjs/toolkit';
import { authReducer } from '@/modules/auth/store/auth.slice';
import { contactReducer } from '@/modules/contact/store/contact.slice';

export const rootReducer = combineReducers({
  auth: authReducer,
  contact: contactReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
