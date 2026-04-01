import type { RootState } from '@/store';

export const selectLocationSuggestions = (state: RootState) =>
  state.locationSuggestions;

export const selectLocationSuggestionSubmitting = (state: RootState) =>
  state.locationSuggestions.isSubmitting;

export const selectLocationSuggestionSuccess = (state: RootState) =>
  state.locationSuggestions.isSuccess;

export const selectLocationSuggestionSuccessMessage = (state: RootState) =>
  state.locationSuggestions.successMessage;

export const selectLocationSuggestionError = (state: RootState) =>
  state.locationSuggestions.error;
