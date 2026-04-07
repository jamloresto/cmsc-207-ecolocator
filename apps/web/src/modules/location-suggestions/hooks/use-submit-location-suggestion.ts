'use client';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import { submitLocationSuggestion } from '../api/location-suggestions.api';
import type { SubmitLocationSuggestionPayload } from '../types/location-suggestions.types';

type ParsedLocationSuggestionError = {
  message: string;
  fieldErrors?: Record<string, string>;
};

export function getLocationSuggestionSubmitError(
  error: unknown,
): ParsedLocationSuggestionError {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | {
          message?: string;
          errors?: Record<string, string[]>;
        }
      | undefined;

    if (error.response?.status === 422 && data?.errors) {
      const fieldErrors = Object.fromEntries(
        Object.entries(data.errors).map(([key, value]) => [
          key,
          value?.[0] ?? '',
        ]),
      );

      const firstError = Object.values(fieldErrors)[0];

      return {
        message: firstError || data.message || 'Please check the form fields.',
        fieldErrors,
      };
    }

    return {
      message: data?.message || 'Unable to submit your suggestion right now.',
    };
  }

  return {
    message: 'Something went wrong. Please try again.',
  };
}

export function useSubmitLocationSuggestion() {
  return useMutation({
    mutationFn: (payload: SubmitLocationSuggestionPayload) =>
      submitLocationSuggestion(payload),
  });
}
