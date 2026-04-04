'use client';

import { useEffect, useState } from 'react';
import { ContactMessagesToolbar } from '@/modules/admin-contact-messages/components/contact-messages-toolbar';
import { AdminContactMessagesTable } from '@/modules/admin-contact-messages/components/admin-contact-messages-table';
import { getAdminContactMessages } from '@/modules/admin-contact-messages/api/contact-messages.api';
import type {
  ContactMessage,
  ContactMessageStatus,
} from '@/modules/admin-contact-messages/types/contact-message.types';

export default function AdminContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'' | ContactMessageStatus>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    async function loadMessages() {
      try {
        setLoading(true);
        setError('');

        const response = await getAdminContactMessages({
          search,
          status,
          page,
          per_page: 10,
        });

        if (!cancelled) {
          setMessages(response.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load contact messages.',
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadMessages();

    return () => {
      cancelled = true;
    };
  }, [search, status, page]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [searchInput]);

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

      <ContactMessagesToolbar
        search={searchInput}
        status={status}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
      />

      {error ? (
        <div className="border-destructive/20 bg-destructive/5 text-destructive rounded-2xl border p-4 text-sm">
          {error}
        </div>
      ) : null}

      <AdminContactMessagesTable messages={messages} loading={loading} />
    </main>
  );
}
