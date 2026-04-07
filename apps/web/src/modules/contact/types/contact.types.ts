import { ContactMessage } from "@/modules/admin-contact-messages";

export type ContactFormValues = {
  name: string;
  email: string;
  contact_info: string;
  subject: string;
  message: string;
};

export type SubmitContactPayload = {
  name: string;
  email: string;
  contact_info?: string | null;
  subject: string;
  message: string;
};

export type SubmitContactResponse = {
  message: string;
  data: ContactMessage;
};

export type ContactState = {
  isSubmitting: boolean;
  isSuccess: boolean;
  successMessage: string | null;
  error: string | null;
};
