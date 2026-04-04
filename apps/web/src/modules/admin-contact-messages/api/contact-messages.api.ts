import { API_BASE_URL } from '@/lib/api';
import { apiClient } from '@/lib/api-client';
import type {
  ContactMessage,
  ContactMessagesListResponse,
  ContactMessagesParams,
  ReplyContactMessagePayload,
  ReplyContactMessageResponse,
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

  if (params.sort_by) {
    searchParams.set('sort_by', String(params.sort_by));
  }

  if (params.sort_order) {
    searchParams.set('sort_order', String(params.sort_order));
  }

  const query = searchParams.toString();

  return query ? `?${query}` : '';
}

export async function getAdminContactMessages(
  params: ContactMessagesParams = {
    sort_order: 'desc'
  }
): Promise<ContactMessagesListResponse> {
  const response = await apiClient.get(
    `/api/v1/admin/contact-messages${buildQuery(params)}`,
  );

  return response.data;
}

export async function getAdminContactMessageById(
  id: number | string,
): Promise<{ data: ContactMessage }> {
  const response = await apiClient.get(`/api/v1/admin/contact-messages/${id}`);

  return response.data;
}

export async function archiveAdminContactMessage(
  id: number | string,
): Promise<{ message: string; data?: ContactMessage }> {
  const response = await apiClient.patch(
    `/api/v1/admin/contact-messages/${id}/archive`,
  );

  return response.data;
}

export async function replyToAdminContactMessage(
  id: number | string,
  payload: ReplyContactMessagePayload,
): Promise<ReplyContactMessageResponse> {
  const response = await apiClient.post(
    `/api/v1/admin/contact-messages/${id}/reply`,
    payload,
  );

  return response.data;
}