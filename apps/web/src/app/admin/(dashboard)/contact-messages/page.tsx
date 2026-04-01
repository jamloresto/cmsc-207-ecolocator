import { AdminContactMessagesTable } from '@/modules/admin-contact-messages/components/admin-contact-messages-table';
import { ContactMessagesToolbar } from '@/modules/admin-contact-messages/components/contact-messages-toolbar';

import { contactMessagesMock } from '@/modules/admin-contact-messages/contact-messages.mock';

export default function AdminContactMessagesPage() {
  return (
    <main className="space-y-6 p-4 md:p-6">
      <div className="space-y-1">
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          Admin Contact Messages
        </h1>
        <p className="text-muted-foreground text-sm">
          Monitor, review, and manage public inquiries.
        </p>
      </div>

      <ContactMessagesToolbar />

      <AdminContactMessagesTable messages={contactMessagesMock} />
    </main>
  );
}
