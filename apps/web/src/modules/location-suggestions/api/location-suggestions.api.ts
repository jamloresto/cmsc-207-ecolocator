import { apiClient } from '@/lib/api-client';
import type {
  SubmitLocationSuggestionPayload,
  SubmitLocationSuggestionResponse,
} from '@/modules/location-suggestions/types/location-suggestions.types';

export async function submitLocationSuggestion(
  payload: SubmitLocationSuggestionPayload,
): Promise<SubmitLocationSuggestionResponse> {
  const response = await apiClient.post(
    '/api/v1/location-suggestions',
    payload,
  );

  return response.data;
}
