import { apiClient } from '@/lib/api-client';
import type {
  SubmitContactPayload,
  SubmitContactResponse,
} from '@/modules/contact/types/contact.types';

export async function submitContactMessage(
  payload: SubmitContactPayload,
): Promise<SubmitContactResponse> {
  const response = await apiClient.post('/api/v1/contact-messages', payload);
  return response.data;
}
