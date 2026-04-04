'use client';

import { useState } from 'react';
import { Archive, Eye, Mail } from 'lucide-react';
import Link from 'next/link';

import { StatusPill } from '@/components/ui/status-pill';
import { Skeleton } from '@/components/ui/skeleton';

import { cn } from '@/lib/utils';
import { archiveAdminContactMessage } from '@/modules/admin-contact-messages';
import type { ContactMessage } from '@/modules/admin-contact-messages';

interface AdminContactMessagesTableProps {
  messages: ContactMessage[];
  loading?: boolean;
  onArchived?: (updatedMessage: ContactMessage, archivedId: number) => void;
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
}

function truncate(text: string, max = 90) {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}...`;
}

export function AdminContactMessagesTable({
  messages,
  loading = false,
  onArchived,
}: AdminContactMessagesTableProps) {
  const [archivingId, setArchivingId] = useState<number | null>(null);

  async function handleArchive(message: ContactMessage) {
    if (message.status === 'archived') return;

    try {
      setArchivingId(message.id);

      const response = await archiveAdminContactMessage(message.id);

      if (response.data && onArchived) {
        onArchived(response.data, message.id);
      }
    } catch (error) {
      console.error('Failed to archive message:', error);
    } finally {
      setArchivingId(null);
    }
  }

  return (
    <div className="border-border bg-card overflow-hidden rounded-2xl border">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-muted/40">
            <tr className="text-left">
              <th className="text-foreground px-4 py-3 text-sm font-semibold">
                Sender
              </th>
              <th className="text-foreground px-4 py-3 text-sm font-semibold">
                Subject
              </th>
              <th className="text-foreground px-4 py-3 text-sm font-semibold">
                Message
              </th>
              <th className="text-foreground px-4 py-3 text-sm font-semibold">
                Status
              </th>
              <th className="text-foreground px-4 py-3 text-sm font-semibold">
                Date
              </th>
              <th className="text-foreground px-4 py-3 text-sm font-semibold">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-border border-t">
                  <td className="px-4 py-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <Skeleton className="h-4 w-36" />
                  </td>

                  <td className="px-4 py-4">
                    <Skeleton className="h-4 w-56" />
                  </td>

                  <td className="px-4 py-4">
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </td>

                  <td className="px-4 py-4">
                    <Skeleton className="h-4 w-24" />
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </td>
                </tr>
              ))
            ) : messages.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-muted-foreground px-4 py-10 text-center text-sm"
                >
                  No contact messages found.
                </td>
              </tr>
            ) : (
              messages.map((message) => {
                const isArchiving = archivingId === message.id;

                return (
                  <tr
                    key={message.id}
                    className={cn(
                      'border-border hover:bg-muted/20 border-t align-top transition',
                      message.status === 'new' && 'bg-primary/5',
                      isArchiving && 'opacity-60',
                    )}
                  >
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <p className="text-foreground text-sm font-semibold">
                          {message.name}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {message.email}
                        </p>
                        {message.contact_info ? (
                          <p className="text-muted-foreground text-xs">
                            {message.contact_info}
                          </p>
                        ) : null}
                      </div>
                    </td>

                    <td className="text-foreground px-4 py-4 text-sm font-medium">
                      {message.subject}
                    </td>

                    <td className="text-muted-foreground px-4 py-4 text-sm">
                      {truncate(message.message)}
                    </td>

                    <td className="px-4 py-4">
                      <StatusPill status={message.status} />
                    </td>

                    <td className="text-muted-foreground px-4 py-4 text-sm">
                      {formatDate(message.created_at)}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/admin/contact-messages/${message.id}`}
                          className="hover:bg-muted inline-flex rounded-md p-1.5 transition"
                          title="View message"
                        >
                          <Eye className="text-muted-foreground hover:text-foreground h-4 w-4" />
                        </Link>

                        <Link
                          href={`/admin/contact-messages/${message.id}`}
                          className="hover:bg-muted inline-flex rounded-md p-1.5 transition"
                          title="Reply to message"
                        >
                          <Mail className="text-muted-foreground hover:text-primary h-4 w-4" />
                        </Link>

                        {message.status !== 'archived' && (
                          <button
                            type="button"
                            onClick={() => handleArchive(message)}
                            disabled={isArchiving}
                            className="hover:bg-muted inline-flex rounded-md p-1.5 transition disabled:cursor-not-allowed disabled:opacity-50"
                            title="Archive message"
                          >
                            <Archive className="text-muted-foreground hover:text-destructive h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
