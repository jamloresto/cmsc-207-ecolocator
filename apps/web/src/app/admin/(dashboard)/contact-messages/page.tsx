'use client';

import { useEffect, useState } from 'react';

import { AdminHeading } from '@/components/shared/admin-heading';

import {
  AdminContactMessagesTable,
  getAdminContactMessages,
  type ContactMessage,
  type ContactMessageStatus,
  type ContactMessagesListResponse,
} from '@/modules/admin-contact-messages';

export default function AdminContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'' | ContactMessageStatus>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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
          sort_by: sortBy,
          sort_order: sortOrder,
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
  }, [search, status, page, sortBy, sortOrder]);

  function handleArchived(updatedMessage: ContactMessage, archivedId: number) {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === archivedId ? updatedMessage : message,
      ),
    );
  }

  function handleSort(field: string) {
    setPage(1);

    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  }

  return (
    <main className="space-y-6 p-4 md:p-6">
      <AdminHeading
        title="Admin Contact Messages"
        description="Monitor, review, and manage public inquiries."
      />

      {error ? (
        <div className="border-destructive/20 bg-destructive/5 text-destructive rounded-2xl border p-4 text-sm">
          {error}
        </div>
      ) : null}

      <AdminContactMessagesTable
        messages={messages}
        currentPage={pagination?.current_page ?? 1}
        totalPages={pagination?.last_page ?? 1}
        totalItems={pagination?.total}
        searchValue={searchInput}
        statusFilter={status}
        loading={loading}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        onSearchChange={setSearchInput}
        onStatusFilterChange={(value) => {
          setStatus(value as '' | ContactMessageStatus);
          setPage(1);
        }}
        onPageChange={setPage}
        onArchived={handleArchived}
      />
    </main>
  );
}
