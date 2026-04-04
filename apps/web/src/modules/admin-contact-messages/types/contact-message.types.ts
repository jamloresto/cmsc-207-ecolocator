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

export interface ContactMessagesPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ContactMessagesListResponse {
  data: ContactMessage[];
  meta?: {
    current_page: number;
    from: number | null;
    last_page: number;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
  links?: {
    first?: string | null;
    last?: string | null;
    prev?: string | null;
    next?: string | null;
  };
}

export interface ContactMessagesParams {
  search?: string;
  status?: '' | ContactMessageStatus;
  page?: number;
  per_page?: number;
}

export interface ReplyContactMessagePayload {
  reply_message: string;
}

export interface ReplyContactMessageResponse {
  message: string;
  data?: ContactMessage;
}