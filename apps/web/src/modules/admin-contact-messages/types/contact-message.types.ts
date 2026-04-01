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
  created_at: string;
}
