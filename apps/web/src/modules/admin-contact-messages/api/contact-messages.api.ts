import { API_BASE_URL } from '@/lib/api';
import { apiClient } from '@/lib/api-client';
import type {
  ContactMessagesListResponse,
  ContactMessagesParams,
} from '@/modules/admin-contact-messages';

function buildQuery(params: ContactMessagesParams) {
  const searchParams = new URLSearchParams();

  if (params.search?.trim()) {
    searchParams.set('search', params.search.trim());
  }

  if (params.status) {
    searchParams.set('status', params.status);
  }

  if (params.page) {
    searchParams.set('page', String(params.page));
  }

  if (params.per_page) {
    searchParams.set('per_page', String(params.per_page));
  }

  const query = searchParams.toString();

  return query ? `?${query}` : '';
}

export async function getAdminContactMessages(
  params: ContactMessagesParams = {},
): Promise<ContactMessagesListResponse> {
  const response = await apiClient.get(
    `${API_BASE_URL}/api/v1/admin/contact-messages${buildQuery(params)}`,);

  return response.data;
}
