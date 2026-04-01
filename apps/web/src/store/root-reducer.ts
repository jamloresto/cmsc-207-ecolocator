import { combineReducers } from '@reduxjs/toolkit';
import { authReducer } from '@/modules/auth/store/auth.slice';
import { contactReducer } from '@/modules/contact/store/contact.slice';
import { locationSuggestionsReducer } from '@/modules/location-suggestions/store/location-suggestions.slice';

export const rootReducer = combineReducers({
  auth: authReducer,
  contact: contactReducer,
  locationSuggestions: locationSuggestionsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
