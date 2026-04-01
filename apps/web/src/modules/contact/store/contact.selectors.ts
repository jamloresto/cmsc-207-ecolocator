import type { RootState } from '@/store';

export const selectContact = (state: RootState) => state.contact;
export const selectContactSubmitting = (state: RootState) =>
  state.contact.isSubmitting;
export const selectContactSuccess = (state: RootState) =>
  state.contact.isSuccess;
export const selectContactSuccessMessage = (state: RootState) =>
  state.contact.successMessage;
export const selectContactError = (state: RootState) => state.contact.error;
