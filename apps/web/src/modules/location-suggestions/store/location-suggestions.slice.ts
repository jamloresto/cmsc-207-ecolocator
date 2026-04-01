import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  LocationSuggestionsState,
  SubmitLocationSuggestionPayload,
} from '@/modules/location-suggestions/types/location-suggestions.types';

const initialState: LocationSuggestionsState = {
  isSubmitting: false,
  isSuccess: false,
  successMessage: null,
  error: null,
};

const locationSuggestionsSlice = createSlice({
  name: 'locationSuggestions',
  initialState,
  reducers: {
    submitLocationSuggestionRequest: (
      state,
      _action: PayloadAction<SubmitLocationSuggestionPayload>,
    ) => {
      state.isSubmitting = true;
      state.isSuccess = false;
      state.successMessage = null;
      state.error = null;
    },

    submitLocationSuggestionSuccess: (state, action: PayloadAction<string>) => {
      state.isSubmitting = false;
      state.isSuccess = true;
      state.successMessage = action.payload;
      state.error = null;
    },

    submitLocationSuggestionFailure: (state, action: PayloadAction<string>) => {
      state.isSubmitting = false;
      state.isSuccess = false;
      state.successMessage = null;
      state.error = action.payload;
    },

    clearLocationSuggestionState: (state) => {
      state.isSubmitting = false;
      state.isSuccess = false;
      state.successMessage = null;
      state.error = null;
    },
  },
});

export const {
  submitLocationSuggestionRequest,
  submitLocationSuggestionSuccess,
  submitLocationSuggestionFailure,
  clearLocationSuggestionState,
} = locationSuggestionsSlice.actions;

export const locationSuggestionsReducer = locationSuggestionsSlice.reducer;
