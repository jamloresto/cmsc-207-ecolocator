'use client';

import { useEffect, useState } from 'react';
import { MailCheck, MailMinus, MailOpen, MailPlus, Mails } from 'lucide-react';

import { SelectCustom } from '@/components/ui/select-custom';
import { Pagination } from '@/components/shared/pagination';
import { TableToolbar } from '@/components/shared/table-toolbar';

import {
  AdminContactMessagesTable,
  getAdminContactMessages,
} from '@/modules/admin-contact-messages';
import type {
  ContactMessage,
  ContactMessageStatus,
  ContactMessagesListResponse,
} from '@/modules/admin-contact-messages';

export default function AdminContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'' | ContactMessageStatus>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState<
    ContactMessagesListResponse['meta'] | null
  >(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [searchInput]);

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
          setMessages(response.data ?? []);
          setPagination(response.meta ?? null);
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

  function handleArchived(updatedMessage: ContactMessage, archivedId: number) {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === archivedId ? updatedMessage : message,
      ),
    );
  }

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

      <TableToolbar
        searchValue={searchInput}
        onSearchChange={(value) => setSearchInput(value)}
        searchPlaceholder="Search name, email, subject..."
        filters={
          <SelectCustom
            className='min-w-48 lg:min-w-72'
            value={status}
            onChange={(value) => {
              setStatus(value as '' | ContactMessageStatus);
              setPage(1);
            }}
            options={[
              {
                label: 'All statuses',
                value: '',
                icon: <Mails className="text-warning h-4 w-4" />,
              },
              {
                label: 'New',
                value: 'new',
                icon: <MailCheck className="text-primary h-4 w-4" />,
              },
              {
                label: 'Read',
                value: 'read',
                icon: <MailOpen className="text-muted-foreground h-4 w-4" />,
              },
              {
                label: 'Replied',
                value: 'replied',
                icon: (
                  <MailPlus className="text-secondary-foreground h-4 w-4" />
                ),
              },
              {
                label: 'Archived',
                value: 'archived',
                icon: <MailMinus className="text-muted-foreground h-4 w-4" />,
              },
            ]}
          />
        }
      />

      {error ? (
        <div className="border-destructive/20 bg-destructive/5 text-destructive rounded-2xl border p-4 text-sm">
          {error}
        </div>
      ) : null}

      <AdminContactMessagesTable
        messages={messages}
        loading={loading}
        onArchived={handleArchived}
      />

      {!loading && pagination ? (
        <Pagination
          currentPage={pagination.current_page}
          totalPages={pagination.last_page}
          onPageChange={(page) => setPage(page)}
        />
      ) : null}
    </main>
  );
}
