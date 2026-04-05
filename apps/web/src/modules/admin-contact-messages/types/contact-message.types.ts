import {
  PaginatedResponse,
  PaginationParams,
  SearchParams,
  SortOrderParams,
} from '@/types/api.types';

export type ContactMessageStatus = 'new' | 'read' | 'replied' | 'archived';

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  contact_info?: string | null;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  read_at?: string | null;
  replied_at?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at: string;
  updated_at: string;
}

export type ContactMessagesListResponse = PaginatedResponse<ContactMessage>;

export type ContactMessagesParams = PaginationParams &
  SearchParams &
  SortOrderParams<'created_at' | 'updated_at' | 'status'> & {
    status?: ContactMessageStatus | '';
  };

export interface ReplyContactMessagePayload {
  reply_message: string;
}

export interface ReplyContactMessageResponse {
  message: string;
  data?: ContactMessage;
}
