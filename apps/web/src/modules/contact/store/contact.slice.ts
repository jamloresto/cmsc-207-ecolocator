import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type {
  ContactState,
  SubmitContactPayload,
} from '@/modules/contact/types/contact.types';

const initialState: ContactState = {
  isSubmitting: false,
  isSuccess: false,
  successMessage: null,
  error: null,
};

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    submitContactRequest: (
      state,
      _action: PayloadAction<SubmitContactPayload>,
    ) => {
      state.isSubmitting = true;
      state.isSuccess = false;
      state.successMessage = null;
      state.error = null;
    },

    submitContactSuccess: (state, action: PayloadAction<string>) => {
      state.isSubmitting = false;
      state.isSuccess = true;
      state.successMessage = action.payload;
      state.error = null;
    },

    submitContactFailure: (state, action: PayloadAction<string>) => {
      state.isSubmitting = false;
      state.isSuccess = false;
      state.successMessage = null;
      state.error = action.payload;
    },

    clearContactState: (state) => {
      state.isSubmitting = false;
      state.isSuccess = false;
      state.successMessage = null;
      state.error = null;
    },
  },
});

export const {
  submitContactRequest,
  submitContactSuccess,
  submitContactFailure,
  clearContactState,
} = contactSlice.actions;

export const contactReducer = contactSlice.reducer;
