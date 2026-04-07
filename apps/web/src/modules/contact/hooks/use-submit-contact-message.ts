'use client';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import { submitContactMessage } from '../api/contact.api';
import type { SubmitContactPayload } from '../types/contact.types';

type ParsedContactError = {
  message: string;
  fieldErrors?: Record<string, string>;
};

export function getContactSubmitError(error: unknown): ParsedContactError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as
      | {
          message?: string;
          errors?: Record<string, string[]>;
        }
      | undefined;

    if (status === 429) {
      return {
        message:
          data?.message ||
          'Too many attempts. Please wait a moment before sending another message.',
      };
    }

    if (status === 422 && data?.errors) {
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
      message: data?.message || 'Unable to send your message right now.',
    };
  }

  return {
    message: 'Something went wrong. Please try again.',
  };
}

export function useSubmitContactMessage() {
  return useMutation({
    mutationFn: (payload: SubmitContactPayload) =>
      submitContactMessage(payload),
  });
}
